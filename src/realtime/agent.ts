import { RealtimeAgent } from "@openai/agents-realtime";
import { getTools } from "./tools";
import type { RealtimeVoice } from "./constants";

export function createTranscriptionAgent(): RealtimeAgent {
  return new RealtimeAgent({ name: "RealtimeTranscriptionAgent", tools: [] });
}

export function createConversationAgent(opts: { apiKey: string; instructions: string; voice?: RealtimeVoice }): RealtimeAgent {
  const tools: any[] = getTools({ apiKey: opts.apiKey });
  const agentConfig: any = { name: "RealtimeConversationAgent", tools, instructions: opts.instructions };
  if (opts.voice) agentConfig.voice = opts.voice;
  return new RealtimeAgent(agentConfig);
}
