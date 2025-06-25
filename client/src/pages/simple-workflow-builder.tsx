import { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  type Connection,
  type Edge,
  type Node
} from 'reactflow';
import 'reactflow/dist/style.css';
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
  Play,
  Square,
  Diamond,
  StopCircle
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';

const componentTypes = [
  { type: 'start', label: 'Start', icon: '▶', color: '#10b981', description: 'Beginning of process' },
  { type: 'process', label: 'Process', icon: '□', color: '#3b82f6', description: 'Process step' },
  { type: 'decision', label: 'Decision', icon: '◊', color: '#f59e0b', description: 'Decision point' },
  { type: 'end', label: 'End', icon: '⏹', color: '#ef4444', description: 'End of process' }
];

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get template ID from URL params if exists
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template');

  const onConnect = useCallback((params: Connection) => {
    const edge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: 'default',
    };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!draggedType) return;

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left - 100,
      y: event.clientY - reactFlowBounds.top - 50,
    };

    const componentInfo = componentTypes.find(c => c.type === draggedType);
    const newNode: Node = {
      id: `${draggedType}-${Date.now()}`,
      type: 'default',
      position,
      data: {
        label: componentInfo?.label || draggedType,
      },
      style: {
        background: componentInfo?.color || '#ffffff',
        color: '#ffffff',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '120px',
        textAlign: 'center',
        fontWeight: 'bold'
      }
    };

    setNodes((nds) => nds.concat(newNode));
    setDraggedType(null);
  }, [draggedType, setNodes]);

  // Load template if templateId is provided
  useEffect(() => {
    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then(template => {
          if (template && template.flow_data) {
            setWorkflowName(template.name);
            setWorkflowDescription(template.description);
            if (template.flow_data.nodes) {
              setNodes(template.flow_data.nodes.map((node: any) => ({
                ...node,
                style: {
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  padding: '10px',
                  minWidth: '120px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }
              })));
            }
            if (template.flow_data.edges) {
              setEdges(template.flow_data.edges);
            }
          }
        })
        .catch(err => {
          console.error('Failed to load template:', err);
        });
    }
  }, [templateId, setNodes, setEdges]);

  // Create workflow from text input
  const createFromText = useCallback(() => {
    if (!textInput.trim()) return;

    const steps = textInput.split('\n').filter(step => step.trim());
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    steps.forEach((step, index) => {
      const nodeType = index === 0 ? 'start' : index === steps.length - 1 ? 'end' : 'process';
      const componentInfo = componentTypes.find(c => c.type === nodeType);
      
      newNodes.push({
        id: `step-${index}`,
        type: 'default',
        position: { x: 200, y: 100 + (index * 120) },
        data: { label: step.trim() },
        style: {
          background: componentInfo?.color || '#3b82f6',
          color: '#ffffff',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '200px',
          textAlign: 'center',
          fontWeight: 'bold'
        }
      });

      if (index > 0) {
        newEdges.push({
          id: `edge-${index-1}-${index}`,
          source: `step-${index-1}`,
          target: `step-${index}`,
          type: 'default'
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setTextInput('');
    setShowTextInput(false);
    
    toast({
      title: "Success",
      description: `Created workflow with ${steps.length} steps`
    });
  }, [textInput, setNodes, setEdges, toast]);

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async () => {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        flow_data: { nodes, edges }
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
                Create workflows by dragging components or typing steps
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
              <Button 
                onClick={() => setShowTextInput(!showTextInput)}
                variant="outline"
                className="border-emerald-green text-emerald-green hover:bg-emerald-green hover:text-white"
              >
                <Type className="w-4 h-4 mr-2" />
                Create from Text
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

        {/* Text Input Panel */}
        {showTextInput && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Create Workflow from Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter each step on a new line, for example:&#10;Patient arrives at clinic&#10;Check insurance verification&#10;Complete registration forms&#10;Wait for provider&#10;Consultation begins"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={createFromText}
                    className="bg-emerald-green hover:bg-emerald-green/90 text-white"
                    disabled={!textInput.trim()}
                  >
                    Create Workflow
                  </Button>
                  <Button 
                    onClick={() => setShowTextInput(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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