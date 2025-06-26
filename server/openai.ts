import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface WorkflowAnalysis {
  improvements: Array<{
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
  mermaidCode: string;
  summary: {
    totalTimeSaved: number;
    efficiencyGain: number;
    riskAreas: string[];
    recommendations: string[];
  };
}

export async function analyzeWorkflow(workflowData: any, workflowName: string): Promise<WorkflowAnalysis> {
  try {
    const prompt = `You are a Lean Six Sigma AI consultant helping non-expert users improve business workflows.

The user will give you a list of workflow steps. Your job is to analyze them like a process engineer and return a full analysis report.

**You must always output in professional Markdown formatting**, with all of the following sections:

---

## 📋 A3 Action Plan Summary
- **Efficiency Score (Before)**: X/100  
- **Efficiency Score (After)**: X/100  
- **Estimated Time Saved**: X minutes per cycle  
- **Lean Waste Detected**: List of waste types (e.g. Waiting, Overprocessing, Motion)

---

## 🔍 Problem Summary
Briefly describe the root cause of inefficiencies in the workflow using plain English. Do not use jargon.

---

## ⛔ Current Workflow Diagram
**Use Mermaid.js format. Wrap the diagram in triple backticks and the word \`mermaid\`.**

\`\`\`mermaid
graph TD
A[Step 1] --> B[Step 2]
B --> C[Step 3]
\`\`\`

---

## ✅ Optimized Workflow Diagram
**Show the improved workflow with Mermaid.js format.**

\`\`\`mermaid
graph TD
A[Improved Step 1] --> B[Streamlined Step 2]
B --> C[Optimized Step 3]
\`\`\`

---

## 🎯 Top Improvement Opportunities

### 1. [Improvement Title]
- **Impact**: High/Medium/Low
- **Time Saved**: X minutes per cycle
- **Effort Required**: Low/Medium/High
- **Implementation Steps**:
  1. Step one description
  2. Step two description
  3. Step three description

### 2. [Second Improvement]
- **Impact**: High/Medium/Low
- **Time Saved**: X minutes per cycle
- **Effort Required**: Low/Medium/High
- **Implementation Steps**:
  1. Step one description
  2. Step two description

---

## 📊 Implementation Roadmap

| Priority | Improvement | Timeline | Owner | Resources Needed |
|----------|-------------|----------|--------|------------------|
| 1 | First improvement | 2-4 weeks | Role | List resources |
| 2 | Second improvement | 1-2 weeks | Role | List resources |

---

## 🎯 Success Metrics
- **Process Cycle Time**: Reduce from X to Y minutes
- **Error Rate**: Reduce from X% to Y%
- **Customer Satisfaction**: Increase by X%
- **Cost Savings**: $X per month

---

## ⚠️ Risk Mitigation
- **Risk 1**: Description and mitigation strategy
- **Risk 2**: Description and mitigation strategy

---

Workflow Name: ${workflowName}
Workflow Steps: ${JSON.stringify(workflowData.steps || workflowData, null, 2)}

Analyze this workflow using Lean Six Sigma principles (TIMWOODS waste elimination) and provide the complete markdown report following the exact format above.

Return a JSON object with this structure:
{
  "markdownReport": "Complete markdown A3 report following the format",
  "improvements": [
    {
      "id": "unique_id",
      "title": "Improvement Title",
      "description": "Brief description",
      "impact": "high|medium|low",
      "timeSaved": 15,
      "category": "efficiency|bottleneck|automation|lean",
      "implementationSteps": [
        {
          "step": "Specific action to take",
          "timeRequired": "2-3 weeks",
          "resources": ["Staff training", "Software update"],
          "owner": "Practice Manager"
        }
      ],
      "priority": 3,
      "effort": "medium"
    }
  ],
  "mermaidCode": "current workflow mermaid code",
  "optimizedMermaidCode": "optimized workflow mermaid code", 
  "summary": {
    "totalTimeSaved": number,
    "efficiencyGain": number,
    "efficiencyBefore": number,
    "efficiencyAfter": number,
    "riskAreas": ["risk1", "risk2"],
    "recommendations": ["rec1", "rec2"],
    "wasteTypes": ["Motion", "Waiting", "Over-processing"]
  }
}

Create a comprehensive A3 Action Plan report with sections for Problem Statement, Current/Optimized Workflow Diagrams, Improvement Analysis table, phased Action Plan with checkboxes, Success Metrics, and Coach's Note.

Focus on specialty clinic contexts like gastroenterology, orthopedics, endocrinology. Provide specific, actionable recommendations with clear timelines and ownership.

The markdownReport should be a complete professional A3 Action Plan following this structure:

## 📋 A3 Action Plan Summary
**Workflow Analyzed**: ${workflowName}
**Efficiency Score (Before)**: [score]/100
**Efficiency Score (After)**: [score]/100  
**Time Saved per Cycle**: [X] minutes
**Primary Waste Identified**: [List wastes from TIMWOODS]

---

## 🔍 Problem Statement
[1 paragraph explaining inefficiencies and impact]

---

## 📈 Workflow Diagrams

### ⛔ Current Workflow
\`\`\`mermaid
graph TD
    A[Current Step 1] --> B[Current Step 2]
    B --> C[Current Step 3]
\`\`\`

### ✅ Optimized Workflow  
\`\`\`mermaid
graph TD
    A[Optimized Step 1] --> B[Optimized Step 2]
    B --> C[Optimized Step 3]
\`\`\`

---

## 📊 Improvement Analysis

| **Waste Type** | **Current Impact** | **Proposed Solution** | **Time Saved** | **Effort** |
|---|---|---|---|---|
| Motion | High | Consolidate tasks | 15 min | Medium |
| Waiting | Medium | Parallel processing | 10 min | Low |

---

## 🎯 Action Plan

### Phase 1: Quick Wins (0-2 weeks)
- [ ] Action item 1
- [ ] Action item 2

### Phase 2: Process Improvements (2-8 weeks)  
- [ ] Action item 3
- [ ] Action item 4

### Phase 3: System Changes (8-16 weeks)
- [ ] Action item 5  
- [ ] Action item 6

---

## 📈 Success Metrics

- **Cycle Time**: Reduce from X to Y minutes
- **Wait Time**: Reduce from X to Y minutes  
- **Defect Rate**: Reduce from X% to Y%
- **Staff Satisfaction**: Increase from X to Y (1-10 scale)

---

## 💡 Coach's Note
[Professional insight about implementation success factors]`;

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
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the response structure
    if (!result.improvements || !result.mermaidCode || !result.summary) {
      throw new Error("Invalid response structure from OpenAI");
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
