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

  // Format the markdown content for display
  const formatContent = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6">{line.replace('# ', '')}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.replace('## ', '')}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-700 mb-2 mt-4">{line.replace('### ', '')}</h3>;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold text-gray-800 mb-2">{line.replace(/\*\*/g, '')}</p>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-700 mb-1 ml-4">{line.replace('- ', '')}</li>;
        } else if (line.trim()) {
          return <p key={index} className="text-gray-700 mb-2 leading-relaxed">{line}</p>;
        } else {
          return <div key={index} className="mb-2"></div>;
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                <h1 className="text-2xl font-bold text-gray-900">{analysisData.workflowName}</h1>
                <p className="text-sm text-gray-600 mt-1">{analysisData.workflowDescription}</p>
              </div>
            </div>
            <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Lean Six Sigma DMAIC Analysis Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="analysis-content">
                {formatContent(analysisData.markdownReport)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}