export const REALTIME_VOICES = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse", "cedar", "marin"] as const;
export const CONVERSATION_MODELS = ["gpt-realtime", "gpt-4o-realtime-preview-2025-06-03"] as const;
export const TRANSCRIPTION_MODELS = ["gpt-4o-transcribe", "gpt-4o-mini-transcribe"] as const;
export const TURN_DETECTION_TYPES = ["server_vad", "semantic_vad"] as const;
export const CONNECTION_STATUSES = ["disconnected", "connecting", "connected"] as const;
export const VAD_EAGERNESS = ["auto", "low", "medium", "high"] as const;

export type RealtimeVoice = (typeof REALTIME_VOICES)[number];
export type ConversationModel = (typeof CONVERSATION_MODELS)[number];
export type TranscriptionModel = (typeof TRANSCRIPTION_MODELS)[number];
export type TurnDetectionType = (typeof TURN_DETECTION_TYPES)[number];
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];
export type VadEagerness = (typeof VAD_EAGERNESS)[number];

export const DEFAULT_INSTRUCTIONS = "You are a helpful assistant. Speak in Japanese. Keep replies concise unless asked.";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
