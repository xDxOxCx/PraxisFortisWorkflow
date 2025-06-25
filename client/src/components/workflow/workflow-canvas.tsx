import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowData, WorkflowNode } from '@/lib/workflow-types';
import { Play, Cog, HelpCircle, Square } from 'lucide-react';

// Custom node components
const StartNode = ({ data }: { data: any }) => (
  <div className="p-3 bg-white border-2 border-emerald-500 rounded-lg shadow-sm min-w-[120px]">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
        <Play className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-800">{data.label || 'Start'}</span>
    </div>
    {data.description && (
      <p className="text-xs text-gray-600 mt-1">{data.description}</p>
    )}
  </div>
);

const ProcessNode = ({ data }: { data: any }) => (
  <div className="p-3 bg-white border-2 border-blue-500 rounded-lg shadow-sm min-w-[120px]">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
        <Cog className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-800">{data.label || 'Process'}</span>
    </div>
    {data.description && (
      <p className="text-xs text-gray-600 mt-1">{data.description}</p>
    )}
    {data.duration && (
      <p className="text-xs text-blue-600 mt-1">{data.duration} min</p>
    )}
  </div>
);

const DecisionNode = ({ data }: { data: any }) => (
  <div className="p-3 bg-white border-2 border-amber-500 rounded-lg shadow-sm min-w-[120px]">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
        <HelpCircle className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-800">{data.label || 'Decision'}</span>
    </div>
    {data.description && (
      <p className="text-xs text-gray-600 mt-1">{data.description}</p>
    )}
  </div>
);

const EndNode = ({ data }: { data: any }) => (
  <div className="p-3 bg-white border-2 border-gray-500 rounded-lg shadow-sm min-w-[120px]">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
        <Square className="w-3 h-3 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-800">{data.label || 'End'}</span>
    </div>
    {data.description && (
      <p className="text-xs text-gray-600 mt-1">{data.description}</p>
    )}
  </div>
);

const nodeTypes: NodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
};

interface WorkflowCanvasProps {
  workflowData: WorkflowData;
  onWorkflowChange: (data: WorkflowData) => void;
  onNodeSelect: (nodeId: string | null) => void;
  selectedNodeId: string | null;
}

export default function WorkflowCanvas({ 
  workflowData, 
  onWorkflowChange, 
  onNodeSelect,
  selectedNodeId 
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflowData.edges);

  // Update local state when workflowData changes
  useEffect(() => {
    setNodes(workflowData.nodes);
    setEdges(workflowData.edges);
  }, [workflowData, setNodes, setEdges]);

  // Update parent when local state changes
  useEffect(() => {
    onWorkflowChange({ nodes, edges });
  }, [nodes, edges, onWorkflowChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  // Handle drop events for new components
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 30,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1),
          description: '',
          duration: type === 'process' ? 5 : undefined,
          assignedRole: '',
          notes: '',
        },
      };

      setNodes((nds) => nds.concat(newNode));
      onNodeSelect(newNode.id);
    },
    [setNodes, onNodeSelect]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  if (nodes.length === 0) {
    return (
      <div 
        className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-montserrat font-semibold text-gray-700 mb-2">Start Building</h4>
          <p className="text-steel-gray">Drag a "Start" component here to begin your workflow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#10b981';
              case 'process': return '#3b82f6'; 
              case 'decision': return '#f59e0b';
              case 'end': return '#6b7280';
              default: return '#6b7280';
            }
          }}
        />
        <Background />
      </ReactFlow>
    </div>
  );
}
