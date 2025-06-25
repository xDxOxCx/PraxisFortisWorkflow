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
      <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-steel-gray">No diagram available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 overflow-auto">
      <div ref={mermaidRef} className="mermaid text-center" />
    </div>
  );
}
