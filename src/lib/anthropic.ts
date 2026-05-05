import Anthropic from "@anthropic-ai/sdk";

// Singleton Anthropic client — reused across all API routes
let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const AI_MODEL = "claude-opus-4-6";       // Judgment tasks: truck review, user risk, supply routing, report insights
export const AI_MODEL_MID = "claude-sonnet-4-6"; // Reasoning at moderate cost: overview briefing
export const AI_MODEL_FAST = "claude-haiku-4-5"; // High-volume, simple tasks: notifications, anomaly detection
