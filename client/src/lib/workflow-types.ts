export interface WorkflowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    duration?: number;
    assignedRole?: string;
    notes?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ComponentPaletteItem {
  type: 'start' | 'process' | 'decision' | 'end';
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const componentTypes: ComponentPaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    icon: 'fas fa-play',
    color: 'emerald',
    description: 'Beginning of the workflow'
  },
  {
    type: 'process',
    label: 'Process Step',
    icon: 'fas fa-cog',
    color: 'blue',
    description: 'A step or action in the workflow'
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: 'fas fa-question',
    color: 'amber',
    description: 'A decision point with multiple paths'
  },
  {
    type: 'end',
    label: 'End',
    icon: 'fas fa-stop',
    color: 'gray',
    description: 'End of the workflow'
  }
];

export interface AIAnalysis {
  improvements: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    timeSaved: number;
    category: 'efficiency' | 'bottleneck' | 'automation' | 'lean';
    implementationSteps: Array<{
      step: string;
      timeRequired: string;
      resources: string[];
      owner: string;
    }>;
    priority: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  mermaidCode: string;
  summary: {
    totalTimeSaved: number;
    efficiencyGain: number;
    riskAreas: string[];
    recommendations: string[];
  };
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  flowData: WorkflowData;
  icon: string;
}
