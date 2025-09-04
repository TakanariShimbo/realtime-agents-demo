import { OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession, DEFAULT_OPENAI_REALTIME_MODEL } from "@openai/agents-realtime";
import type { ConversationModel, RealtimeVoice, TurnDetectionType, VadEagerness, TranscriptionModel, SessionMode } from "./constants";

export type ConnectOptions = {
  apiKey: string;
  conversationModel?: ConversationModel;
  transcriptionModel?: TranscriptionModel;
  mode?: SessionMode; // conversation or transcription (default)
  voice?: RealtimeVoice;
  instructions?: string;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  audioElement?: HTMLAudioElement | null;
};

export function createRealtimeSession({
  apiKey,
  conversationModel,
  transcriptionModel,
  mode,
  voice,
  instructions,
  turnDetectionType,
  silenceDurationMs,
  prefixPaddingMs,
  idleTimeoutMs,
  threshold,
  eagerness,
  audioElement,
}: ConnectOptions) {
  const transcriptionOnly = (mode ?? "transcription") === "transcription";
  const agentConfig: any = { name: "RealtimeAgent" };
  if (!transcriptionOnly && instructions) agentConfig.instructions = instructions;
  if (!transcriptionOnly && voice) agentConfig.voice = voice;
  const agent = new RealtimeAgent(agentConfig);

  const effectiveConversationModel = transcriptionOnly ? (DEFAULT_OPENAI_REALTIME_MODEL as string) : conversationModel ?? (DEFAULT_OPENAI_REALTIME_MODEL as string);
  const transport = new OpenAIRealtimeWebRTC({
    baseUrl: `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(effectiveConversationModel)}`,
    useInsecureApiKey: true,
    audioElement: audioElement ?? undefined,
  });

  const session = new RealtimeSession(agent, {
    transport,
    model: effectiveConversationModel as any,
    config: {
      modalities: transcriptionOnly ? (["text"] as any) : (["audio"] as any),
      audio: {
        input: (() => {
          const td: any = {};
          if (turnDetectionType) td.type = turnDetectionType;
          if (typeof silenceDurationMs === "number") td.silenceDurationMs = silenceDurationMs;
          if (typeof prefixPaddingMs === "number") td.prefixPaddingMs = prefixPaddingMs;
          if (typeof idleTimeoutMs === "number") td.idleTimeoutMs = idleTimeoutMs;
          if (typeof threshold === "number") td.threshold = threshold;
          if (eagerness) td.eagerness = eagerness;
          if (transcriptionOnly) td.createResponse = false;
          const inputCfg: any = {
            transcription: { language: "ja", ...(transcriptionModel ? { model: transcriptionModel } : {}) },
          };
          if (Object.keys(td).length > 0) inputCfg.turnDetection = td;
          return inputCfg;
        })(),
        output: (() => {
          const out: any = { format: { type: "audio/pcm", rate: 24000 } };
          if (!transcriptionOnly && voice) out.voice = voice;
          return out;
        })(),
      },
    },
  });

  return {
    session,
    connect: async () => {
      await session.connect({
        apiKey,
      });
    },
  };
}
