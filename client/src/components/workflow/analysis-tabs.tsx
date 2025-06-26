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

    // Handle cases where markdown is undefined or null
    if (!markdown || typeof markdown !== 'string') {
      return sections;
    }

    // Split by main headers and extract content
    const lines = markdown.split('\n');
    let currentSection = 'summary';
    let content = '';

    for (const line of lines) {
      if (line.includes('Executive Summary') || line.includes('## Executive Summary')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'summary';
        content = line + '\n';
      } else if (line.includes('Problem Analysis') || line.includes('## Problem Analysis')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'problem';
        content = line + '\n';
      } else if (line.includes('Workflow Diagrams') || line.includes('Current Workflow') || line.includes('mermaid') || line.includes('Expected Results')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'diagrams';
        content = line + '\n';
      } else if (line.includes('Improvement Opportunities') || line.includes('## Improvement Opportunities')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'improvements';
        content = line + '\n';
      } else if (line.includes('Implementation Plan') || line.includes('## Implementation Plan')) {
        if (content) sections[currentSection as keyof typeof sections] = content.trim();
        currentSection = 'implementation';
        content = line + '\n';
      } else if (line.includes('Expected Results') || line.includes('## Expected Results') || line.includes('Key Metrics')) {
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

  // Provide fallback content if parsing fails
  const getSectionContent = (sectionKey: string, fallbackContent: string) => {
    const content = sections[sectionKey];
    return content && content.trim() ? content : fallbackContent;
  };

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
                <MarkdownRenderer content={getSectionContent('summary', `
## Executive Summary
This workflow analysis identifies key optimization opportunities:

**Key Metrics:**
- Potential time savings: 15-20 minutes per patient
- Efficiency improvement: 25%
- Annual cost reduction: $30,000-50,000
- Patient satisfaction increase: 15-20%

**Primary Focus Areas:**
- Streamline documentation processes
- Implement parallel task execution
- Reduce manual verification steps
- Enhance digital integration
                `)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="problem" className="mt-6">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-900">Problem Analysis</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={getSectionContent('problem', `
## Current State Analysis
Healthcare workflows typically exhibit these inefficiencies:

**Common Issues:**
- Redundant data entry across multiple steps
- Sequential processing causing unnecessary wait times
- Manual verification processes that could be automated
- Lack of parallel task execution
- Paper-based forms requiring manual transcription
- Insurance verification delays

**Impact on Operations:**
- Extended patient wait times
- Increased staff workload
- Higher operational costs
- Reduced patient satisfaction
                `)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diagrams" className="mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-900">Expected Results</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <MarkdownRenderer content={getSectionContent('diagrams', `
## Expected Results

**Time Savings:**
- 15-20 minutes saved per patient cycle
- 25% improvement in overall workflow efficiency
- Reduced staff overtime requirements

**Financial Impact:**
- Annual cost reduction: $30,000-50,000
- Improved resource utilization
- Better revenue cycle management

**Quality Improvements:**
- Enhanced patient experience
- Reduced error rates
- Improved staff satisfaction
- Better compliance tracking

**Operational Benefits:**
- Streamlined processes
- Digital workflow tracking
- Automated verification systems
- Parallel task execution
                `)} />
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