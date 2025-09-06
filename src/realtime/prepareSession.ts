import type { RealtimeSession } from "@openai/agents-realtime";
import { createTranscriptionAgent, createConversationAgent } from "./agent";
import { createTransport } from "./transport";
import { createConversationRealtimeSession, createTranscriptionRealtimeSession } from "./createSession";
import { DEFAULT_CONVERSATION_MODEL, DEFAULT_TRANSCRIPTION_MODEL, DEFAULT_INSTRUCTIONS } from "./constants";
import type { TranscriptionModel, ConversationModel, SessionMode, RealtimeVoice, TurnDetectionType, VadEagerness } from "./constants";

export type RealtimeConnectOptions = {
  sessionMode: SessionMode;
  apiKey: string;
  transcriptionModel?: TranscriptionModel;
  conversationModel?: ConversationModel;
  instructions?: string;
  voice?: RealtimeVoice;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  audioElement?: HTMLAudioElement | null;
};

export type RealtimeSessionHandle = {
  session: RealtimeSession;
  connect: () => Promise<void>;
};

function createSessionHandle(opts: { session: RealtimeSession; apiKey: string }): RealtimeSessionHandle {
  return {
    session: opts.session,
    connect: async () => {
      await opts.session.connect({ apiKey: opts.apiKey });
    },
  } as const;
}

function prepareTranscriptionSession(opts: {
  apiKey: string;
  transcriptionModel: TranscriptionModel;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  audioElement?: HTMLAudioElement | null;
}) {
  const { apiKey, transcriptionModel, turnDetectionType, silenceDurationMs, prefixPaddingMs, idleTimeoutMs, threshold, eagerness, audioElement } = opts;
  const agent = createTranscriptionAgent();
  const conversationModel = DEFAULT_CONVERSATION_MODEL as string;
  const transport = createTransport({ conversationModel, audioElement });
  const session = createTranscriptionRealtimeSession({
    agent,
    transcriptionModel,
    conversationModel,
    transport,
    turnDetectionType,
    silenceDurationMs,
    prefixPaddingMs,
    idleTimeoutMs,
    threshold,
    eagerness,
  });
  return createSessionHandle({ session, apiKey });
}

function prepareConversationSession(opts: {
  apiKey: string;
  transcriptionModel: TranscriptionModel;
  conversationModel: ConversationModel;
  instructions: string;
  voice?: RealtimeVoice;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  audioElement?: HTMLAudioElement | null;
}) {
  const {
    apiKey,
    transcriptionModel,
    conversationModel,
    instructions,
    voice,
    turnDetectionType,
    silenceDurationMs,
    prefixPaddingMs,
    idleTimeoutMs,
    threshold,
    eagerness,
    audioElement,
  } = opts;

  const agent = createConversationAgent({ apiKey, instructions, voice });
  const transport = createTransport({ conversationModel, audioElement });
  const session = createConversationRealtimeSession({
    agent,
    transcriptionModel,
    conversationModel,
    transport,
    voice,
    turnDetectionType,
    silenceDurationMs,
    prefixPaddingMs,
    idleTimeoutMs,
    threshold,
    eagerness,
  });
  return createSessionHandle({ session, apiKey });
}

export function prepareRealtimeSession(opts: RealtimeConnectOptions) {
  const {
    sessionMode,
    apiKey,
    transcriptionModel,
    conversationModel,
    instructions,
    voice,
    turnDetectionType,
    silenceDurationMs,
    prefixPaddingMs,
    idleTimeoutMs,
    threshold,
    eagerness,
    audioElement,
  } = opts;

  if (sessionMode === "transcription") {
    return prepareTranscriptionSession({
      apiKey,
      transcriptionModel: transcriptionModel ?? DEFAULT_TRANSCRIPTION_MODEL,
      turnDetectionType,
      silenceDurationMs,
      prefixPaddingMs,
      idleTimeoutMs,
      threshold,
      eagerness,
      audioElement,
    });
  } else {
    return prepareConversationSession({
      apiKey,
      transcriptionModel: transcriptionModel ?? DEFAULT_TRANSCRIPTION_MODEL,
      conversationModel: conversationModel ?? DEFAULT_CONVERSATION_MODEL,
      instructions: instructions ?? DEFAULT_INSTRUCTIONS,
      voice,
      turnDetectionType,
      silenceDurationMs,
      prefixPaddingMs,
      idleTimeoutMs,
      threshold,
      eagerness,
      audioElement,
    });
  }
}
