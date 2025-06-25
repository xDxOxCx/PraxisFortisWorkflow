import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { componentTypes } from "@/lib/workflow-types";
import { Brain } from "lucide-react";

interface ComponentPaletteProps {
  onAnalyze: () => void;
  analyzing: boolean;
}

export default function ComponentPalette({ onAnalyze, analyzing }: ComponentPaletteProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'border-emerald-300 hover:bg-emerald-50';
      case 'blue':
        return 'border-blue-300 hover:bg-blue-50';
      case 'amber':
        return 'border-amber-300 hover:bg-amber-50';
      case 'gray':
        return 'border-gray-300 hover:bg-gray-50';
      default:
        return 'border-gray-300 hover:bg-gray-50';
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'amber':
        return 'bg-amber-500 text-white';
      case 'gray':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="font-montserrat font-semibold text-slate-blue mb-4">Components</h3>
        <div className="space-y-3">
          {componentTypes.map((component) => (
            <div
              key={component.type}
              className={`p-3 border-2 border-dashed rounded-lg cursor-grab transition-colors ${getColorClasses(component.color)}`}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getIconColorClasses(component.color)}`}>
                  <i className={`${component.icon} text-xs`}></i>
                </div>
                <span className="text-sm font-medium text-slate-blue">{component.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button 
            onClick={onAnalyze}
            disabled={analyzing}
            className="w-full bg-emerald-green text-white hover:bg-emerald-green/90"
          >
            <Brain className="w-4 h-4 mr-2" />
            {analyzing ? "Analyzing..." : "Analyze my workflow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
