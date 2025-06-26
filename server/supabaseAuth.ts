import type { Express, RequestHandler } from "express";
import { supabaseServiceRole } from "./supabaseClient";
import { storage } from "./storage";

export async function setupSupabaseAuth(app: Express) {
  // Middleware to verify Supabase JWT token
  app.use('/api', async (req, res, next) => {
    // Skip auth for public routes
    const publicRoutes = ['/api/auth/callback', '/api/auth/signin', '/api/auth/signout'];
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    
    try {
      const { data: { user }, error } = await supabaseServiceRole.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Auth callback endpoint
  app.post('/api/auth/callback', async (req, res) => {
    const { access_token, refresh_token, user } = req.body;
    
    try {
      // Upsert user in database
      await storage.upsertUser({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        profile_image_url: user.user_metadata?.avatar_url,
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user endpoint
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Bypass auth middleware for development/demo purposes
export const bypassAuth: RequestHandler = (req, res, next) => {
  // Mock user for development
  req.user = {
    id: "mock-user",
    email: "demo@example.com"
  };
  next();
};