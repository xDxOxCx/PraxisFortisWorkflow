import { supabaseServiceRole } from "./db";
import type { Database } from "@shared/database.types";

// Interface for storage operations
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];
type Workflow = Database['public']['Tables']['workflows']['Row'];
type WorkflowInsert = Database['public']['Tables']['workflows']['Insert'];
type WorkflowUpdate = Database['public']['Tables']['workflows']['Update'];
type Template = Database['public']['Tables']['templates']['Row'];
type TemplateInsert = Database['public']['Tables']['templates']['Insert'];

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UserInsert): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string): Promise<User>;
  incrementWorkflowUsage(userId: string): Promise<User>;
  resetMonthlyWorkflows(userId: string): Promise<User>;

  // Workflow operations
  getWorkflows(userId: string): Promise<Workflow[]>;
  getWorkflow(id: number, userId: string): Promise<Workflow | undefined>;
  createWorkflow(workflow: WorkflowInsert): Promise<Workflow>;
  updateWorkflow(workflow: WorkflowUpdate): Promise<Workflow>;
  deleteWorkflow(id: number, userId: string): Promise<void>;

  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: TemplateInsert): Promise<Template>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: "active",
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
        workflowsUsedThisMonth: db.$count(workflows.id),
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

  // Workflow operations
  async getWorkflows(userId: string): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(workflows.updatedAt);
  }

  async getWorkflow(id: number, userId: string): Promise<Workflow | undefined> {
    const [workflow] = await db
      .select()
      .from(workflows)
      .where(and(eq(workflows.id, id), eq(workflows.userId, userId)));
    return workflow;
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db
      .insert(workflows)
      .values(workflow)
      .returning();
    return newWorkflow;
  }

  async updateWorkflow(workflow: UpdateWorkflow): Promise<Workflow> {
    const { id, ...updates } = workflow;
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, id))
      .returning();
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number, userId: string): Promise<void> {
    await db
      .delete(workflows)
      .where(and(eq(workflows.id, id), eq(workflows.userId, userId)));
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(templates.name);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }
}

export const storage = new SupabaseStorage();
