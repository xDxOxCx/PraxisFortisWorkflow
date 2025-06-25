import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  ArrowDown,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  FileText,
  CheckSquare
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';

interface WorkflowStep {
  id: string;
  text: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

interface SelectedImprovement {
  id: string;
  title: string;
  implementationSteps: Array<{
    step: string;
    timeRequired: string;
    resources: string[];
    owner: string;
  }>;
}

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const [newStepText, setNewStepText] = useState('');
  const [selectedImprovements, setSelectedImprovements] = useState<Set<string>>(new Set());
  const [isGeneratingA3, setIsGeneratingA3] = useState(false);
  const { toast } = useToast();

  // Get template ID or workflow ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template');
  const workflowId = window.location.pathname.includes('/workflow-builder/') 
    ? window.location.pathname.split('/').pop() 
    : null;

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

  // Load template or existing workflow
  useEffect(() => {
    if (templateId) {
      // Load template
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
    } else if (workflowId && workflowId !== 'undefined') {
      // Load existing workflow
      fetch(`/api/workflows/${workflowId}`)
        .then(res => res.json())
        .then(workflow => {
          if (workflow) {
            setWorkflowName(workflow.name);
            setWorkflowDescription(workflow.description || '');
            
            // Convert workflow data to steps
            if (workflow.flow_data?.steps) {
              setSteps(workflow.flow_data.steps);
            } else if (workflow.flow_data?.nodes) {
              // Legacy format - convert nodes to steps
              const workflowSteps: WorkflowStep[] = workflow.flow_data.nodes.map((node: any, index: number) => ({
                id: `step-${Date.now()}-${index}`,
                text: node.data?.label || `Step ${index + 1}`,
                type: index === 0 ? 'start' : index === workflow.flow_data.nodes.length - 1 ? 'end' : 'process'
              }));
              setSteps(workflowSteps);
            }
          }
        })
        .catch(err => {
          console.error('Failed to load workflow:', err);
          toast({
            title: "Error",
            description: "Failed to load workflow",
            variant: "destructive"
          });
        });
    }
  }, [templateId, workflowId, toast]);

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
      
