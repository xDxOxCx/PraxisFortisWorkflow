import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Save, 
  ArrowLeft,
  Type,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';

interface WorkflowStep {
  id: string;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [textInput, setTextInput] = useState('');
  const [newStepText, setNewStepText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get template ID from URL params if exists
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template');

  // Add a new step
  const addStep = () => {
    if (!newStepText.trim()) return;
    
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      text: newStepText.trim(),
      type: steps.length === 0 ? 'start' : 'process'
    };
    
    setSteps([...steps, newStep]);
    setNewStepText('');
    
    toast({
      title: "Step Added",
      description: "New workflow step has been added"
    });
  };

  // Remove a step
  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
    toast({
      title: "Step Removed",
      description: "Workflow step has been removed"
    });
  };

  // Move step up
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    setSteps(newSteps);
  };

  // Move step down
  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
  };

  // Update step text
  const updateStepText = (stepId: string, newText: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, text: newText } : step
    ));
  };

  // Load template if templateId is provided
  useEffect(() => {
    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then(template => {
          if (template && template.flow_data) {
            setWorkflowName(template.name);
            setWorkflowDescription(template.description);
            
            // Convert template nodes to steps
            if (template.flow_data.nodes) {
              const templateSteps: WorkflowStep[] = template.flow_data.nodes.map((node: any, index: number) => ({
                id: `step-${Date.now()}-${index}`,
                text: node.data?.label || `Step ${index + 1}`,
                type: index === 0 ? 'start' : index === template.flow_data.nodes.length - 1 ? 'end' : 'process'
              }));
              setSteps(templateSteps);
            }
          }
        })
        .catch(err => {
          console.error('Failed to load template:', err);
        });
    }
  }, [templateId]);

  // Create workflow from text input
  const createFromText = () => {
    if (!textInput.trim()) return;

    const stepTexts = textInput.split('\n').filter(step => step.trim());
    const newSteps: WorkflowStep[] = stepTexts.map((stepText, index) => ({
      id: `step-${Date.now()}-${index}`,
      text: stepText.trim(),
      type: index === 0 ? 'start' : index === stepTexts.length - 1 ? 'end' : 'process'
    }));

    setSteps(newSteps);
    setTextInput('');
    
    toast({
      title: "Success",
      description: `Created workflow with ${stepTexts.length} steps`
    });
  };

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async () => {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        flow_data: { 
          steps: steps,
          nodes: steps.map((step, index) => ({
            id: step.id,
            type: 'default',
            position: { x: 200, y: 100 + (index * 120) },
            data: { label: step.text },
            style: {
              background: step.type === 'start' ? '#10b981' : 
                         step.type === 'end' ? '#ef4444' : 
                         step.type === 'decision' ? '#f59e0b' : '#3b82f6',
              color: '#ffffff',
              border: '2px solid #333',
              borderRadius: '8px',
              padding: '10px',
              minWidth: '200px',
              textAlign: 'center',
              fontWeight: 'bold'
            }
          })),
          edges: steps.slice(0, -1).map((step, index) => ({
            id: `edge-${index}`,
            source: step.id,
            target: steps[index + 1].id,
            type: 'default'
          }))
        }
      };
      return await apiRequest('POST', '/api/workflows', workflowData);
    },
    onSuccess: () => {
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save workflow.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen" style={{backgroundColor: 'hsl(210, 20%, 98%)'}}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-montserrat font-bold mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                Workflow Builder
              </h2>
              <p style={{color: 'hsl(210, 14%, 53%)'}}>
                Create workflows by typing workflow steps and rearranging them
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-steel-gray text-steel-gray hover:border-emerald-green hover:text-emerald-green"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                  Workflow Name
                </label>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                  Description
                </label>
                <Input
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Brief description"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => saveWorkflowMutation.mutate()}
                disabled={saveWorkflowMutation.isPending}
                className="bg-emerald-green hover:bg-emerald-green/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveWorkflowMutation.isPending ? 'Saving...' : 'Save Workflow'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Text Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Create Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Bulk text input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                  Paste or type multiple steps (one per line)
                </label>
                <Textarea
                  placeholder="Enter each step on a new line, for example:&#10;Patient arrives at clinic&#10;Check insurance verification&#10;Complete registration forms&#10;Wait for provider&#10;Consultation begins"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  className="w-full"
                />
                <Button 
                  onClick={createFromText}
                  className="bg-emerald-green hover:bg-emerald-green/90 text-white mt-2"
                  disabled={!textInput.trim()}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Create Steps from Text
                </Button>
              </div>
              
              {/* Single step input */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                  Add individual step
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a single workflow step"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStep()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addStep}
                    disabled={!newStepText.trim()}
                    className="bg-emerald-green hover:bg-emerald-green/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
          {/* Component Palette */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {componentTypes.map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={() => setDraggedType(component.type)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 transition-colors active:cursor-grabbing"
                  style={{ backgroundColor: component.color + '20' }}
                >
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: component.color }}
                  >
                    {component.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{component.label}</div>
                    <div className="text-xs text-gray-500">{component.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workflow Canvas */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Workflow Canvas</CardTitle>
              <p className="text-sm text-gray-500">
                Drag components from the left panel to create your workflow
              </p>
            </CardHeader>
            <CardContent className="p-0 h-[600px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                className="bg-gray-50"
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}