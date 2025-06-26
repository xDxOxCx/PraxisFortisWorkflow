import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/navbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Save, 
  Zap, 
  Type, 
  Trash2,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import MarkdownRenderer from '@/components/workflow/markdown-renderer';
import AnalysisTabs from '@/components/workflow/analysis-tabs';

interface WorkflowStep {
  id: string;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export default function WorkflowBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State management
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Check for template parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');

    if (templateId) {
      // Hardcoded templates to avoid API dependency
      const templates = {
        "1": {
          name: "Patient Check-in Process",
          description: "Streamlined patient registration and check-in workflow for specialty clinics",
          flow_data: {
            steps: [
              { id: "1", text: "Patient arrives at clinic", type: "start" },
              { id: "2", text: "Verify insurance and eligibility", type: "process" },
              { id: "3", text: "Complete registration forms", type: "process" },
              { id: "4", text: "Update medical history", type: "process" },
              { id: "5", text: "Take vital signs", type: "process" },
              { id: "6", text: "Patient ready for provider", type: "end" }
            ]
          }
        },
        "2": {
          name: "Prescription Management",
          description: "Efficient prescription processing and patient medication management",
          flow_data: {
            steps: [
              { id: "1", text: "Provider writes prescription", type: "start" },
              { id: "2", text: "Check drug interactions", type: "decision" },
              { id: "3", text: "Verify insurance coverage", type: "process" },
              { id: "4", text: "Send to pharmacy", type: "process" },
              { id: "5", text: "Patient education provided", type: "process" },
              { id: "6", text: "Prescription completed", type: "end" }
            ]
          }
        },
        "3": {
          name: "Lab Result Processing",
          description: "Systematic approach to reviewing and communicating lab results",
          flow_data: {
            steps: [
              { id: "1", text: "Lab results received", type: "start" },
              { id: "2", text: "Provider reviews results", type: "process" },
              { id: "3", text: "Results abnormal?", type: "decision" },
              { id: "4", text: "Contact patient immediately", type: "process" },
              { id: "5", text: "Schedule follow-up", type: "process" },
              { id: "6", text: "Document in patient record", type: "end" }
            ]
          }
        },
        "4": {
          name: "Appointment Scheduling",
          description: "Optimized patient appointment scheduling and reminder system",
          flow_data: {
            steps: [
              { id: "1", text: "Patient requests appointment", type: "start" },
              { id: "2", text: "Check provider availability", type: "process" },
              { id: "3", text: "Verify insurance authorization", type: "process" },
              { id: "4", text: "Schedule appointment", type: "process" },
              { id: "5", text: "Send confirmation and reminders", type: "process" },
              { id: "6", text: "Appointment confirmed", type: "end" }
            ]
          }
        },
        "5": {
          name: "Billing and Claims",
          description: "Streamlined billing process and insurance claim submission",
          flow_data: {
            steps: [
              { id: "1", text: "Service completed", type: "start" },
              { id: "2", text: "Code procedures and diagnoses", type: "process" },
              { id: "3", text: "Verify coding accuracy", type: "decision" },
              { id: "4", text: "Submit insurance claim", type: "process" },
              { id: "5", text: "Process patient payment", type: "process" },
              { id: "6", text: "Billing cycle completed", type: "end" }
            ]
          }
        }
      };

      const template = templates[templateId as keyof typeof templates];

      if (template) {
        setWorkflowName(template.name);
        setWorkflowDescription(template.description);
        if (template.flow_data && template.flow_data.steps) {
          const typedSteps: WorkflowStep[] = template.flow_data.steps.map(step => ({
            ...step,
            type: step.type as 'start' | 'process' | 'decision' | 'end'
          }));
          setSteps(typedSteps);
        }

      } else {
        toast({
          title: "Template Not Found",
          description: "The requested template could not be found",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async () => {
      const workflowData = { steps };
      return await apiRequest("POST", "/api/workflows", {
        name: workflowName,
        description: workflowDescription,
        flow_data: workflowData,
      });
    },
    onSuccess: () => {
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Failed to save workflow.",
        variant: "destructive",
      });
    },
  });

  // Step management functions
  const addStep = () => {
    if (!newStepText.trim()) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      text: newStepText,
      type: 'process'
    };

    setSteps([...steps, newStep]);
    setNewStepText('');
  };

  const createFromText = () => {
    if (!textInput.trim()) return;

    const lines = textInput.split('\n').filter(line => line.trim());
    const newSteps: WorkflowStep[] = lines.map((line, index) => ({
      id: `${Date.now()}-${index}`,
      text: line.trim(),
      type: index === 0 ? 'start' : index === lines.length - 1 ? 'end' : 'process'
    }));

    setSteps([...steps, ...newSteps]);
    setTextInput('');
  };

  const updateStepText = (id: string, newText: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, text: newText } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    setSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
  };

  // Analyze workflow with AI
  const analyzeWorkflow = async () => {
    if (steps.length === 0) {
      toast({
        title: "No Steps to Analyze",
        description: "Please add some workflow steps before analyzing",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const flowData = { steps };
      const response = await fetch('/api/analyze-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflowName,
          description: workflowDescription,
          flow_data: flowData,
        }),
      });

      if (response.ok) {
        const analysis = await response.json();
        console.log('AI Analysis Response:', analysis);
        setAnalysisResult(analysis);
        toast({
          title: "Analysis Complete",
          description: "AI analysis generated optimization recommendations"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze workflow with AI",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing workflow:', error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                className="border-silver-gray text-silver-gray hover:border-emerald-green hover:text-emerald-green"
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
            <div className="mt-4">
              <Button 
                onClick={() => saveWorkflowMutation.mutate()}
                disabled={saveWorkflowMutation.isPending}
                style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                className="text-white hover:opacity-90"
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
                  style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                  className="text-white hover:opacity-90 mt-2"
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
                    style={{backgroundColor: 'hsl(158, 60%, 50%)'}}
                    className="text-white hover:opacity-90"
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
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                This is the simplified workflow builder. Add steps using the text input above, then reorder them with the arrow buttons.
              </div>
            </CardContent>
          </Card>

          {/* Workflow Canvas */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Workflow Steps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your workflow steps in order - use the arrows to reorder them
              </p>
            </CardHeader>
            <CardContent className="p-4">
              {steps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No steps created yet. Add some steps using the form above.
                </div>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStepDown(index)}
                          disabled={index === steps.length - 1}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex-1">
                        <Input
                          value={step.text}
                          onChange={(e) => updateStepText(step.id, e.target.value)}
                          className="border-none p-0 font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          step.type === 'start' ? 'bg-green-100 text-green-800' :
                          step.type === 'end' ? 'bg-red-100 text-red-800' :
                          step.type === 'decision' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {step.type}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(step.id)}
                          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Analyze Button - positioned after workflow steps */}
              {steps.length > 0 && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={analyzeWorkflow}
                    disabled={isAnalyzing}
                    style={{backgroundColor: 'hsl(220, 50%, 30%)'}}
                    className="text-white hover:opacity-90 px-8 py-3 text-lg"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 mr-3 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        Analyzing Workflow...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-3" />
                        Analyze with Lean Six Sigma AI
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get professional optimization recommendations using Lean methodology
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results with Tabs */}
          {analysisResult && (
            <div className="lg:col-span-4">
              <AnalysisTabs analysisResult={analysisResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}