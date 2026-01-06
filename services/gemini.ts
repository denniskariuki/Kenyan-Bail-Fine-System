
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLegalSummary(offence: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain if "${offence}" is a bailable offence under Kenyan law (Constitution of Kenya 2010). Keep it simple for a family member. Mention typical bail ranges if applicable. Format as a brief friendly summary.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Legal Summary Error:", error);
    return "Legal information currently unavailable. Please consult the duty officer.";
  }
}

export async function checkOffenceEligibility(offence: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Is the offence "${offence}" generally bailable in Kenya? If the bail amount is provided as part of context, suggest if it is within a reasonable range for this offence. Answer in a structured JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isBailable: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            legalReference: { type: Type.STRING },
            suggestedBailRange: { type: Type.STRING }
          },
          required: ["isBailable", "reason", "legalReference"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { isBailable: true, reason: "Manual verification required", legalReference: "Section 123 CPC" };
  }
}
