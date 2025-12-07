import { GoogleGenAI } from "@google/genai";

// Ensure API key is available from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSolution = async (
    prompt: string, 
    base64Image?: string, 
    mimeType?: string
): Promise<string> => {
    try {
        // Using the flash model for fast, efficient text and image reasoning
        const modelId = "gemini-2.5-flash"; 
        
        let contents: any;

        if (base64Image && mimeType) {
             contents = {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image
                        }
                    },
                    { text: prompt }
                ]
            };
        } else {
            contents = { parts: [{ text: prompt }] };
        }

        const response = await ai.models.generateContent({
            model: modelId,
            contents: contents,
            config: {
                systemInstruction: "You are CreatorGpt, an expert AI tutor created by Shyamchand Das. Your goal is to provide clear, accurate, and helpful answers. Format your response with Markdown for better readability.",
            }
        });

        return response.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to communicate with AI.");
    }
};