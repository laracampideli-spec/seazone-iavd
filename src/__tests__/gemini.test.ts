import { describe, it, expect, vi, beforeEach } from "vitest";
import { callGemini } from "@/lib/gemini";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function geminiOkResponse(text: string) {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        candidates: [{ content: { parts: [{ text }] } }],
      }),
  };
}

function geminiErrorResponse(status: number, body: string) {
  return {
    ok: false,
    status,
    text: () => Promise.resolve(body),
  };
}

const baseParams = {
  systemPrompt: "Você é um avaliador.",
  messages: [{ role: "user" as const, content: "Olá" }],
  maxOutputTokens: 600,
  apiKey: "test-api-key",
};

beforeEach(() => {
  mockFetch.mockReset();
});

describe("callGemini", () => {
  // ── Request format ──

  it("sends correct URL to Gemini API", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini(baseParams);

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("generativelanguage.googleapis.com");
    expect(url).toContain("gemini-2.5-flash");
    expect(url).toContain("generateContent");
  });

  it("sends API key via x-goog-api-key header", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini(baseParams);

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers["x-goog-api-key"]).toBe("test-api-key");
  });

  it("sends systemInstruction with system prompt", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini(baseParams);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.systemInstruction).toEqual({
      parts: [{ text: "Você é um avaliador." }],
    });
  });

  it("sends maxOutputTokens in generationConfig", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini({ ...baseParams, maxOutputTokens: 2000 });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.generationConfig.maxOutputTokens).toBe(2000);
  });

  // ── Role mapping ──

  it("maps 'user' role to 'user'", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini(baseParams);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].role).toBe("user");
  });

  it("maps 'assistant' role to 'model'", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini({
      ...baseParams,
      messages: [
        { role: "user", content: "Olá" },
        { role: "assistant", content: "Oi" },
        { role: "user", content: "Teste" },
      ],
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].role).toBe("user");
    expect(body.contents[1].role).toBe("model");
    expect(body.contents[2].role).toBe("user");
  });

  // ── JSON mode ──

  it("does NOT include responseMimeType when jsonMode is false", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini(baseParams);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.generationConfig.responseMimeType).toBeUndefined();
  });

  it("includes responseMimeType when jsonMode is true", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini({ ...baseParams, jsonMode: true });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.generationConfig.responseMimeType).toBe("application/json");
  });

  // ── Response parsing ──

  it("returns text from successful response", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("**Nota: 3 — Dentro do esperado**"));
    const result = await callGemini(baseParams);
    expect(result).toBe("**Nota: 3 — Dentro do esperado**");
  });

  // ── Error handling ──

  it("throws on HTTP error with status code", async () => {
    mockFetch.mockResolvedValue(geminiErrorResponse(429, "Rate limit exceeded"));
    await expect(callGemini(baseParams)).rejects.toThrow("Gemini API error 429");
  });

  it("throws on API-level error in response body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          error: { message: "Invalid API key", code: 403 },
        }),
    });
    await expect(callGemini(baseParams)).rejects.toThrow("Invalid API key");
  });

  it("throws on empty response (no candidates)", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ candidates: [] }),
    });
    await expect(callGemini(baseParams)).rejects.toThrow("Gemini returned empty response");
  });

  it("throws on missing text in response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [{ content: { parts: [{}] } }],
        }),
    });
    await expect(callGemini(baseParams)).rejects.toThrow("Gemini returned empty response");
  });

  // ── Message format ──

  it("wraps message content in parts array", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    await callGemini({
      ...baseParams,
      messages: [{ role: "user", content: "Avalie este colaborador" }],
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].parts).toEqual([{ text: "Avalie este colaborador" }]);
  });

  // ── Multi-turn conversation ──

  it("preserves message order in multi-turn conversation", async () => {
    mockFetch.mockResolvedValue(geminiOkResponse("ok"));
    const messages = [
      { role: "user" as const, content: "msg1" },
      { role: "assistant" as const, content: "msg2" },
      { role: "user" as const, content: "msg3" },
      { role: "assistant" as const, content: "msg4" },
      { role: "user" as const, content: "msg5" },
    ];
    await callGemini({ ...baseParams, messages });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents).toHaveLength(5);
    expect(body.contents.map((c: { role: string }) => c.role)).toEqual([
      "user", "model", "user", "model", "user",
    ]);
  });
});
