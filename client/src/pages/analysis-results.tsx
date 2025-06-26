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
    const storedAnalysis = sessionStorage.getItem('workflowAnalysis');
    if (storedAnalysis) {
      try {
        const data = JSON.parse(storedAnalysis);
        setAnalysisData(data);
      } catch (error) {
        console.error('Failed to parse analysis data:', error);
        setLocation('/workflow-builder');
      }
    } else {
      setLocation('/workflow-builder');
    }
  }, [setLocation]);

  const formatAnalysisReport = (markdown: string) => {
    if (!markdown) return "No analysis results available";
    
    // Clean up markdown formatting for better display
    return markdown
      .replace(/^#+\s*/gm, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold to HTML
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert italic to HTML
      .replace(/^- /gm, '• ') // Convert bullet points
      .replace(/\n/g, '<br>') // Convert line breaks to HTML
      .trim();
  };

  const exportToPDF = () => {
    if (!analysisData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let y = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Workflow Analysis: ${analysisData.workflowName}`, margin, y);
    y += 15;

    // Description
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    if (analysisData.workflowDescription) {
      const descLines = pdf.splitTextToSize(analysisData.workflowDescription, pageWidth - 2 * margin);
      pdf.text(descLines, margin, y);
      y += descLines.length * 7 + 10;
    }

    // Analysis content
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Analysis Report", margin, y);
    y += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const reportLines = pdf.splitTextToSize(
      analysisData.markdownReport.replace(/[#*]/g, ''), 
      pageWidth - 2 * margin
    );
    
    reportLines.forEach((line: string) => {
      if (y > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 5;
    });

    pdf.save(`${analysisData.workflowName.replace(/\s+/g, '_')}_Analysis.pdf`);
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              AI Analysis Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: formatAnalysisReport(analysisData.markdownReport) }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}