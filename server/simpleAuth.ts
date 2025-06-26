import type { Express, RequestHandler } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";

// Simple demo user for instant access
const DEMO_USERS = [
  { email: "demo@workflow-optimizer.com", password: "demo123", name: "Demo User" },
  { email: "test@healthcare.com", password: "test123", name: "Test User" },
];

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "demo-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

export async function setupSimpleAuth(app: Express) {
  app.use(getSession());

  // Demo login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if it's a demo user
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (demoUser) {
        (req.session as any).user = {
          id: 1,
          email: demoUser.email,
          firstName: demoUser.name.split(' ')[0],
          lastName: demoUser.name.split(' ')[1] || '',
          subscriptionStatus: 'free',
          totalWorkflows: 0,
          monthlyWorkflows: 0,
        };
        
        return res.json({ 
          success: true, 
          user: (req.session as any).user,
          message: "Logged in successfully" 
        });
      }

      res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Demo signup endpoint (instant account creation)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Create instant demo account
      const newUser = {
        id: Math.floor(Math.random() * 10000),
        email,
        firstName: firstName || 'New',
        lastName: lastName || 'User',
        subscriptionStatus: 'free',
        totalWorkflows: 0,
        monthlyWorkflows: 0,
      };

      (req.session as any).user = newUser;
      
      res.json({ 
        success: true, 
        user: newUser,
        message: "Account created successfully! No email verification needed." 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any)?.user;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = (req.session as any)?.user;
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};