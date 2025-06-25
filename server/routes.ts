import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupSupabaseAuth, bypassAuth } from "./supabaseAuth";

// Temporary bypass for testing without OAuth (remove after OAuth setup)
const bypassAuth = (req: any, res: any, next: any) => {
  req.user = {
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: {
      first_name: 'Test',
      last_name: 'User',
      avatar_url: null
    }
  };
  next();
};
import { analyzeWorkflow, generateMermaidDiagram } from "./openai";
import { insertWorkflowSchema, updateWorkflowSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (disabled for testing)
  // await setupSupabaseAuth(app);

  // Workflow routes (using bypassAuth for testing - change to bypassAuth after OAuth setup)
  app.get('/api/workflows', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.get('/api/workflows/:id', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId, userId);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      res.json(workflow);
    } catch (error) {
      console.error("Error fetching workflow:", error);
      res.status(500).json({ message: "Failed to fetch workflow" });
    }
  });

  app.post('/api/workflows', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check usage limits for free users
      if (user.subscriptionStatus === 'free' && user.workflowsUsedThisMonth >= 1) {
        return res.status(403).json({ 
          message: "Monthly workflow limit reached. Please upgrade to Pro.",
          code: "LIMIT_REACHED"
        });
      }

      const workflow_data = insertWorkflowSchema.parse({
        ...req.body,
        user_id: userId,
      });

      const workflow = await storage.createWorkflow(workflow_data);
      
      // Increment usage counter
      await storage.incrementWorkflowUsage(userId);

      res.json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      }
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.put('/api/workflows/:id', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);
      
      // Verify ownership
      const existingWorkflow = await storage.getWorkflow(workflowId, userId);
      if (!existingWorkflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      const workflow_data = updateWorkflowSchema.parse({
        ...req.body,
        id: workflowId,
      });

      const workflow = await storage.updateWorkflow(workflow_data);
      res.json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      }
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.delete('/api/workflows/:id', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);
      
      await storage.deleteWorkflow(workflowId, userId);
      res.json({ message: "Workflow deleted successfully" });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ message: "Failed to delete workflow" });
    }
  });

  // AI Analysis route
  app.post('/api/workflows/:id/analyze', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);
      
      const workflow = await storage.getWorkflow(workflowId, userId);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      const analysis = await analyzeWorkflow(workflow.flow_data, workflow.name);
      
      // Update workflow with analysis results
      await storage.updateWorkflow({
        id: workflowId,
        ai_analysis: analysis,
        mermaid_code: analysis.mermaid_code,
        status: "analyzed",
        timeSaved: analysis.summary.totalTimeSaved,
        efficiencyGain: analysis.summary.efficiencyGain,
      });

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ message: "Failed to analyze workflow" });
    }
  });

  // Templates routes
  app.get('/api/templates', bypassAuth, async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', bypassAuth, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Stripe subscription routes
  app.post('/api/get-or-create-subscription', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        res.send({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
        return;
      }
      
      if (!user.email) {
        throw new Error('No user email on file');
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || "price_1234567890", // User needs to set this
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);
  
      res.send({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe subscription error:", error);
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  // Stripe webhook for subscription updates
  app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        // Find user by stripe customer ID and update subscription status
        const users = await storage.getUsers();
        const user = users.find(u => u.stripeCustomerId === customer.id);
        if (user) {
          await storage.updateSubscriptionStatus(user.id, 'active');
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        const failedSubscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string);
        const failedCustomer = await stripe.customers.retrieve(failedSubscription.customer as string);
        
        const failedUsers = await storage.getUsers();
        const failedUser = failedUsers.find(u => u.stripeCustomerId === failedCustomer.id);
        if (failedUser) {
          await storage.updateSubscriptionStatus(failedUser.id, 'past_due');
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  });

  // User stats route
  app.get('/api/user/stats', bypassAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflows = await storage.getWorkflows(userId);
      const user = await storage.getUser(userId);
      
      const totalTimeSaved = workflows.reduce((total, w) => total + (w.timeSaved || 0), 0);
      const avgEfficiency = workflows.length > 0 
        ? workflows.reduce((total, w) => total + (w.efficiencyGain || 0), 0) / workflows.length 
        : 0;

      res.json({
        totalWorkflows: workflows.length,
        monthlyWorkflows: user?.workflowsUsedThisMonth || 0,
        timeSaved: totalTimeSaved,
        efficiency: Math.round(avgEfficiency),
        subscriptionStatus: user?.subscriptionStatus || 'free',
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
