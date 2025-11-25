import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent crash if API key is missing during app load
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCaption = async (platform: string, topic: string, tone: string = 'professional'): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "AI Service Unavailable: Missing API Key.";

    const model = 'gemini-2.5-flash';
    const prompt = `Write a viral, engaging social media caption for ${platform} about "${topic}". The tone should be ${tone}. Include relevant hashtags. Keep it under 200 words.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate caption. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API configuration.";
  }
};

export const suggestStrategy = async (goal: string): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "AI Service Unavailable: Missing API Key.";

    const model = 'gemini-2.5-flash';
    const prompt = `I want to achieve the following social media goal: "${goal}". Provide a bulleted list of 3 specific, actionable strategies to achieve this using an SMM panel effectively and organic growth.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "No strategy generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating strategy.";
  }
};