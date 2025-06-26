import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { FileText, BarChart3, AlertTriangle, Target, TrendingUp, CheckCircle, Clock, FileDown, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";

interface AnalysisData {
  markdownReport: string;
  summary: {
    totalTimeSaved: number;
    efficiencyGain: number;
    riskAreas: string[];
    recommendations: string[];
  };
}

export default function AnalysisResults() {
  const [activeTab, setActiveTab] = useState('summary');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get analysis data from sessionStorage or URL params
    const storedAnalysis = sessionStorage.getItem('workflowAnalysis');
    if (storedAnalysis) {
      setAnalysisData(JSON.parse(storedAnalysis));
    }
  }, []);

  const parseAnalysisReport = (markdown: string) => {
    const sections: Record<string, string> = {
      summary: '',
      problem: '',
      diagrams: '',
      improvements: '',
      implementation: '',
      metrics: ''
    };

    if (!markdown || typeof markdown !== 'string') {
      return sections;
    }

    const lines = markdown.split('\n');
    let currentSection = 'summary';
    let content = '';

    for (const line of lines) {
      if (line.includes('Executive Summary') || line.includes('## Executive Summary')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'summary';
        content = line + '\n';
      } else if (line.includes('Problem Definition') || line.includes('## Problem Definition') || line.includes('TIMWOODS')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'problem';
        content = line + '\n';
      } else if (line.includes('Root Cause') || line.includes('Current vs Future') || line.includes('Current State')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'diagrams';
        content = line + '\n';
      } else if (line.includes('Improvement Opportunities') || line.includes('## Improvement Opportunities')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'improvements';
        content = line + '\n';
      } else if (line.includes('Implementation') || line.includes('## Implementation')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'implementation';
        content = line + '\n';
      } else if (line.includes('Success Metrics') || line.includes('## Success Metrics') || line.includes('Control Plan')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'metrics';
        content = line + '\n';
      } else {
        content += line + '\n';
      }
    }

    if (content) sections[currentSection as keyof typeof sections] = content.trim();
    return sections;
  };

  const getSectionContent = (sectionKey: string, fallbackContent: string) => {
    if (!analysisData) return fallbackContent;
    const sections = parseAnalysisReport(analysisData.markdownReport);
    const content = sections[sectionKey];
    return content && content.trim() ? content : fallbackContent;
  };

  const handleExportPDF = () => {
    if (!analysisData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Lean Six Sigma A3 Workflow Analysis", margin, y);
    y += 20;

    // Summary metrics
    if (analysisData.summary) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Key Metrics:", margin, y);
      y += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Time Saved: ${analysisData.summary.totalTimeSaved} minutes`, margin, y);
      y += 8;
      pdf.text(`Efficiency Gain: ${analysisData.summary.efficiencyGain}%`, margin, y);
      y += 15;
    }

    // Analysis content
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Full Analysis Report:", margin, y);
    y += 10;

    // Split markdown content into lines and add to PDF
    const lines = analysisData.markdownReport.split('\n');
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    for (const line of lines) {
      if (y > 270) {
        pdf.addPage();
        y = margin;
      }
      
      if (line.startsWith('#')) {
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace(/#+\s*/, ''), margin, y);
        pdf.setFont("helvetica", "normal");
      } else if (line.trim()) {
        const splitLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
        pdf.text(splitLines, margin, y);
        y += splitLines.length * 5;
      }
      y += 5;
    }

    pdf.save('workflow-analysis-report.pdf');
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No Analysis Data Found</h2>
              <p className="text-muted-foreground mb-6">Please run an analysis from the workflow builder first.</p>
              <Button onClick={() => setLocation('/workflow-builder')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflow Builder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/workflow-builder')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Button>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">Workflow Analysis Results</h1>
              <p className="text-muted-foreground">Comprehensive Lean Six Sigma A3 Action Plan</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time Saved</div>
                <div className="text-2xl font-bold text-emerald-600">{analysisData.summary.totalTimeSaved}min</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                <div className="text-2xl font-bold text-emerald-600">{analysisData.summary.efficiencyGain}%</div>
              </div>
              <Button onClick={handleExportPDF} className="bg-navy-900 hover:bg-navy-800">
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              Master Black Belt Lean Six Sigma Analysis
            </CardTitle>
            <div className="flex gap-2">
              {analysisData.summary.riskAreas.map((risk, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {risk}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="summary" className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="problem" className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Problem</span>
                </TabsTrigger>
                <TabsTrigger value="diagrams" className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="improvements" className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Solutions</span>
                </TabsTrigger>
                <TabsTrigger value="implementation" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Plan</span>
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Metrics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('summary', analysisData.markdownReport)} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="problem" className="mt-6">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('problem', 'Problem analysis section')} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="diagrams" className="mt-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('diagrams', 'Root cause analysis and current state')} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="improvements" className="mt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('improvements', 'Improvement opportunities')} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="mt-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('implementation', 'Implementation roadmap')} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="mt-6">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border rounded-lg p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <MarkdownRenderer content={getSectionContent('metrics', 'Success metrics and control plan')} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}