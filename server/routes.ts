
import type { Express } from "express";
import { createServer } from "http";
import { analyzeWorkflow } from "./openai";
import { storage } from "./storage";

// Demo authentication data
const DEMO_USERS = [
  { 
    id: 1, 
    email: "demo@workflow-optimizer.com", 
    password: "demo123", 
    firstName: "Demo", 
    lastName: "User",
    subscriptionStatus: "free",
    totalWorkflows: 0,
    monthlyWorkflows: 0
  },
  { 
    id: 2, 
    email: "test@healthcare.com", 
    password: "test123", 
    firstName: "Test", 
    lastName: "User",
    subscriptionStatus: "pro",
    totalWorkflows: 5,
    monthlyWorkflows: 2
  },
];

// Sample workflow templates
const TEMPLATES = [
  {
    id: 1,
    name: "Patient Check-in Process",
    description: "Streamline patient arrival and registration",
    category: "Patient Care",
    difficulty: "Beginner",
    estimatedTime: "15 minutes",
    steps: [
      "Patient arrives at reception",
      "Verify insurance information",
      "Update patient demographics",
      "Collect copayment",
      "Direct patient to waiting area",
      "Notify clinical staff of arrival"
    ]
  },
  {
    id: 2,
    name: "Prescription Management",
    description: "Efficient medication ordering and tracking",
    category: "Clinical",
    difficulty: "Intermediate",
    estimatedTime: "20 minutes",
    steps: [
      "Review patient medication history",
      "Check for drug interactions",
      "Generate prescription",
      "Send to pharmacy",
      "Schedule follow-up",
      "Document in patient record"
    ]
  },
  {
    id: 3,
    name: "Lab Results Processing",
    description: "Handle incoming lab results efficiently",
    category: "Clinical",
    difficulty: "Advanced",
    estimatedTime: "25 minutes",
    steps: [
      "Receive lab results electronically",
      "Review for critical values",
      "Route to appropriate provider",
      "Contact patient with results",
      "Schedule follow-up if needed",
      "File in patient chart"
    ]
  },
  {
    id: 4,
    name: "Appointment Scheduling",
    description: "Optimize patient appointment booking",
    category: "Administrative",
    difficulty: "Beginner",
    estimatedTime: "10 minutes",
    steps: [
      "Check provider availability",
      "Verify patient insurance",
      "Book appointment slot",
      "Send confirmation to patient",
      "Add to provider schedule",
      "Set appointment reminders"
    ]
  },
  {
    id: 5,
    name: "Billing and Claims Processing",
    description: "Streamline insurance claims submission",
    category: "Administrative",
    difficulty: "Advanced",
    estimatedTime: "30 minutes",
    steps: [
      "Verify service codes",
      "Check insurance eligibility",
      "Generate claim form",
      "Submit to insurance",
      "Track claim status",
      "Process payment or denial"
    ]
  }
];

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.user = user;
      res.json({ 
        success: true, 
        user: user,
        message: "Logged in successfully" 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create new user
      const newUser = {
        id: DEMO_USERS.length + 1,
        email,
        password,
        firstName,
        lastName,
        subscriptionStatus: "free" as const,
        totalWorkflows: 0,
        monthlyWorkflows: 0
      };

      DEMO_USERS.push(newUser);
      req.session.user = newUser;

      res.json({ 
        success: true, 
        user: newUser,
        message: "Account created successfully" 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, (req, res) => {
    res.json({ user: req.session.user });
  });

  // Workflow routes
  app.get("/api/workflows", requireAuth, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const workflows = await storage.getUserWorkflows(userId.toString());
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.post("/api/workflows", requireAuth, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const { name, description, steps } = req.body;

      // Check workflow limits for free users
      if (req.session.user.subscriptionStatus === 'free' && req.session.user.totalWorkflows >= 1) {
        return res.status(403).json({ 
          error: "Free trial limit reached. Please upgrade to create more workflows." 
        });
      }

      const workflow = await storage.createWorkflow({
        userId: userId.toString(),
        name,
        description,
        steps,
        flowData: { nodes: [], edges: [] }
      });

      // Update user's workflow count
      req.session.user.totalWorkflows += 1;
      req.session.user.monthlyWorkflows += 1;

      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ error: "Failed to create workflow" });
    }
  });

  app.put("/api/workflows/:id", requireAuth, async (req, res) => {
    try {
      const workflowId = req.params.id;
      const updates = req.body;
      
      const workflow = await storage.updateWorkflow(workflowId, updates);
      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ error: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", requireAuth, async (req, res) => {
    try {
      const workflowId = req.params.id;
      await storage.deleteWorkflow(workflowId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ error: "Failed to delete workflow" });
    }
  });

  // Template routes
  app.get("/api/templates", (req, res) => {
    res.json(TEMPLATES);
  });

  app.get("/api/templates/:id", (req, res) => {
    const template = TEMPLATES.find(t => t.id === parseInt(req.params.id));
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  });

  // AI Analysis route
  app.post("/api/analyze-workflow", requireAuth, async (req, res) => {
    try {
      const { workflowName, steps } = req.body;
      
      if (!workflowName || !steps || !Array.isArray(steps)) {
        return res.status(400).json({ error: "Invalid workflow data" });
      }

      console.log("Analyzing workflow:", workflowName, "with", steps.length, "steps");
      
      const analysis = await analyzeWorkflow(steps, workflowName);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing workflow:", error);
      res.status(500).json({ error: "Failed to analyze workflow" });
    }
  });

  // Statistics route
  app.get("/api/stats", requireAuth, (req, res) => {
    const user = req.session.user;
    res.json({
      totalWorkflows: user.totalWorkflows || 0,
      monthlyWorkflows: user.monthlyWorkflows || 0,
      subscriptionStatus: user.subscriptionStatus || 'free',
      trialWorkflowsRemaining: user.subscriptionStatus === 'free' ? Math.max(0, 1 - (user.totalWorkflows || 0)) : null
    });
  });

  return server;
}
