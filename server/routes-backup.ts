import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { analyzeWorkflow } from "./openai";
import { bypassAuth } from "./supabaseAuth";
import express from "express";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // Updated to a valid version
});

// Mock user for bypassed auth
const mockUser = {
  id: "mock-user",
  email: "demo@example.com", 
  first_name: "Demo",
  last_name: "User"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock auth middleware that returns mock user
  const mockAuth = (req: any, res: any, next: any) => {
    req.user = mockUser;
    next();
  };

  // Auth routes
  app.get('/api/auth/user', mockAuth, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workflows routes
  app.get('/api/workflows', mockAuth, async (req: any, res) => {
    try {
      const workflows = await storage.getWorkflows(req.user.id);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.post('/api/workflows', mockAuth, async (req: any, res) => {
    try {
      const workflowData = {
        user_id: req.user.id,
        name: req.body.name,
        description: req.body.description || '',
        flow_data: req.body.flow_data,
        status: 'draft'
      };
      
      const workflow = await storage.createWorkflow(workflowData);
      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.patch('/api/workflows/:id', mockAuth, async (req: any, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const updateData = {
        id: workflowId,
        ...req.body
      };
      
      const workflow = await storage.updateWorkflow(updateData);
      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.post('/api/workflows/:id/analyze', mockAuth, async (req: any, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId, req.user.id);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      const analysis = await analyzeWorkflow(workflow.flow_data, workflow.name);
      
      // Update workflow with analysis
      await storage.updateWorkflow({
        id: workflowId,
        ai_analysis: analysis,
        mermaid_code: analysis.mermaidCode
      });

      res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ message: "Failed to analyze workflow", error: error.message });
    }
  });

  // Templates routes
  app.get('/api/templates', bypassAuth, async (req, res) => {
    const templates = [
      {
        id: 1,
        name: "Patient Check-in Process",
        description: "Streamlined patient registration and check-in workflow for specialty clinics",
        category: "Patient Care",
        icon: "UserCheck",
        flow_data: {
          steps: [
            { id: "1", text: "Patient arrives at clinic", type: "start" },
            { id: "2", text: "Verify insurance and eligibility", type: "process" },
            { id: "3", text: "Complete registration forms", type: "process" },
            { id: "4", text: "Update medical history", type: "process" },
            { id: "5", text: "Take vital signs", type: "process" },
            { id: "6", text: "Patient ready for provider", type: "end" }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Prescription Management",
        description: "Efficient prescription processing and patient medication management",
        category: "Medication",
        icon: "Pill",
        flow_data: {
          steps: [
            { id: "1", text: "Provider writes prescription", type: "start" },
            { id: "2", text: "Check drug interactions", type: "decision" },
            { id: "3", text: "Verify insurance coverage", type: "process" },
            { id: "4", text: "Send to pharmacy", type: "process" },
            { id: "5", text: "Patient education provided", type: "process" },
            { id: "6", text: "Prescription completed", type: "end" }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: "Lab Result Processing",
        description: "Systematic approach to reviewing and communicating lab results",
        category: "Diagnostics",
        icon: "TestTube",
        flow_data: {
          steps: [
            { id: "1", text: "Lab results received", type: "start" },
            { id: "2", text: "Provider reviews results", type: "process" },
            { id: "3", text: "Results abnormal?", type: "decision" },
            { id: "4", text: "Contact patient immediately", type: "process" },
            { id: "5", text: "Schedule follow-up", type: "process" },
            { id: "6", text: "Document in patient record", type: "end" }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: "Appointment Scheduling",
        description: "Optimized patient appointment scheduling and reminder system",
        category: "Scheduling",
        icon: "Calendar",
        flow_data: {
          steps: [
            { id: "1", text: "Patient requests appointment", type: "start" },
            { id: "2", text: "Check provider availability", type: "process" },
            { id: "3", text: "Verify insurance authorization", type: "process" },
            { id: "4", text: "Schedule appointment", type: "process" },
            { id: "5", text: "Send confirmation and reminders", type: "process" },
            { id: "6", text: "Appointment confirmed", type: "end" }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        name: "Billing and Claims",
        description: "Streamlined billing process and insurance claim submission",
        category: "Financial",
        icon: "CreditCard",
        flow_data: {
          steps: [
            { id: "1", text: "Service completed", type: "start" },
            { id: "2", text: "Code procedures and diagnoses", type: "process" },
            { id: "3", text: "Verify coding accuracy", type: "decision" },
            { id: "4", text: "Submit insurance claim", type: "process" },
            { id: "5", text: "Process patient payment", type: "process" },
            { id: "6", text: "Billing cycle completed", type: "end" }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    res.json(templates);
  });

  // Get single template route
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

  // Analyze workflow route (for direct workflow analysis)
  app.post('/api/analyze-workflow', bypassAuth, async (req: any, res) => {
    try {
      const { name, description, flow_data } = req.body;
      
      if (!flow_data || !flow_data.steps || flow_data.steps.length === 0) {
        return res.status(400).json({ message: "No workflow steps provided" });
      }

      const analysis = await analyzeWorkflow(flow_data, name || "Untitled Workflow");
      res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ message: "Failed to analyze workflow", error: error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // User stats route
  app.get('/api/user/stats', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const workflows = await storage.getWorkflows(userId);
      
      const totalWorkflows = workflows.length;
      const timeSaved = workflows.reduce((total, w) => total + 0, 0); // Simplified for now
      const avgEfficiency = workflows.length > 0 ? 85 : 0; // Simplified for now
      
      res.json({
        totalWorkflows,
        monthlyWorkflows: 0, // Simplified for now
        timeSaved: Math.round(timeSaved),
        efficiency: Math.round(avgEfficiency),
        subscriptionStatus: 'free'
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}