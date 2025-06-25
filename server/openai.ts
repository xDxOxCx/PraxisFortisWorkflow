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
    const prompt = `
You are an expert healthcare workflow analyst specializing in Lean methodology and clinical operations optimization. 

Analyze this clinical workflow for a specialty practice and provide detailed improvement recommendations.

Workflow Name: ${workflowName}
Workflow Data: ${JSON.stringify(workflowData)}

Please analyze this workflow and provide:
1. Specific improvement opportunities with time savings estimates
2. Bottleneck identification and solutions  
3. Lean methodology applications
4. Automation opportunities
5. Risk mitigation strategies
6. Mermaid.js flowchart code for visualization

Focus on specialty clinic contexts like gastroenterology, orthopedics, endocrinology, and pain management.

Respond with valid JSON in this exact format:
{
  "improvements": [
    {
      "id": "unique_id",
      "title": "Improvement Title",
      "description": "Detailed description of the improvement",
      "impact": "high|medium|low",
      "timeSaved": number_in_minutes,
      "category": "efficiency|bottleneck|automation|lean"
    }
  ],
  "mermaidCode": "Complete Mermaid.js flowchart code",
  "summary": {
    "totalTimeSaved": number_in_minutes,
    "efficiencyGain": percentage_number,
    "riskAreas": ["risk1", "risk2"],
    "recommendations": ["rec1", "rec2"]
  }
}
`;

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
