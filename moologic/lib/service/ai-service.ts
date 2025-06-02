import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || "AIzaSyCv8PO-Xz9z-mKxW21jZCdBbn4HnAF-K8k");

interface AIResponse {
  description: string;
  treatment: string;
  prevention: string;
}

export async function getAIInsights(diseaseName: string): Promise<AIResponse> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });

    // Safety settings to ensure appropriate content
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    const prompt = `
      Please provide detailed information about the cattle disease "${diseaseName}" in the following format:
      
      1. Disease Description: Provide 4 key points about the disease, its symptoms, and characteristics with brief explanations with short sentences.
      2. Treatment Methods: List 4 effective treatment approaches. 
      3. Prevention Measures: Describe 4 preventive measures that farmers can take. 

      Format the response in clear sections.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into sections
    const sections = text.split(/\d\./);
    
    return {
      description: sections[1] || "Description not available",
      treatment: sections[2] || "Treatment information not available",
      prevention: sections[3] || "Prevention measures not available"
    };

  } catch (error) {
    console.error("Error in AI service:", error);
    throw new Error("Failed to get AI insights: " + (error as Error).message);
  }
} 