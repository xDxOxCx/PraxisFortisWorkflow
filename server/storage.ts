
import {
  users,
  workflows,
  templates,
  type User,
  type UpsertUser,
  type Workflow,
  type InsertWorkflow,
  type UpdateWorkflow,
  type Template,
  type InsertTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string): Promise<User>;
  incrementWorkflowUsage(userId: string): Promise<User>;
  resetMonthlyWorkflows(userId: string): Promise<User>;

  // Workflow operations
  getWorkflows(userId: string): Promise<Workflow[]>;
  getWorkflow(id: number, userId: string): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(workflow: UpdateWorkflow): Promise<Workflow>;
  deleteWorkflow(id: number, userId: string): Promise<void>;

  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    console.log('Upserting user:', userData.id, userData.email);

    try {
      // First check if user exists by Supabase ID
      const existingUserById = await this.getUser(userData.id);
      
      if (existingUserById) {
        // Update existing user by ID
        const [user] = await db
          .update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName || existingUserById.firstName,
            lastName: userData.lastName || existingUserById.lastName,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        
        console.log('Updated existing user by ID:', user.id);
        return user;
      }

      // Check if user exists by email (legacy user)
      const existingUserByEmail = await this.getUserByEmail(userData.email);
      
      if (existingUserByEmail) {
        // Update existing user's ID to match Supabase ID
        const [user] = await db
          .update(users)
          .set({
            id: userData.id, // Update to use Supabase ID
            firstName: userData.firstName || existingUserByEmail.firstName,
            lastName: userData.lastName || existingUserByEmail.lastName,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        
        console.log('Updated existing user by email to use Supabase ID:', user.id);
        return user;
      }

      // Create new user
      const [user] = await db
        .insert(users)
        .values({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          subscriptionStatus: userData.subscriptionStatus || 'free',
          workflowsUsedThisMonth: userData.workflowsUsedThisMonth || 0,
          totalWorkflows: userData.totalWorkflows || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      console.log('Created new user:', user.id);
      return user;
    } catch (error: any) {
      console.error('Upsert user error:', error);
      throw new Error(`Failed to upsert user: ${error.message}`);
    }
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementWorkflowUsage(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        workflowsUsedThisMonth: sql`${users.workflowsUsedThisMonth} + 1`,
        totalWorkflows: sql`${users.totalWorkflows} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async resetMonthlyWorkflows(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        workflowsUsedThisMonth: 0,
        lastWorkflowReset: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getWorkflows(userId: string): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.userId, userId));
  }

  async getWorkflow(id: number, userId: string): Promise<Workflow | undefined> {
    const [workflow] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, id) && eq(workflows.userId, userId));
    return workflow || undefined;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db
      .insert(workflows)
      .values(workflow)
      .returning();
    return newWorkflow;
  }

  async updateWorkflow(workflow: UpdateWorkflow): Promise<Workflow> {
    const { id, ...updateData } = workflow;
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, id))
      .returning();
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number, userId: string): Promise<void> {
    await db
      .delete(workflows)
      .where(eq(workflows.id, id) && eq(workflows.userId, userId));
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.isPublic, true));
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }
}

export const storage = new DatabaseStorage();
