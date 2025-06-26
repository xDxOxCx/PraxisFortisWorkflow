import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { analyzeWorkflow } from "./openai";
import express from "express";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
}) : null;

// Mock user for development - this creates a working demo environment
const mockUser = {
  id: "demo-user-123",
  email: "demo@workflow-optimizer.com",
  firstName: "Demo",
  lastName: "User",
  subscriptionStatus: "free",
  workflowsUsedThisMonth: 0
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple mock auth middleware for demo purposes
  const mockAuth = async (req: any, res: any, next: any) => {
    // Ensure user exists in database
    try {
      let user = await storage.getUser(mockUser.id);
      if (!user) {
        user = await storage.upsertUser({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          subscriptionStatus: "free",
          totalWorkflows: 0,
          monthlyWorkflows: 0
        });
      }
      req.user = { claims: { sub: mockUser.id } };
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Authentication error" });
    }
  };

  // Auth routes - simple demo authentication
  app.get('/api/login', (req, res) => {
    // In demo mode, just redirect to home
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    // In demo mode, just redirect to home
    res.redirect('/');
  });

  app.get('/api/auth/user', mockAuth, async (req: any, res) => {
    try {
      console.log("Auth user endpoint hit, req.user:", req.user);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      console.log("Retrieved user:", user);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workflows routes
  app.get('/api/workflows', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.get('/api/workflows/:id', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/workflows', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflowData = {
        ...req.body,
        userId,
      };
      
      const workflow = await storage.createWorkflow(workflowData);
      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.put('/api/workflows/:id', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflowId = parseInt(req.params.id);
      
      // Verify ownership
      const existingWorkflow = await storage.getWorkflow(workflowId, userId);
      if (!existingWorkflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      const workflowData = {
        id: workflowId,
        ...req.body,
      };
      
      const workflow = await storage.updateWorkflow(workflowData);
      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.delete('/api/workflows/:id', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflowId = parseInt(req.params.id);
      
      await storage.deleteWorkflow(workflowId, userId);
      res.json({ message: "Workflow deleted successfully" });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ message: "Failed to delete workflow" });
    }
  });

  // AI Analysis route
  app.post('/api/workflows/:id/analyze', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflowId = parseInt(req.params.id);
      
      // Verify ownership
      const workflow = await storage.getWorkflow(workflowId, userId);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      // Analyze the workflow
      const analysis = await analyzeWorkflow(workflow.flowData, workflow.name);
      
      // Update workflow with analysis
      const updatedWorkflow = await storage.updateWorkflow({
        id: workflowId,
        aiAnalysis: analysis as any,
        status: "analyzed",
      });
      
      res.json(updatedWorkflow);
    } catch (error) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ message: "Failed to analyze workflow" });
    }
  });

  // Templates routes
  app.get('/api/templates', async (req, res) => {
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

  // Stripe subscription routes
  app.post('/api/create-checkout-session', mockAuth, async (req: any, res) => {
    try {
      const { priceId } = req.body;
      const userId = req.user.claims.sub;
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/subscribe?success=true`,
        cancel_url: `${req.headers.origin}/subscribe?canceled=true`,
        client_reference_id: userId,
      });
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}