import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { analyzeWorkflow } from "./openai";
import { setupAuth, isAuthenticated } from "./auth";
import express from "express";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const workflows = await storage.getWorkflows(userId);
      const totalTimeSaved = workflows.reduce((acc, w) => acc + (w.aiAnalysis?.summary?.totalTimeSaved || 0), 0);
      const avgEfficiency = workflows.length > 0 
        ? workflows.reduce((acc, w) => acc + (w.aiAnalysis?.summary?.efficiencyGain || 0), 0) / workflows.length 
        : 0;

      res.json({
        totalWorkflows: user.totalWorkflows,
        monthlyWorkflows: user.workflowsUsedThisMonth,
        timeSaved: totalTimeSaved,
        efficiency: Math.round(avgEfficiency),
        subscriptionStatus: user.subscriptionStatus || 'free'
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Workflows endpoints
  app.get('/api/workflows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.post('/api/workflows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check workflow limits based on subscription
      if (user.subscriptionStatus === 'free' && user.totalWorkflows >= 1) {
        return res.status(403).json({ 
          message: "Free trial limit reached. Please upgrade to create more workflows.",
          code: "TRIAL_LIMIT_REACHED"
        });
      }

      const workflow = await storage.createWorkflow({
        userId,
        name: req.body.name,
        description: req.body.description || '',
        flowData: req.body.flowData,
        status: 'draft'
      });

      // Increment usage counters
      await storage.incrementWorkflowUsage(userId);

      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.get('/api/workflows/:id', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/workflows/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);

      const workflow = await storage.updateWorkflow({
        id: workflowId,
        userId,
        ...req.body
      });

      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.delete('/api/workflows/:id', isAuthenticated, async (req: any, res) => {
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

  // AI Analysis endpoint
  app.post('/api/workflows/:id/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflowId = parseInt(req.params.id);

      const workflow = await storage.getWorkflow(workflowId, userId);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      const analysis = await analyzeWorkflow(workflow.flowData, workflow.name);

      const updatedWorkflow = await storage.updateWorkflow({
        id: workflowId,
        userId,
        aiAnalysis: analysis,
        mermaidCode: analysis.mermaidCode || null
      });

      res.json(updatedWorkflow);
    } catch (error) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ message: "Failed to analyze workflow" });
    }
  });

  // Templates endpoints
  app.get('/api/templates', async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
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

  // Stripe webhook for subscription updates
  if (stripe) {
    app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
      const sig = req.headers['stripe-signature'] as string;
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;

            if (customer.email) {
              const user = await storage.getUserByEmail(customer.email);
              if (user) {
                await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);
                await storage.updateSubscriptionStatus(user.id, subscription.status);
              }
            }
            break;

          case 'customer.subscription.deleted':
            const deletedSub = event.data.object as Stripe.Subscription;
            const deletedCustomer = await stripe.customers.retrieve(deletedSub.customer as string) as Stripe.Customer;

            if (deletedCustomer.email) {
              const user = await storage.getUserByEmail(deletedCustomer.email);
              if (user) {
                await storage.updateSubscriptionStatus(user.id, 'canceled');
              }
            }
            break;

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
      }
    });

    // Create Stripe checkout session
    app.post('/api/create-checkout-session', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.id;
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const { planType } = req.body;
        const priceId = planType === 'starter' ? process.env.STRIPE_STARTER_PRICE_ID : process.env.STRIPE_PRO_PRICE_ID;

        if (!priceId) {
          return res.status(400).json({ message: "Invalid plan type" });
        }

        const session = await stripe.checkout.sessions.create({
          customer_email: user.email,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${req.headers.origin}/settings?success=true`,
          cancel_url: `${req.headers.origin}/subscribe?canceled=true`,
          metadata: {
            userId: user.id,
          },
        });

        res.json({ url: session.url });
      } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: "Failed to create checkout session" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}