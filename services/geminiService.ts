import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResult, TestStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeMedicalReport = async (file: File): Promise<AnalysisResult> => {
  const base64Data = await fileToBase64(file);
  const mimeType = file.type;

  const prompt = `
    You are an expert medical analyst AI. Analyze the attached blood test report image. 
    
    1. Extract the Test Name, Measured Value, Unit, and Reference Range for each visible test.
    2. Normalize the values to numbers. If a value is "Not Detected", treat it as 0 or appropriate.
    3. Determine the status (Normal, Low, High) based strictly on the visible reference range.
    4. Group tests into categories (e.g., "Hematology", "Lipids", "Metabolic").
    5. When analyzing the results, look for correlations. For example, if both 'Ferritin' and 'Hemoglobin' are low, suggest 'Anemia' as a potential discussion topic for the doctor.
    6. Generate a plain-language summary of the health status.
    7. Formulate 3 specific, high-quality questions for the doctor based on these results.
    
    CRITICAL: 
    - If the image is blurry, unreadable, or not a medical report, return an empty metrics array and a summary stating the error.
    - Do NOT hallucinate values. Only use what is visible.
    - For the insights, look for medical patterns in the data.
  `;

  // Define the output schema
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            testName: { type: Type.STRING },
            value: { type: Type.NUMBER, description: "The numerical value measured" },
            unit: { type: Type.STRING },
            rangeMin: { type: Type.NUMBER, nullable: true },
            rangeMax: { type: Type.NUMBER, nullable: true },
            status: { type: Type.STRING, enum: Object.values(TestStatus) },
            category: { type: Type.STRING },
          },
          required: ["testName", "value", "unit", "status", "category"]
        }
      },
      summary: { type: Type.STRING },
      insights: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            relatedMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ["info", "warning", "alert"] }
          }
        }
      },
      doctorQuestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2 // Low temperature for factual extraction
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze the document. Please ensure the image is clear and try again.");
  }
};

export const createChatSession = (result: AnalysisResult): Chat => {
  const systemInstruction = `
    You are ClearHealth, a helpful and empathetic medical AI assistant.
    You have been provided with the user's blood test results below.
    
    CONTEXT DATA:
    ${JSON.stringify(result, null, 2)}

    INSTRUCTIONS:
    1. Answer the user's questions specifically referencing their data (e.g., "Your Vitamin D is 18, which is low...").
    2. Explain complex medical terms in simple, everyday language.
    3. If the user asks for diet or lifestyle advice, provide general, evidence-based suggestions relevant to their specific out-of-range metrics.
    4. ALWAYS maintain a professional and reassuring tone.
    5. DISCLAIMER: You are NOT a doctor. Do not provide a diagnosis. Always recommend consulting a healthcare provider for medical decisions.
    6. Keep answers concise (max 3-4 sentences) unless a detailed explanation is requested.
  `;

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
