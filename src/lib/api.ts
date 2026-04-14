export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

export async function sendChatMessage(message: string, history: ChatMessage[] = []): Promise<string> {
  try {
    // 1. Try Next.js Backend
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.response;
    }

    throw new Error("Backend failed with status " + res.status);
  } catch (error) {
    console.warn("Backend API failed, falling back to direct REST fetch:", error);
    
    // 2. Fallback to direct fetch
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY configuration for fallback API.");
    }

    // Format contents array
    const contents = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const rawRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: "You are a DSA tutor. Always explain step-by-step. Prefer C++ code. First give hint, then approach, then code. Focus on patterns (two pointers, sliding window, DP). Ask follow-up questions." }]
          }
        })
      }
    );

    if (!rawRes.ok) {
      const errData = await rawRes.text();
      throw new Error(`Fallback API failed: ${errData}`);
    }

    const data = await rawRes.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  }
}
