// Simple in-memory storage for demo purposes
// In production, this would connect to a real database

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: 'free' | 'starter' | 'pro';
  totalWorkflows: number;
  monthlyWorkflows: number;
}

interface Workflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  steps: string[];
  flowData?: any;
  createdAt: Date;
  updatedAt: Date;
}

class Storage {
  private users: Map<string, User> = new Map();
  private workflows: Map<string, Workflow> = new Map();

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async upsertUser(userData: Omit<User, 'id'> & { id?: string }): Promise<User> {
    const userId = userData.id || Math.random().toString(36).substr(2, 9);
    const user: User = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      subscriptionStatus: userData.subscriptionStatus,
      totalWorkflows: userData.totalWorkflows,
      monthlyWorkflows: userData.monthlyWorkflows,
    };

    this.users.set(userId, user);
    return user;
  }

  async getUserWorkflows(userId: string): Promise<Workflow[]> {
    const userWorkflows: Workflow[] = [];
    for (const workflow of this.workflows.values()) {
      if (workflow.userId === userId) {
        userWorkflows.push(workflow);
      }
    }
    return userWorkflows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createWorkflow(data: {
    userId: string;
    name: string;
    description?: string;
    steps: string[];
    flowData?: any;
  }): Promise<Workflow> {
    const id = Math.random().toString(36).substr(2, 9);
    const workflow: Workflow = {
      id,
      userId: data.userId,
      name: data.name,
      description: data.description,
      steps: data.steps,
      flowData: data.flowData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(workflowId: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return null;
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date(),
    };

    this.workflows.set(workflowId, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(workflowId: string): Promise<boolean> {
    return this.workflows.delete(workflowId);
  }

  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    return this.workflows.get(workflowId) || null;
  }
}

export const storage = new Storage();