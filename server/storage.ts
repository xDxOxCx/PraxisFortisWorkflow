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

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabaseServiceRole
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined;
      throw error;
    }
    return data;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabaseServiceRole
      .from('users')
      .upsert(userData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const { data, error } = await supabaseServiceRole
      .from('users')
      .update({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    const { data, error } = await supabaseServiceRole
      .from('users')
      .update({
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async incrementWorkflowUsage(userId: string): Promise<User> {
     const { data, error } = await supabaseServiceRole
      .from('users')
      .update({
        workflowsUsedThisMonth: () => 'workflows_used_this_month + 1',
        updatedAt: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async resetMonthlyWorkflows(userId: string): Promise<User> {
    const { data, error } = await supabaseServiceRole
      .from('users')
      .update({
        workflowsUsedThisMonth: 0,
        lastWorkflowReset: new Date(),
        updatedAt: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  // Workflow operations
  async getWorkflows(userId: string): Promise<Workflow[]> {
    const { data, error } = await supabaseServiceRole
      .from('workflows')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
    return data || [];
  }

  async getWorkflow(id: number, userId: string): Promise<Workflow | undefined> {
    const { data, error } = await supabaseServiceRole
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createWorkflow(workflow: WorkflowInsert): Promise<Workflow> {
    const { data, error } = await supabaseServiceRole
      .from('workflows')
      .insert(workflow)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateWorkflow(workflow: WorkflowUpdate): Promise<Workflow> {
    const { id, ...updates } = workflow;

    const { data, error } = await supabaseServiceRole
      .from('workflows')
      .update({
        ...updates,
        updatedAt: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteWorkflow(id: number, userId: string): Promise<void> {
    const { error } = await supabaseServiceRole
      .from('workflows')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw error;
    }
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    const { data, error } = await supabaseServiceRole
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('name');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const { data, error } = await supabaseServiceRole
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }
    return data;
  }

  async createTemplate(template: TemplateInsert): Promise<Template> {
    const { data, error } = await supabaseServiceRole
      .from('templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  }
}

export const storage = new SupabaseStorage();