      if (workflowId && workflowId !== 'undefined') {
        // Update existing workflow
        return await apiRequest('PUT', `/api/workflows/${workflowId}`, workflowData);
      } else {
        // Create new workflow
        return await apiRequest('POST', '/api/workflows', workflowData);
      }
    },
    onSuccess: () => {
      toast({
        title: "Workflow Saved",
        description: workflowId ? "Your workflow has been updated successfully." : "Your workflow has been saved successfully."
      });
      // queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save workflow.",
        variant: "destructive"
      });
    }
  });

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

  // Toggle improvement selection
  const toggleImprovementSelection = (improvementId: string) => {
    const newSelected = new Set(selectedImprovements);
    if (newSelected.has(improvementId)) {
      newSelected.delete(improvementId);
    } else {
      newSelected.add(improvementId);
    }
    setSelectedImprovements(newSelected);
  };

  // Generate A3 action plan
  const generateA3ActionPlan = async () => {
    if (selectedImprovements.size === 0) {
      toast({
        title: "No Improvements Selected",
        description: "Please select at least one improvement to generate an A3 action plan",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingA3(true);
    try {
      const selectedItems = analysisResult?.improvements?.filter(imp => 
        selectedImprovements.has(imp.id)
      ) || [];

      const a3Data = {
        workflowName,
        selectedImprovements: selectedItems,
        currentDate: new Date().toLocaleDateString()
      };

      // Generate A3 PDF document
      await generateA3PDF(a3Data);

      toast({
        title: "A3 Action Plan Generated",
        description: `A3 PDF downloaded with ${selectedImprovements.size} improvement(s)`
      });

    } catch (error) {
      toast({
        title: "A3 Generation Failed",
        description: "Failed to generate A3 action plan",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingA3(false);
    }
  };

  // Generate A3 PDF document
  const generateA3PDF = async (data: any) => {
    const { workflowName, selectedImprovements, currentDate } = data;
    
    // Dynamically import jsPDF to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let currentY = 20;
    
    // Helper function to add text with word wrapping
    const addText = (text: string, y: number, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      return y + (lines.length * fontSize * 0.5);
    };
    
    // Header
    currentY = addText('A3 ACTION PLAN', currentY, 18, true);
    currentY += 10;
    
    // Workflow information
    currentY = addText(`WORKFLOW: ${workflowName}`, currentY, 12, true);
    currentY = addText(`DATE: ${currentDate}`, currentY, 12);
    currentY = addText('PREPARED BY: [TEAM MEMBER NAME]', currentY, 12);
    currentY = addText('REVIEWED BY: [SUPERVISOR NAME]', currentY, 12);
    currentY += 10;
    
    // Background section
    currentY = addText('BACKGROUND & CURRENT STATE:', currentY, 14, true);
    currentY = addText(
      `This A3 action plan addresses workflow optimization opportunities identified through AI analysis of the "${workflowName}" process.`,
      currentY, 10
    );
    currentY += 5;
    
    // Problem statement
    currentY = addText('PROBLEM STATEMENT:', currentY, 14, true);
    currentY = addText(
      'Current workflow inefficiencies have been identified that impact patient flow, staff productivity, and operational costs.',
      currentY, 10
    );
    currentY += 5;
    
    // Target state
    currentY = addText('TARGET STATE:', currentY, 14, true);
    currentY = addText('Implement selected improvements to achieve:', currentY, 10);
    currentY = addText('• Reduced processing time', currentY, 10);
    currentY = addText('• Improved patient satisfaction', currentY, 10);
    currentY = addText('• Enhanced staff efficiency', currentY, 10);
    currentY = addText('• Decreased operational costs', currentY, 10);
    currentY += 10;
    
    // Improvement actions
    currentY = addText('IMPROVEMENT ACTIONS:', currentY, 14, true);
    
    selectedImprovements.forEach((improvement: any, index: number) => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      currentY = addText(
        `${index + 1}. ${improvement.title.toUpperCase()}`,
        currentY, 12, true
      );
      currentY = addText(
        `Impact: ${improvement.impact} | Time Saved: ${improvement.timeSaved} min | Category: ${improvement.category}`,
        currentY, 10
      );
      currentY = addText(
        `Effort Level: ${improvement.effort} | Priority: ${improvement.priority}/5`,
        currentY, 10
      );
      currentY += 3;
      
      // Implementation steps
      if (improvement.implementationSteps?.length > 0) {
        currentY = addText('IMPLEMENTATION STEPS:', currentY, 11, true);
        improvement.implementationSteps.forEach((step: any, stepIndex: number) => {
          currentY = addText(`${index + 1}.${stepIndex + 1} ${step.step}`, currentY, 10);
          currentY = addText(`   Owner: ${step.owner} | Timeline: ${step.timeRequired}`, currentY, 9);
          currentY = addText(`   Resources: ${step.resources.join(', ')}`, currentY, 9);
          currentY = addText('   Status: ☐ Not Started ☐ In Progress ☐ Complete', currentY, 9);
        });
      }
      currentY += 5;
      
      // Success metrics
      currentY = addText('SUCCESS METRICS:', currentY, 11, true);
      currentY = addText(`• Time reduction: ${improvement.timeSaved} minutes per cycle`, currentY, 10);
      currentY = addText('• Quality improvement: TBD', currentY, 10);
      currentY = addText('• Cost savings: TBD', currentY, 10);
      currentY = addText('• Patient satisfaction: TBD', currentY, 10);
      currentY += 8;
    });
    
    // Check if we need a new page for footer content
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    
    // Implementation timeline
    currentY = addText('IMPLEMENTATION TIMELINE:', currentY, 14, true);
    currentY = addText('Week 1-2: Planning and resource allocation', currentY, 10);
    currentY = addText('Week 3-4: Initial implementation', currentY, 10);
    currentY = addText('Week 5-6: Testing and refinement', currentY, 10);
    currentY = addText('Week 7-8: Full deployment and training', currentY, 10);
    currentY += 10;
    
    // Follow-up plan
    currentY = addText('FOLLOW-UP PLAN:', currentY, 14, true);
    currentY = addText('• Weekly progress reviews', currentY, 10);
    currentY = addText('• Monthly performance metrics assessment', currentY, 10);
    currentY = addText('• Quarterly process improvement evaluation', currentY, 10);
    currentY += 15;
    
    // Approval section
    currentY = addText('APPROVAL:', currentY, 14, true);
    currentY = addText('Practice Manager: _________________ Date: _______', currentY, 10);
    currentY = addText('Medical Director: _________________ Date: _______', currentY, 10);
    currentY += 10;
    
    // Footer
    currentY = addText('Generated by Workflow Optimization Tool', currentY, 8);
    
    // Save the PDF
    const fileName = `A3_Action_Plan_${workflowName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'hsl(210, 20%, 98%)'}}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-montserrat font-bold mb-2" style={{color: 'hsl(215, 25%, 27%)'}}>
                {workflowId ? 'Edit Workflow' : 'Workflow Builder'}
              </h2>
              <p style={{color: 'hsl(210, 14%, 53%)'}}>
                {workflowId ? 'Edit your existing workflow steps and rearrange them' : 'Create workflows by typing workflow steps and rearranging them'}
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
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => saveWorkflowMutation.mutate()}
                disabled={saveWorkflowMutation.isPending}
                className="bg-emerald-green hover:bg-emerald-green/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveWorkflowMutation.isPending ? 'Saving...' : 'Save Workflow'}
              </Button>
              <Button 
                onClick={analyzeWorkflow}
                disabled={isAnalyzing || steps.length === 0}
                className="bg-royal-blue hover:bg-royal-blue/90 text-white"
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
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                This is the simplified workflow builder. Add steps using the text input below, then reorder them with the arrow buttons.
              </div>
            </CardContent>
          </Card>

          {/* Workflow Canvas */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Workflow Steps</CardTitle>
              <p className="text-sm text-gray-600">
                Your workflow steps in order - use the arrows to reorder them
              </p>
            </CardHeader>
            <CardContent className="p-4">
              {steps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No steps created yet. Add some steps using the form on the left.
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
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {analysisResult && (
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  Lean Six Sigma Analysis
                </CardTitle>
                <p className="text-sm text-gray-600">
                  AI-powered optimization recommendations for your workflow
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium">Time Savings</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {analysisResult.summary?.totalTimeSaved || 0} min
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Efficiency Gain</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisResult.summary?.efficiencyGain || 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">Risk Areas</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {analysisResult.summary?.riskAreas?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Improvement Recommendations */}
                {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Optimization Recommendations</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedImprovements(new Set())}
                          variant="outline"
                          size="sm"
                        >
                          Clear Selection
                        </Button>
                        <Button
                          onClick={generateA3ActionPlan}
                          disabled={selectedImprovements.size === 0 || isGeneratingA3}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          {isGeneratingA3 ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate A3 Plan ({selectedImprovements.size})
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {analysisResult.improvements.map((improvement: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedImprovements.has(improvement.id)}
                              onCheckedChange={() => toggleImprovementSelection(improvement.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{improvement.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{improvement.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                      improvement.impact === 'high' ? 'bg-red-100 text-red-800' :
                                      improvement.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {improvement.impact} impact
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {improvement.category}
                                    </span>
                                    {improvement.timeSaved && (
                                      <span className="text-sm text-emerald-600">
                                        +{improvement.timeSaved}min saved
                                      </span>
                                    )}
                                    {improvement.effort && (
                                      <span className={`px-2 py-1 text-xs rounded ${
                                        improvement.effort === 'high' ? 'bg-red-50 text-red-700' :
                                        improvement.effort === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-green-50 text-green-700'
                                      }`}>
                                        {improvement.effort} effort
                                      </span>
                                    )}
                                    {improvement.priority && (
                                      <span className="text-sm text-blue-600">
                                        Priority: {improvement.priority}/5
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Implementation Steps */}
                              {improvement.implementationSteps && improvement.implementationSteps.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Implementation Steps
                                  </h5>
                                  <div className="space-y-2">
                                    {improvement.implementationSteps.map((step: any, stepIndex: number) => (
                                      <div key={stepIndex} className="text-sm">
                                        <div className="font-medium text-gray-700 mb-1">
                                          {stepIndex + 1}. {step.step}
                                        </div>
                                        <div className="ml-4 space-y-1 text-gray-600">
                                          <div className="flex items-center gap-4">
                                            <span>📅 {step.timeRequired}</span>
                                            <span>👤 {step.owner}</span>
                                          </div>
                                          <div>
                                            📦 Resources: {step.resources.join(', ')}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Recommendations */}
                {analysisResult.summary?.recommendations && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Recommendations</h3>
                    <ul className="space-y-2">
                      {analysisResult.summary.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}