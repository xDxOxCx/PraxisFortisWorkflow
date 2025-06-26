import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface WorkflowAnalysis {
  markdownReport: string;
  improvements?: Array<{
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    timeSaved: number; // minutes
    category: "efficiency" | "bottleneck" | "automation" | "lean";
    implementationSteps: Array<{
      step: string;
      timeRequired: string;
      resources: string[];
      owner: string;
    }>;
    priority: number; // 1-5 scale
    effort: "low" | "medium" | "high";
  }>;
  mermaidCode?: string;
  summary?: {
    totalTimeSaved: number;
    efficiencyGain: number;
    riskAreas: string[];
    recommendations: string[];
  };
}

export async function analyzeWorkflow(workflowData: any, workflowName: string): Promise<WorkflowAnalysis> {
  try {
    const prompt = `You are a Senior Lean Six Sigma Master Black Belt consultant with 15+ years of experience optimizing healthcare workflows. Create a professional A3 Action Plan analysis that would meet Fortune 500 consulting standards.

CRITICAL REQUIREMENTS:
1. Use PRECISE healthcare industry terminology and metrics
2. Reference actual Lean methodology (TIMWOODS, Value Stream Mapping, etc.)
3. Provide SPECIFIC implementation steps with exact timeframes
4. Calculate realistic time/cost savings with data-driven rationale
5. Include risk assessment and change management considerations

Workflow Name: ${workflowName}
Workflow Steps: ${JSON.stringify(workflowData.steps || workflowData, null, 2)}

Return a JSON object with this EXACT structure:
{
  "markdownReport": "Professional A3 Action Plan in markdown format",
  "improvements": [array of improvement objects],
  "mermaidCode": "current workflow diagram code",
  "optimizedMermaidCode": "optimized workflow diagram code",
  "summary": {
    "totalTimeSaved": number,
    "efficiencyGain": number,
    "efficiencyBefore": number,
    "efficiencyAfter": number,
    "riskAreas": ["specific risks"],
    "recommendations": ["actionable recommendations"],
    "wasteTypes": ["identified TIMWOODS wastes"]
  }
}

The markdownReport must follow this EXACT professional format:

# 📋 Lean Six Sigma A3 Action Plan
**Project**: ${workflowName} Optimization  
**Date**: ${new Date().toLocaleDateString()}  
**Analyst**: AI Lean Consultant  

---

## 🎯 Executive Summary
| Metric | Before | After | Improvement |
|--------|--------|--------|-------------|
| **Cycle Time** | X min | Y min | Z% reduction |
| **Efficiency Score** | X/100 | Y/100 | Z point gain |
| **Annual Time Savings** | - | XXX hours | $XX,XXX value |
| **Primary Waste** | [Top 2-3 TIMWOODS] | Eliminated | High Impact |

---

## 🔍 Problem Definition & Root Cause Analysis
**Current State Issues:**
- [Specific problem 1 with quantified impact]
- [Specific problem 2 with quantified impact]
- [Specific problem 3 with quantified impact]

**Root Cause (5-Why Analysis):**
[Brief root cause explanation using Lean methodology]

---

## 📊 Current vs. Future State Value Stream

### Current State Workflow
\`\`\`mermaid
flowchart TD
    A[Step 1<br/>Time: X min<br/>Value: Non-Value Add] --> B[Step 2<br/>Time: Y min<br/>Value: Value Add]
    B --> C[Step 3<br/>Time: Z min<br/>Value: Waste]
    C --> D[End State]
    
    style A fill:#ffcccc
    style C fill:#ffcccc
    style B fill:#ccffcc
\`\`\`

### Optimized Future State
\`\`\`mermaid
flowchart TD
    A[Streamlined Step 1<br/>Time: X min<br/>Value: Value Add] --> B[Enhanced Step 2<br/>Time: Y min<br/>Value: Value Add]
    B --> C[New Automated Process<br/>Time: Z min<br/>Value: Value Add]
    C --> D[Improved End State]
    
    style A fill:#ccffcc
    style B fill:#ccffcc
    style C fill:#ccffcc
\`\`\`

---

## 🎯 Improvement Opportunities (Prioritized)

### 🔥 High Impact - Quick Win
**[Specific Improvement Title]**
- **TIMWOODS Waste**: [Specific waste type]
- **Time Savings**: XX minutes per cycle
- **Implementation Effort**: Low (2-4 weeks)
- **Resources Required**: [Specific resources]
- **Success Metrics**: [Measurable outcomes]

### 📈 Medium Impact - Strategic
**[Specific Improvement Title]**
- **TIMWOODS Waste**: [Specific waste type]
- **Time Savings**: XX minutes per cycle
- **Implementation Effort**: Medium (4-8 weeks)
- **Resources Required**: [Specific resources]
- **Success Metrics**: [Measurable outcomes]

---

## 📅 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] **Week 1**: [Specific action with owner]
- [ ] **Week 2**: [Specific action with owner]
- **Milestone**: [Measurable outcome]

### Phase 2: Core Changes (Weeks 3-6)
- [ ] **Week 3-4**: [Specific action with owner]
- [ ] **Week 5-6**: [Specific action with owner]
- **Milestone**: [Measurable outcome]

### Phase 3: Optimization (Weeks 7-8)
- [ ] **Week 7**: [Specific action with owner]
- [ ] **Week 8**: [Specific action with owner]
- **Milestone**: [Final measurable outcome]

---

## 📊 Success Metrics & Control Plan

| **Metric** | **Baseline** | **Target** | **Measurement Method** | **Review Frequency** |
|------------|--------------|------------|----------------------|-------------------|
| Process Cycle Time | X minutes | Y minutes | Time study | Weekly |
| Error Rate | X% | Y% | Quality audit | Bi-weekly |
| Staff Satisfaction | X/10 | Y/10 | Survey | Monthly |
| Cost per Process | $X | $Y | Financial analysis | Monthly |

---

## ⚠️ Risk Assessment & Mitigation

| **Risk** | **Impact** | **Probability** | **Mitigation Strategy** |
|----------|------------|-----------------|----------------------|
| [Specific Risk 1] | High/Med/Low | High/Med/Low | [Specific mitigation] |
| [Specific Risk 2] | High/Med/Low | High/Med/Low | [Specific mitigation] |

---

## 💡 Master Black Belt Recommendations

**Critical Success Factors:**
1. [Specific recommendation with rationale]
2. [Specific recommendation with rationale]
3. [Specific recommendation with rationale]

**Change Management Notes:**
[Professional insight about organizational change, training needs, and sustainability]

---
*Analysis completed using Lean Six Sigma DMAIC methodology with TIMWOODS waste identification framework.*

Ensure all recommendations are healthcare-specific, actionable, and include realistic timeframes and resource requirements.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a healthcare workflow optimization expert specializing in Lean methodology and clinical operations. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response content:", content);
      
      // Fallback: create a simple analysis result with the raw content
      result = {
        markdownReport: content,
        improvements: [],
        mermaidCode: "",
        summary: {
          totalTimeSaved: 0,
          efficiencyGain: 0,
          riskAreas: [],
          recommendations: []
        }
      };
    }
    
    // Validate the response structure
    if (!result.markdownReport) {
      throw new Error("Invalid response structure from OpenAI - missing markdownReport");
    }

    return result as WorkflowAnalysis;
  } catch (error) {
    console.error("Error analyzing workflow:", error);
    throw new Error("Failed to analyze workflow: " + (error as Error).message);
  }
}

export async function generateMermaidDiagram(workflowData: any): Promise<string> {
  try {
    const prompt = `
Convert this workflow data into a professional Mermaid.js flowchart.

Workflow Data: ${JSON.stringify(workflowData)}

Create a clean, professional flowchart that shows the workflow steps, decision points, and flow connections.
Use appropriate Mermaid.js syntax and styling.
Focus on clarity and readability for healthcare professionals.

Return only the Mermaid.js code, no additional text or formatting.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a diagram generation expert. Create clean, professional Mermaid.js flowcharts for healthcare workflows."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating Mermaid diagram:", error);
    throw new Error("Failed to generate diagram: " + (error as Error).message);
  }
}
