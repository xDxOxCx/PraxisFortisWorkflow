import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current && code) {
      // Initialize mermaid with configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace',
      });

      // Clear previous content
      elementRef.current.innerHTML = '';
      
      // Generate unique ID for this diagram
      const id = `mermaid-${Date.now()}`;
      
      // Render the mermaid diagram
      mermaid.render(id, code).then((result) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = result.svg;
        }
      }).catch((error) => {
        console.error('Mermaid render error:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded">Error rendering diagram: ${error.message}</div>`;
        }
      });
    }
  }, [code]);

  if (!code) {
    return (
      <div className="text-gray-500 p-4 border border-gray-200 rounded">
        No diagram code provided
      </div>
    );
  }

  return (
    <div className="mermaid-container overflow-x-auto">
      <div ref={elementRef} className="w-full"></div>
    </div>
  );
}
