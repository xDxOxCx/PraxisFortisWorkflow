import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import bcrypt from "bcrypt";

// Session configuration
export function setupSession(app: Express) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'development-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  }));
}

// Extend session type
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

// Authentication middleware
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (req.session && req.session.userId) {
    req.user = { claims: { sub: req.session.userId } };
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Generate random user ID
function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Setup auth routes
export function setupAuthRoutes(app: Express) {
  // Sign up
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const userId = generateUserId();
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        passwordHash: hashedPassword,
        subscriptionStatus: "free",
        workflowsUsedThisMonth: 0,
        totalWorkflows: 0,
      });
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  
  // Sign in
  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        message: "Signed in successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });
  
  // Sign out
  app.post('/api/auth/signout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to sign out" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Signed out successfully" });
    });
  });
  
  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
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