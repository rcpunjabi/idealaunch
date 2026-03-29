import Anthropic from "@anthropic-ai/sdk";
import {
  INTAKE_SYSTEM_PROMPT,
  REQUIREMENTS_SYSTEM_PROMPT,
  buildCodeGenPrompt,
} from "./prompts";
import type { AppBlueprint, Requirement, IntakeResponse, GeneratedFile } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
//  Phase 1 — Intake conversation
// ─────────────────────────────────────────────

export async function sendIntakeMessage(
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<IntakeResponse> {
  const messages = [
    ...conversationHistory,
    { role: "user" as const, content: userMessage },
  ];

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: INTAKE_SYSTEM_PROMPT,
    messages,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Check if the blueprint is complete
  try {
    const parsed = JSON.parse(text.trim());
    if (parsed.__complete__ && parsed.blueprint) {
      return {
        message: "Your app blueprint is ready! Let's review what we're building.",
        isComplete: true,
        blueprint: parsed.blueprint as AppBlueprint,
      };
    }
  } catch {
    // Not JSON — it's a regular conversational message
  }

  return { message: text, isComplete: false };
}

// ─────────────────────────────────────────────
//  Phase 2 — Requirements generation
// ─────────────────────────────────────────────

export async function generateRequirements(
  blueprint: AppBlueprint
): Promise<Requirement[]> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: REQUIREMENTS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate requirements for this app blueprint:\n\n${JSON.stringify(blueprint, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  const parsed = JSON.parse(text.trim());
  return parsed.requirements as Requirement[];
}

// ─────────────────────────────────────────────
//  Phase 3 — Code generation
// ─────────────────────────────────────────────

export async function generateCode(
  blueprint: AppBlueprint,
  requirements: Requirement[]
): Promise<GeneratedFile[]> {
  const prompt = buildCodeGenPrompt(blueprint, requirements);

  // Use streaming for code gen — it can take a while
  let fullText = "";
  const stream = await client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      fullText += chunk.delta.text;
    }
  }

  // Extract the JSON from the response
  const jsonMatch = fullText.match(/\{[\s\S]*"files"[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to extract file tree from LLM output");

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.files as GeneratedFile[];
}
