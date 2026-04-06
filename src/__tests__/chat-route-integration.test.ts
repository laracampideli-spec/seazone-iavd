import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// These tests validate the migration was done correctly by inspecting the source files.
// They ensure no Anthropic references remain and the Gemini integration is properly wired.

const SRC = resolve(__dirname, "..");

function readRoute(path: string): string {
  return readFileSync(resolve(SRC, path), "utf-8");
}

describe("Migration validation: chat/route.ts", () => {
  const source = readRoute("app/api/chat/route.ts");

  it("imports callGemini from @/lib/gemini", () => {
    expect(source).toContain('import { callGemini } from "@/lib/gemini"');
  });

  it("uses GEMINI_API_KEY env var", () => {
    expect(source).toContain("process.env.GEMINI_API_KEY");
  });

  it("does NOT reference Anthropic API", () => {
    expect(source).not.toContain("anthropic");
    expect(source).not.toContain("ANTHROPIC");
  });

  it("calls callGemini with jsonMode for holistic mode", () => {
    expect(source).toContain('jsonMode: body.mode === "holistic"');
  });

  it("uses maxOutputTokens 3000 for holistic, 600 otherwise", () => {
    expect(source).toContain('body.mode === "holistic" ? 3000 : 600');
  });

  it("still has fallbackResponse function", () => {
    expect(source).toContain("function fallbackResponse");
  });

  it("still has CALIBRATION_RULES", () => {
    expect(source).toContain("CALIBRATION_RULES");
  });

  it("still has all 5 modes", () => {
    expect(source).toContain('"discuss"');
    expect(source).toContain('"score"');
    expect(source).toContain('"contest"');
    expect(source).toContain('"challenge"');
    expect(source).toContain('"holistic"');
  });
});

describe("Migration validation: chat-diretoria/route.ts", () => {
  const source = readRoute("app/api/chat-diretoria/route.ts");

  it("imports callGemini from @/lib/gemini", () => {
    expect(source).toContain('import { callGemini } from "@/lib/gemini"');
  });

  it("uses GEMINI_API_KEY env var", () => {
    expect(source).toContain("process.env.GEMINI_API_KEY");
  });

  it("does NOT reference Anthropic API", () => {
    expect(source).not.toContain("anthropic");
    expect(source).not.toContain("ANTHROPIC");
  });

  it("uses maxOutputTokens 1500 for summarize, 600 otherwise", () => {
    expect(source).toContain('body.mode === "summarize" ? 1500 : 600');
  });

  it("still has EXPLORE_PROMPT and SUMMARIZE_PROMPT", () => {
    expect(source).toContain("EXPLORE_PROMPT");
    expect(source).toContain("SUMMARIZE_PROMPT");
  });

  it("still has fallbackResponse function", () => {
    expect(source).toContain("function fallbackResponse");
  });
});

describe("Migration validation: chat-help/route.ts", () => {
  const source = readRoute("app/api/chat-help/route.ts");

  it("imports callGemini from @/lib/gemini", () => {
    expect(source).toContain('import { callGemini } from "@/lib/gemini"');
  });

  it("uses GEMINI_API_KEY env var", () => {
    expect(source).toContain("process.env.GEMINI_API_KEY");
  });

  it("does NOT reference Anthropic API", () => {
    expect(source).not.toContain("anthropic");
    expect(source).not.toContain("ANTHROPIC");
  });

  it("uses maxOutputTokens 300", () => {
    expect(source).toContain("maxOutputTokens: 300");
  });

  it("passes SYSTEM_PROMPT as systemPrompt", () => {
    expect(source).toContain("systemPrompt: SYSTEM_PROMPT");
  });

  it("still has fallbackResponse function", () => {
    expect(source).toContain("function fallbackResponse");
  });
});

describe("Migration validation: gemini.ts helper", () => {
  const source = readRoute("lib/gemini.ts");

  it("uses gemini-2.5-flash model", () => {
    expect(source).toContain("gemini-2.5-flash");
  });

  it("uses generativelanguage.googleapis.com endpoint", () => {
    expect(source).toContain("generativelanguage.googleapis.com");
  });

  it("uses x-goog-api-key header for auth", () => {
    expect(source).toContain("x-goog-api-key");
  });

  it("maps assistant role to model", () => {
    expect(source).toContain('"model"');
  });

  it("supports jsonMode via responseMimeType", () => {
    expect(source).toContain("responseMimeType");
    expect(source).toContain("application/json");
  });

  it("exports callGemini function", () => {
    expect(source).toContain("export async function callGemini");
  });
});

describe("Migration validation: help-chat.tsx cleanup", () => {
  const source = readRoute("components/help-chat.tsx");

  it("does NOT reference ANTHROPIC API key", () => {
    expect(source).not.toContain("ANTHROPIC");
    expect(source).not.toContain("NEXT_PUBLIC_ANTHROPIC");
  });
});
