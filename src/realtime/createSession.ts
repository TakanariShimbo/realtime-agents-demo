import { OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";
import type { RealtimeVoice, TranscriptionModel, TurnDetectionType, VadEagerness } from "./constants";
import { buildAudioInput, buildAudioOutput } from "./audioIO";
import { buildTurnDetection } from "./turnDetection";

export function createTranscriptionRealtimeSession(opts: {
  agent: RealtimeAgent;
  transcriptionModel: TranscriptionModel;
  conversationModel: string;
  transport: OpenAIRealtimeWebRTC;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
}): RealtimeSession {
  const td = buildTurnDetection({
    turnDetectionType: opts.turnDetectionType,
    silenceDurationMs: opts.silenceDurationMs,
    prefixPaddingMs: opts.prefixPaddingMs,
    idleTimeoutMs: opts.idleTimeoutMs,
    threshold: opts.threshold,
    eagerness: opts.eagerness,
    createResponse: false,
  });
  const audioInput = buildAudioInput({ transcriptionModel: opts.transcriptionModel, turnDetection: td });
  const audioOutput = buildAudioOutput({});
  return new RealtimeSession(opts.agent, {
    transport: opts.transport,
    model: opts.conversationModel as any,
    config: {
      modalities: ["text"] as any,
      audio: { input: audioInput, output: audioOutput },
    },
  });
}

export function createConversationRealtimeSession(opts: {
  agent: RealtimeAgent;
  transcriptionModel: TranscriptionModel;
  conversationModel: string;
  transport: OpenAIRealtimeWebRTC;
  voice?: RealtimeVoice;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
}): RealtimeSession {
  const td = buildTurnDetection({
    turnDetectionType: opts.turnDetectionType,
    silenceDurationMs: opts.silenceDurationMs,
    prefixPaddingMs: opts.prefixPaddingMs,
    idleTimeoutMs: opts.idleTimeoutMs,
    threshold: opts.threshold,
    eagerness: opts.eagerness,
  });
  const audioInput = buildAudioInput({ transcriptionModel: opts.transcriptionModel, turnDetection: td });
  const audioOutput = buildAudioOutput({ voice: opts.voice });
  return new RealtimeSession(opts.agent, {
    transport: opts.transport,
    model: opts.conversationModel as any,
    config: {
      modalities: ["audio"] as any,
      audio: { input: audioInput, output: audioOutput },
    },
  });
}
