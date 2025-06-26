import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3
} from 'lucide-react';
import MarkdownRenderer from './markdown-renderer';

interface AnalysisTabsProps {
  analysisResult: {
    markdownReport: string;
  };
}

export default function AnalysisTabs({ analysisResult }: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Parse the markdown report to extract different sections
  const parseAnalysisReport = (markdown: string) => {
    const sections: Record<string, string> = {
      summary: '',
      problem: '',
      diagrams: '',
      improvements: '',
      implementation: '',
      metrics: ''
    };

    // Split by main headers and extract content
    const lines = markdown.split('\n');
    let currentSection = 'summary';
    let content = '';

    for (const line of lines) {
      if (line.includes('Executive Summary') || line.includes('Summary')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'summary';
        content = line + '\n';
      } else if (line.includes('Problem Definition') || line.includes('Problem Statement')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'problem';
        content = line + '\n';
      } else if (line.includes('Workflow Diagrams') || line.includes('Current Workflow') || line.includes('mermaid')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'diagrams';
        content = line + '\n';
      } else if (line.includes('Improvement Opportunities') || line.includes('Recommendations')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'improvements';
        content = line + '\n';
      } else if (line.includes('Implementation Plan') || line.includes('Action Steps')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'implementation';
        content = line + '\n';
      } else if (line.includes('Metrics') || line.includes('ROI') || line.includes('Time Savings')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'metrics';
        content = line + '\n';
      } else {
        content += line + '\n';
      }
    }

    // Add the last section
    if (content) sections[currentSection as keyof typeof sections] = content.trim();

    return sections;
  };

  const sections = parseAnalysisReport(analysisResult.markdownReport);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          Lean Six Sigma A3 Action Plan
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Professional workflow optimization analysis using TIMWOODS framework
        </p>
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
              <span className="hidden sm:inline">Diagrams</span>
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
              <h3 className="text-lg font-semibold mb-4 text-navy-900">Executive Summary</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.summary || 'No summary available'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="problem" className="mt-6">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-900">Problem Analysis</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.problem || 'No problem analysis available'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diagrams" className="mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-900">Workflow Diagrams</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.diagrams || 'No diagrams available'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="improvements" className="mt-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-900">Improvement Opportunities</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.improvements || 'No improvement recommendations available'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="mt-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Implementation Plan</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.implementation || 'No implementation plan available'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-900">Metrics & ROI</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={sections.metrics || 'No metrics available'} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}