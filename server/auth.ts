
import type { Request, Response, NextFunction, Express } from "express";
import { supabase } from "./supabaseClient";
import { storage } from "./storage";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function setupAuth(app: Express) {
  // Auth callback endpoint - creates user in database after Supabase auth
  app.post('/api/auth/callback', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: "Invalid token" });
      }
      
      // Create or update user in database
      const dbUser = await storage.upsertUser({
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata?.first_name || null,
        lastName: user.user_metadata?.last_name || null,
        subscriptionStatus: "free",
        workflowsUsedThisMonth: 0,
        totalWorkflows: 0,
      });

      res.json({ success: true, user: dbUser });
    } catch (error: any) {
      console.error('Auth callback error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user endpoint
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for session-based authentication first (for our demo auth system)
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }

    // Fallback to Bearer token authentication for API clients
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        req.user = user;
        return next();
      }
    }

    return res.status(401).json({ message: "Authentication required" });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
