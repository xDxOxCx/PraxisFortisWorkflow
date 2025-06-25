import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import ComponentPalette from "@/components/workflow/component-palette";
import WorkflowCanvas from "@/components/workflow/workflow-canvas";
import PropertiesPanel from "@/components/workflow/properties-panel";
import MermaidDiagram from "@/components/workflow/mermaid-diagram";
import { WorkflowData, AIAnalysis } from "@/lib/workflow-types";
import { Save, Brain, Undo, Redo, FileDown } from "lucide-react";

interface Workflow {
  id: number;
  name: string;
  description: string;
  flowData: WorkflowData;
  aiAnalysis: AIAnalysis | null;
  mermaidCode: string | null;
  status: string;
}

export default function WorkflowBuilder() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams();
  const workflowId = params.id ? parseInt(params.id) : null;
  
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [workflowData, setWorkflowData] = useState<WorkflowData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Load existing workflow if editing
  const { data: workflow, isLoading: workflowLoading } = useQuery<Workflow>({
    queryKey: [`/api/workflows/${workflowId}`],
    enabled: !!workflowId,
    retry: false,
  });

  // Load workflow data when editing
  useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.name);
      setWorkflowData(workflow.flowData);
      setAiAnalysis(workflow.aiAnalysis);
      setShowAnalysis(!!workflow.aiAnalysis);
    }
  }, [workflow]);

  // Save workflow mutation
  const saveWorkflowMutation = useMutation({
    mutationFn: async (data: { name: string; flowData: WorkflowData; description?: string }) => {
      if (workflowId) {
        return await apiRequest("PUT", `/api/workflows/${workflowId}`, data);
      } else {
        return await apiRequest("POST", "/api/workflows", data);
      }
    },
    onSuccess: async (response) => {
      const savedWorkflow = await response.json();
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully.",
      });
      
      if (!workflowId) {
        navigate(`/workflow-builder/${savedWorkflow.id}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save workflow.",
        variant: "destructive",
      });
    },
  });

  // Analyze workflow mutation
  const analyzeWorkflowMutation = useMutation({
    mutationFn: async () => {
      if (!workflowId) {
        throw new Error("Please save the workflow first before analyzing.");
      }
      return await apiRequest("POST", `/api/workflows/${workflowId}/analyze`);
    },
    onSuccess: async (response) => {
      const analysis = await response.json();
      setAiAnalysis(analysis);
      setShowAnalysis(true);
      toast({
        title: "Analysis Complete",
        description: "AI analysis has been completed. View recommendations below.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze workflow.",
        variant: "destructive",
      });
    },
  });

  const handleSaveWorkflow = () => {
    if (workflowData.nodes.length === 0) {
      toast({
        title: "Empty Workflow",
        description: "Please add some components to your workflow before saving.",
        variant: "destructive",
      });
      return;
    }

    saveWorkflowMutation.mutate({
      name: workflowName,
      flowData: workflowData,
      description: `Workflow with ${workflowData.nodes.length} steps`,
    });
  };

  const handleAnalyzeWorkflow = () => {
    if (workflowData.nodes.length === 0) {
      toast({
        title: "Empty Workflow", 
        description: "Please add some components to your workflow before analyzing.",
        variant: "destructive",
      });
      return;
    }

    if (!workflowId) {
      toast({
        title: "Save Required",
        description: "Please save the workflow first before analyzing.",
        variant: "destructive",
      });
      return;
    }

    analyzeWorkflowMutation.mutate();
  };

  const handleExportPDF = async () => {
    // This would typically use a PDF generation library
    toast({
      title: "Export Started",
      description: "PDF export is being generated...",
    });
  };

  const onNodesChange = useCallback((changes: any) => {
    // Handle node changes from React Flow
    console.log("Nodes changed:", changes);
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    // Handle edge changes from React Flow
    console.log("Edges changed:", changes);
  }, []);

  const onConnect = useCallback((connection: any) => {
    // Handle new connections from React Flow
    console.log("Connection made:", connection);
  }, []);

  if (authLoading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (workflowId && workflowLoading) {
    return (
      <div className="min-h-screen bg-soft-white">
        <Navbar />
        <div className="h-screen flex items-center justify-center">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-montserrat font-bold text-deep-navy mb-2">Workflow Builder</h2>
          <p className="text-steel-gray">Drag and drop components to create your clinic workflow</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 h-[800px]">
          {/* Component Palette */}
          <div className="lg:col-span-1">
            <ComponentPalette onAnalyze={handleAnalyzeWorkflow} analyzing={analyzeWorkflowMutation.isPending} />
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <Input 
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      className="text-lg font-montserrat font-semibold text-deep-navy bg-transparent border-none outline-none p-0 h-auto"
                    />
                    <p className="text-sm text-steel-gray">Drag components from the left panel to build your workflow</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" disabled>
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={handleSaveWorkflow}
                      disabled={saveWorkflowMutation.isPending}
                      className="bg-deep-navy text-white hover:bg-deep-navy/90"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveWorkflowMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                
                <div className="h-full">
                  <WorkflowCanvas
                    workflowData={workflowData}
                    onWorkflowChange={setWorkflowData}
                    onNodeSelect={setSelectedNode}
                    selectedNodeId={selectedNode}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <PropertiesPanel
              selectedNodeId={selectedNode}
              workflowData={workflowData}
              onWorkflowChange={setWorkflowData}
              aiAnalysis={aiAnalysis}
              onExportPDF={handleExportPDF}
            />
          </div>
        </div>

        {/* Analysis Results */}
        {showAnalysis && aiAnalysis && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-deep-navy">
                    AI Analysis Results
                  </h3>
                  <Button 
                    onClick={handleExportPDF}
                    variant="outline" 
                    size="sm"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-deep-navy mb-4">Improvement Recommendations</h4>
                    <div className="space-y-3">
                      {aiAnalysis.improvements.map((improvement) => (
                        <div 
                          key={improvement.id}
                          className={`p-3 rounded-lg border ${
                            improvement.impact === 'high' ? 'bg-emerald-50 border-emerald-200' :
                            improvement.impact === 'medium' ? 'bg-amber-50 border-amber-200' :
                            'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <h5 className={`font-medium text-sm mb-1 ${
                            improvement.impact === 'high' ? 'text-emerald-800' :
                            improvement.impact === 'medium' ? 'text-amber-800' :
                            'text-blue-800'
                          }`}>
                            {improvement.title}
                          </h5>
                          <p className={`text-xs ${
                            improvement.impact === 'high' ? 'text-emerald-700' :
                            improvement.impact === 'medium' ? 'text-amber-700' :
                            'text-blue-700'
                          }`}>
                            {improvement.description}
                          </p>
                          <div className="mt-2 text-xs font-medium text-gray-600">
                            Time saved: {improvement.timeSaved} minutes
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-deep-navy mb-2">Summary</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-steel-gray">Total Time Saved:</span>
                          <div className="font-medium text-emerald-green">{aiAnalysis.summary.totalTimeSaved} minutes</div>
                        </div>
                        <div>
                          <span className="text-steel-gray">Efficiency Gain:</span>
                          <div className="font-medium text-emerald-green">{aiAnalysis.summary.efficiencyGain}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-deep-navy mb-4">Workflow Visualization</h4>
                    <MermaidDiagram code={aiAnalysis.mermaidCode} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
