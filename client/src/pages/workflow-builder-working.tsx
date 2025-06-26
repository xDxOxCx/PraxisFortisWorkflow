import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import AnalysisTabs from '@/components/workflow/analysis-tabs';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  X,
  Save,
  Wand2,
  Plus,
  Play,
  Settings,
  Diamond,
  StopCircle,
  Trash2,
  Zap,
  Type
} from 'lucide-react';

interface Workflow {
  id: number;
  name: string;
  description: string;
  flowData: any;
  status: 'draft' | 'active' | 'archived';
  aiAnalysis?: any;
  mermaidCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  id: string;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export default function WorkflowBuilder() {
  // All hooks must be declared at the top level before any conditional returns
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // State hooks
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const workflowId = location.includes('/workflow/') ? 
    parseInt(location.split('/workflow/')[1]) : null;

  // Template loading effect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');
    
    if (templateId) {
      const loadTemplate = async () => {
        try {
          const response = await fetch(`/api/templates/${templateId}`);
          if (response.ok) {
            const template = await response.json();
            console.log('Loading template:', template);
            
            setWorkflowName(template.name);
            setWorkflowDescription(template.description);
            
            // Convert template flow_data to workflow steps
            let workflowSteps = [];
            const flowData = template.flowData || template.flow_data;
            
            if (flowData && flowData.nodes) {
              // Template uses nodes/edges format - convert to steps
              const nodes = flowData.nodes;
              workflowSteps = nodes
                .filter((node: any) => node.type !== 'decision') // Skip decision nodes for simplicity
                .sort((a: any, b: any) => (a.position?.y || 0) - (b.position?.y || 0)) // Sort by Y position
                .map((node: any, index: number) => ({
                  id: node.id || `template-${index}`,
                  text: node.data?.label || node.data?.description || `Step ${index + 1}`,
                  type: node.type === 'start' ? 'start' : 
                        node.type === 'end' ? 'end' : 'process'
                }));
            } else if (flowData && Array.isArray(flowData.steps)) {
              // Template already has steps format
              workflowSteps = flowData.steps.map((step: any, index: number) => ({
                id: step.id || `template-${index}`,
                text: step.text || step.name || step.description || `Step ${index + 1}`,
                type: step.type || 'process'
              }));
            }
            
            console.log('Extracted workflow steps:', workflowSteps);
            
            if (workflowSteps.length > 0) {
              setSteps(workflowSteps);
              console.log('Loaded', workflowSteps.length, 'steps from template');
            } else {
              console.log('No steps found in template, flowData structure:', flowData);
            }
          }
        } catch (error) {
          console.error('Error loading template:', error);
        }
      };
      
      loadTemplate();
    }
  }, []);

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async (data: { name: string; flowData: any; description?: string }) => {
      const workflowData = {
        name: data.name,
        description: data.description || '',
        flowData: data.flowData,
        status: 'draft'
      };

      if (workflowId) {
        const response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...workflowData, id: workflowId }),
          headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
      } else {
        const response = await fetch('/api/workflows', {
          method: 'POST',
          body: JSON.stringify(workflowData),
          headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
      }
    },
    onSuccess: (savedWorkflow) => {
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      
      if (!workflowId) {
        setLocation(`/workflow/${savedWorkflow.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Analyze workflow function
  const analyzeWorkflow = async () => {
    if (!workflowName.trim() || steps.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add a workflow name and at least one step before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        steps: steps
      };

      const response = await fetch('/api/analyze-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("AI Analysis result:", result);

      // Store analysis result in sessionStorage
      const analysisData = {
        workflowName: workflowName,
        workflowDescription: workflowDescription || '',
        markdownReport: result.markdownReport
      };
      
      sessionStorage.setItem('workflowAnalysis', JSON.stringify(analysisData));
      
      toast({
        title: "Analysis Complete",
        description: "Redirecting to analysis results...",
      });

      // Redirect to results page
      setTimeout(() => {
        setLocation('/analysis-results');
      }, 1000);
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast({
          title: "Authentication Required",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step management functions
  const addStep = () => {
    if (!newStepText.trim()) return;
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      text: newStepText.trim(),
      type: 'process'
    };
    
    setSteps([...steps, newStep]);
    setNewStepText('');
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const updateStepType = (id: string, type: WorkflowStep['type']) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, type } : step
    ));
  };

  const createStepsFromText = () => {
    if (!textInput.trim()) return;
    
    const lines = textInput.split('\n').filter(line => line.trim());
    const newSteps: WorkflowStep[] = lines.map((line, index) => ({
      id: `${Date.now()}-${index}`,
      text: line.trim(),
      type: 'process' as const
    }));
    
    setSteps([...steps, ...newSteps]);
    setTextInput('');
  };

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: "Missing Workflow Name",
        description: "Please enter a name for your workflow.",
        variant: "destructive",
      });
      return;
    }

    const flowData = { steps };
    saveWorkflowMutation.mutate({
      name: workflowName,
      description: workflowDescription,
      flowData
    });
  };

  // Early returns after all hooks are declared
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Button onClick={() => setLocation('/landing')}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Workflow Builder */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-montserrat text-slate-blue flex items-center gap-3">
                  <Wand2 className="w-8 h-8 text-emerald-600" />
                  Workflow Builder
                </CardTitle>
                <p className="text-muted-foreground">
                  Create and optimize your healthcare workflows with AI-powered analysis
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workflow Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Workflow Name</label>
                    <Input
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="Enter workflow name..."
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                    <Textarea
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="Describe your workflow..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Step Creation Methods */}
                <Tabs defaultValue="single" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Add Single Step</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Add Steps</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single" className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        placeholder="Enter workflow step..."
                        onKeyPress={(e) => e.key === 'Enter' && addStep()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={addStep}
                        style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                        className="text-white hover:opacity-90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bulk" className="space-y-4">
                    <Textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter multiple steps, one per line..."
                      rows={6}
                    />
                    <Button 
                      onClick={createStepsFromText}
                      style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                      className="text-white hover:opacity-90"
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Create Steps
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Workflow Steps */}
                {steps.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-blue">Workflow Steps</h3>
                    <div className="space-y-2">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                          <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{step.text}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <select
                              value={step.type}
                              onChange={(e) => updateStepType(step.id, e.target.value as WorkflowStep['type'])}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="start">Start</option>
                              <option value="process">Process</option>
                              <option value="decision">Decision</option>
                              <option value="end">End</option>
                            </select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveStep(step.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveStep(step.id, 'down')}
                              disabled={index === steps.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeStep(step.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={saveWorkflow}
                    disabled={saveWorkflowMutation.isPending}
                    style={{backgroundColor: 'hsl(220, 50%, 30%)'}}
                    className="text-white hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveWorkflowMutation.isPending ? 'Saving...' : 'Save Workflow'}
                  </Button>
                  
                  {steps.length > 0 && (
                    <Button 
                      onClick={analyzeWorkflow}
                      disabled={isAnalyzing}
                      style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                      className="text-white hover:opacity-90"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
}