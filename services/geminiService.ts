import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const getChatResponse = async (history: ChatMessage[], newMessage: { text: string; image?: File }): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';

        // Convert history to Gemini's format. We're only including text parts from history.
        const contents = history
            .filter(msg => msg.type === 'message' || !msg.type) // only include standard messages in history
            .map(msg => ({
                role: msg.role,
                parts: msg.parts.map(p => ({text: p.text})),
            }));

        const messageParts: Part[] = [];
        if (newMessage.text) {
            messageParts.push({ text: newMessage.text });
        }
        if (newMessage.image) {
            const imagePart = await fileToGenerativePart(newMessage.image);
            messageParts.push(imagePart);
        }
        
        contents.push({ role: 'user', parts: messageParts });
        
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
        });

        return response.text;
    } catch (error) {
        console.error("Error in getChatResponse:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        return "";
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check your prompt and try again.");
    }
};

export const researchTopic = async (topic: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a comprehensive research report on the topic: "${topic}". The report should be well-structured with headings (using markdown like ##), detailed, and informative.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => chunk.web);

        return { text, sources };

    } catch (error) {
        console.error("Error researching topic:", error);
        return { text: "Sorry, an error occurred during the web research. Please try again.", sources: [] };
    }
};