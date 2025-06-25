import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WorkflowData, AIAnalysis } from "@/lib/workflow-types";
import { FileDown } from "lucide-react";

interface PropertiesPanelProps {
  selectedNodeId: string | null;
  workflowData: WorkflowData;
  onWorkflowChange: (data: WorkflowData) => void;
  aiAnalysis: AIAnalysis | null;
  onExportPDF: () => void;
}

export default function PropertiesPanel({ 
  selectedNodeId, 
  workflowData, 
  onWorkflowChange,
  aiAnalysis,
  onExportPDF
}: PropertiesPanelProps) {
  const [nodeData, setNodeData] = useState({
    label: '',
    description: '',
    duration: '',
    assignedRole: '',
    notes: '',
  });

  const selectedNode = workflowData.nodes.find(node => node.id === selectedNodeId);

  useEffect(() => {
    if (selectedNode) {
      setNodeData({
        label: selectedNode.data.label || '',
        description: selectedNode.data.description || '',
        duration: selectedNode.data.duration?.toString() || '',
        assignedRole: selectedNode.data.assignedRole || '',
        notes: selectedNode.data.notes || '',
      });
    } else {
      setNodeData({
        label: '',
        description: '',
        duration: '',
        assignedRole: '',
        notes: '',
      });
    }
  }, [selectedNode]);

  const updateNodeData = (field: string, value: string) => {
    if (!selectedNodeId) return;

    const updatedNodes = workflowData.nodes.map(node => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            [field]: field === 'duration' ? (value ? parseInt(value) : undefined) : value,
          },
        };
      }
      return node;
    });

    onWorkflowChange({
      ...workflowData,
      nodes: updatedNodes,
    });

    setNodeData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Properties Panel */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-montserrat font-semibold text-deep-navy mb-4">Properties</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="label" className="text-sm font-medium text-steel-gray">
                  Component Label
                </Label>
                <Input
                  id="label"
                  value={nodeData.label}
                  onChange={(e) => updateNodeData('label', e.target.value)}
                  placeholder="Enter description..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-steel-gray">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={nodeData.description}
                  onChange={(e) => updateNodeData('description', e.target.value)}
                  placeholder="Detailed description..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {selectedNode.type === 'process' && (
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-steel-gray">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={nodeData.duration}
                    onChange={(e) => updateNodeData('duration', e.target.value)}
                    placeholder="5"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="assignedRole" className="text-sm font-medium text-steel-gray">
                  Assigned Role
                </Label>
                <Select 
                  value={nodeData.assignedRole} 
                  onValueChange={(value) => updateNodeData('assignedRole', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front-desk">Front Desk</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-steel-gray">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={nodeData.notes}
                  onChange={(e) => updateNodeData('notes', e.target.value)}
                  placeholder="Additional details..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-steel-gray">
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-montserrat font-semibold text-deep-navy mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {aiAnalysis.improvements.slice(0, 3).map((improvement) => (
                <div 
                  key={improvement.id}
                  className={`p-3 rounded-lg border ${
                    improvement.impact === 'high' ? 'bg-emerald-50 border-emerald-200' :
                    improvement.impact === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h4 className={`font-medium text-sm mb-1 ${
                    improvement.impact === 'high' ? 'text-emerald-800' :
                    improvement.impact === 'medium' ? 'text-amber-800' :
                    'text-blue-800'
                  }`}>
                    {improvement.title}
                  </h4>
                  <p className={`text-xs ${
                    improvement.impact === 'high' ? 'text-emerald-700' :
                    improvement.impact === 'medium' ? 'text-amber-700' :
                    'text-blue-700'
                  }`}>
                    {improvement.description}
                  </p>
                </div>
              ))}
            </div>
            <Button 
              onClick={onExportPDF}
              variant="outline"
              className="w-full mt-4 text-sm"
            >
              <FileDown className="w-4 h-4 mr-2" />
              View All Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
