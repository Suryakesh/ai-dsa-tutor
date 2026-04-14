import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

    // Format history for Gemini API
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      part: { text: msg.content }
    }));

    // Add current message
    formattedHistory.push({
      role: "user",
      part: { text: message }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: formattedHistory,
      config: {
        systemInstruction: "You are a DSA tutor. Always explain step-by-step. Prefer C++ code. First give hint, then approach, then code. Focus on patterns (two pointers, sliding window, DP). Ask follow-up questions.",
        thinkingConfig: {
          thinkingLevel: "LOW" as any // Bypass strict TS enum check if needed
        }
      }
    });

    return NextResponse.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
