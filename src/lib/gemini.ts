// ── Gemini API Helper ──
// Centralizes all Google Gemini API calls for the 3 chat routes.

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiCandidate {
  content?: {
    parts?: { text?: string; thought?: boolean }[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message: string; code?: number };
}

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function toGeminiRole(role: "user" | "assistant"): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

export async function callGemini(params: {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxOutputTokens: number;
  apiKey: string;
  jsonMode?: boolean;
}): Promise<string> {
  const { systemPrompt, messages, maxOutputTokens, apiKey, jsonMode } = params;

  const contents: GeminiMessage[] = messages.map((m) => ({
    role: toGeminiRole(m.role),
    parts: [{ text: m.content }],
  }));

  const generationConfig: Record<string, unknown> = { maxOutputTokens };
  if (jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data: GeminiResponse = await response.json();

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }

  // Gemini 2.5 returns "thinking parts" (thought: true) before the actual content.
  // Filter them out and take the first real content part.
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts.find((p) => !p.thought && p.text)?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return text;
}
