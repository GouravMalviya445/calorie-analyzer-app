import env from "@/app/env";
import { GoogleGenAI } from "@google/genai";
import { prompts, models } from "../constants";
import { extractJSON } from "@/helper/parseJson";
import { urlToBase64 } from "@/helper/urlToBase64";

const genAI = new GoogleGenAI({ apiKey: `${env.gemini.apiKey}` });
// console.log("apikey:" ,env.gemini.apiKey)

export interface GeminiResponse {
  data: {
    foods: string[],
    estimatedCalories: number,
    health: "Healthy" | "Moderate" | "Unhealthy",
    reason: string,
    tip: string,
    joke?: string
  },
  image: string
}

export async function getFoodResponse(imageFile: string): Promise<GeminiResponse> {
  const prompt = `${prompts.foodCaloryChecker}`;
  if (imageFile.startsWith("http")) {
    imageFile = await urlToBase64(imageFile) as string;
  }
  
  const contents = [
    {
      inlineData: {
        mimeType: imageFile.split(";")[0].split(":")[1],
        data: imageFile.split(",")[1]
      },
    },
    {
      text: prompt
    }
  ]

  const response = await genAI.models.generateContent({
    model: models.gemini.flash,
    contents
  });

  return {
    data: extractJSON(response.text as string),
    image: imageFile
  };
}
