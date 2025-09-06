import { OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession, DEFAULT_OPENAI_REALTIME_MODEL } from "@openai/agents-realtime";
import { createResponsesWebSearchTool } from "./tools";

export const TRANSCRIPTION_MODELS = ["gpt-4o-transcribe", "gpt-4o-mini-transcribe"] as const;
export const CONVERSATION_MODELS = ["gpt-realtime", "gpt-4o-realtime-preview-2025-06-03"] as const;
export const REALTIME_VOICES = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse", "cedar", "marin"] as const;
export const TURN_DETECTION_TYPES = ["server_vad", "semantic_vad"] as const;
export const CONNECTION_STATUSES = ["disconnected", "connecting", "connected"] as const;
export const VAD_EAGERNESS = ["auto", "low", "medium", "high"] as const;
export const SESSION_MODES = ["conversation", "transcription"] as const;

export type TranscriptionModel = (typeof TRANSCRIPTION_MODELS)[number];
export type ConversationModel = (typeof CONVERSATION_MODELS)[number];
export type RealtimeVoice = (typeof REALTIME_VOICES)[number];
export type TurnDetectionType = (typeof TURN_DETECTION_TYPES)[number];
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];
export type VadEagerness = (typeof VAD_EAGERNESS)[number];
export type SessionMode = (typeof SESSION_MODES)[number];

export const DEFAULT_TRANSCRIPTION_MODEL: TranscriptionModel = TRANSCRIPTION_MODELS[0];
export const DEFAULT_CONVERSATION_MODEL: ConversationModel = DEFAULT_OPENAI_REALTIME_MODEL as ConversationModel;

export const DEFAULT_INSTRUCTIONS =
  "You are a helpful assistant. Speak in Japanese. Keep replies concise unless asked." +
  "If the user asks you to research or check up-to-date information, use the web_search tool without asking for permission before answering.";

export type TranscriptionConnectOptions = {
  apiKey: string;
  transcriptionModel?: TranscriptionModel;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  audioElement?: HTMLAudioElement | null;
};

export type ConversationConnectOptions = {
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

export function createTranscriptionAgent(): RealtimeAgent {
  return new RealtimeAgent({ name: "RealtimeTranscriptionAgent", tools: [] });
}

export function createConversationAgent(opts: { apiKey: string; instructions: string; voice?: RealtimeVoice; extraTools?: any[] }): RealtimeAgent {
  const tools: any[] = [createResponsesWebSearchTool(opts.apiKey) as any, ...(opts?.extraTools ?? [])];
  const agentConfig: any = { name: "RealtimeConversationAgent", tools, instructions: opts.instructions };
  if (opts?.voice) agentConfig.voice = opts.voice;
  return new RealtimeAgent(agentConfig);
}

function buildTurnDetection(opts: {
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
}) {
  const { turnDetectionType, silenceDurationMs, prefixPaddingMs, idleTimeoutMs, threshold, eagerness } = opts;
  const td: any = {};
  if (turnDetectionType) td.type = turnDetectionType;
  if (typeof silenceDurationMs === "number") td.silenceDurationMs = silenceDurationMs;
  if (typeof prefixPaddingMs === "number") td.prefixPaddingMs = prefixPaddingMs;
  if (typeof idleTimeoutMs === "number") td.idleTimeoutMs = idleTimeoutMs;
  if (typeof threshold === "number") td.threshold = threshold;
  if (eagerness) td.eagerness = eagerness;
  return td;
}

function createTransport(opts: { model: string; audioElement?: HTMLAudioElement | null }) {
  return new OpenAIRealtimeWebRTC({
    baseUrl: `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(opts.model)}`,
    useInsecureApiKey: true,
    audioElement: opts.audioElement ?? undefined,
  });
}

function buildAudioInput(opts: { transcriptionModel?: TranscriptionModel; turnDetection?: any }) {
  const input: any = {
    transcription: { language: "ja", ...(opts.transcriptionModel ? { model: opts.transcriptionModel } : {}) },
  };
  if (opts.turnDetection && Object.keys(opts.turnDetection).length > 0) input.turnDetection = opts.turnDetection;
  return input;
}

function buildAudioOutput(opts: { voice?: RealtimeVoice }) {
  return {
    format: { type: "audio/pcm", rate: 24000 },
    ...(opts.voice ? { voice: opts.voice } : {}),
  } as any;
}

function createTranscriptionRealtimeSession(opts: {
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
  });
  td.createResponse = false;
  const input = buildAudioInput({ transcriptionModel: opts.transcriptionModel, turnDetection: td });
  const output = buildAudioOutput({});
  return new RealtimeSession(opts.agent, {
    transport: opts.transport,
    model: opts.conversationModel as any,
    config: {
      modalities: ["text"] as any,
      audio: { input, output },
    },
  });
}

function createConversationRealtimeSession(opts: {
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
  const input = buildAudioInput({ transcriptionModel: opts.transcriptionModel, turnDetection: td });
  const output = buildAudioOutput({ voice: opts.voice });
  return new RealtimeSession(opts.agent, {
    transport: opts.transport,
    model: opts.conversationModel as any,
    config: {
      modalities: ["audio"] as any,
      audio: { input, output },
    },
  });
}

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

export function prepareTranscriptionSession(opts: TranscriptionConnectOptions) {
  const {
    apiKey,
    transcriptionModel = DEFAULT_TRANSCRIPTION_MODEL,
    turnDetectionType,
    silenceDurationMs,
    prefixPaddingMs,
    idleTimeoutMs,
    threshold,
    eagerness,
    audioElement,
  } = opts;
  const agent = createTranscriptionAgent();
  const conversationModel = DEFAULT_OPENAI_REALTIME_MODEL as string;
  const transport = createTransport({ model: conversationModel, audioElement });
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

export function prepareConversationSession(opts: ConversationConnectOptions) {
  const {
    apiKey,
    transcriptionModel = DEFAULT_TRANSCRIPTION_MODEL,
    conversationModel = DEFAULT_CONVERSATION_MODEL,
    instructions = DEFAULT_INSTRUCTIONS,
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
  const transport = createTransport({ model: conversationModel, audioElement });
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
