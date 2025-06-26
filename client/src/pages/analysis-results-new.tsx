import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";

interface AnalysisData {
  markdownReport: string;
  workflowName: string;
  workflowDescription: string;
}

export default function AnalysisResults() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load analysis data from sessionStorage
    const storedData = sessionStorage.getItem('workflowAnalysis');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysisData(data);
        console.log('Analysis data loaded successfully');
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    } else {
      console.log('No analysis data found');
    }
  }, []);

  const exportToPDF = () => {
    if (!analysisData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let y = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(`DMAIC Analysis: ${analysisData.workflowName}`, margin, y);
    y += 15;

    // Description
    if (analysisData.workflowDescription) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(analysisData.workflowDescription, pageWidth - 2 * margin);
      pdf.text(descLines, margin, y);
      y += descLines.length * 7 + 10;
    }

    // Analysis content
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    // Split the markdown content into lines and process
    const lines = analysisData.markdownReport.split('\n');
    
    for (const line of lines) {
      if (y > 270) {
        pdf.addPage();
        y = margin;
      }
      
      if (line.startsWith('# ')) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace('# ', ''), margin, y);
        y += 10;
      } else if (line.startsWith('## ')) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace('## ', ''), margin, y);
        y += 8;
      } else if (line.startsWith('### ')) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace('### ', ''), margin, y);
        y += 7;
      } else if (line.trim()) {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const textLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
        pdf.text(textLines, margin, y);
        y += textLines.length * 5;
      } else {
        y += 3;
      }
    }

    pdf.save(`${analysisData.workflowName}-DMAIC-Analysis.pdf`);
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/workflow-builder')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced markdown formatter with better diagram support
  const formatContent = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      // Handle code blocks and diagrams
      if (line.startsWith('```') || line.includes('```')) {
        if (inCodeBlock) {
          // End of code block - render as diagram/code
          elements.push(
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap text-slate-700">
                {codeBlockContent.join('\n')}
              </pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Enhanced text-based diagram detection and formatting
      if (line.includes('→') || line.includes('--') || line.includes('[') && line.includes(']')) {
        elements.push(
          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
            <pre className="text-blue-800 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {line}
            </pre>
          </div>
        );
        return;
      }

      // Regular markdown formatting with enhanced styling
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-4xl font-bold text-[hsl(220,50%,30%)] mb-6 mt-8 pb-3 border-b border-slate-200">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-[hsl(220,50%,30%)] mb-4 mt-6 flex items-center">
            <div className="w-1 h-6 bg-[hsl(158,60%,50%)] rounded-full mr-3"></div>
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-[hsl(220,50%,35%)] mb-3 mt-5">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.includes(':') && !line.startsWith('-') && line.trim().length < 50) {
        // Format section labels and key-value pairs - remove asterisks
        const cleanLabel = line.replace(/\*\*/g, '').replace(/\*/g, '');
        elements.push(
          <div key={index} className="bg-[hsl(158,60%,50%,0.1)] border-l-4 border-[hsl(158,60%,50%)] p-3 my-3 rounded-r-lg">
            <p className="font-bold text-[hsl(220,50%,30%)]">{cleanLabel}</p>
          </div>
        );
      } else if (line.startsWith('- ')) {
        const cleanListItem = line.replace('- ', '').replace(/\*\*/g, '').replace(/\*/g, '');
        elements.push(
          <li key={index} className="text-slate-700 mb-2 ml-6 list-disc leading-relaxed">
            {cleanListItem}
          </li>
        );
      } else if (line.trim()) {
        // Remove all asterisks from the text
        const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '');
        elements.push(
          <p key={index} className="text-slate-700 mb-3 leading-relaxed text-[16px]">
            {cleanLine}
          </p>
        );
      } else {
        elements.push(<div key={index} className="mb-3"></div>);
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-white border-b shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/workflow-builder')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[hsl(220,50%,30%)]">{analysisData.workflowName}</h1>
                <p className="text-lg text-[hsl(210,10%,55%)] mt-2">{analysisData.workflowDescription}</p>
              </div>
            </div>
            <Button 
              onClick={exportToPDF} 
              className="bg-[hsl(158,60%,50%)] hover:bg-[hsl(158,60%,45%)] text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Content Layout */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[hsl(220,50%,30%)] to-[hsl(158,60%,50%)] px-8 py-6">
            <div className="flex items-center gap-3">
              <FileText className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Workflow Analysis Report</h2>
            </div>
            <p className="text-white/90 mt-2">Professional insights and recommendations for process improvement</p>
          </div>
          <div className="p-8">
            <div className="analysis-content space-y-6 max-w-none">
              {formatContent(analysisData.markdownReport)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}