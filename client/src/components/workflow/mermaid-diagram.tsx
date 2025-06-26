import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#2E7D32',
        primaryTextColor: '#0B1F3A',
        primaryBorderColor: '#6B7C8C',
        lineColor: '#6B7C8C',
        secondaryColor: '#F5F5F5',
        tertiaryColor: '#F5F5F5',
      },
    });
  }, []);

  useEffect(() => {
    if (mermaidRef.current && code) {
      const element = mermaidRef.current;
      element.innerHTML = code;
      
      mermaid.init(undefined, element);
    }
  }, [code]);

  if (!code) {
    return (
      <div className="w-full h-64 bg-muted border border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No diagram available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border rounded-lg p-4 overflow-auto">
      <div ref={mermaidRef} className="mermaid text-center" />
    </div>
  );
}
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
