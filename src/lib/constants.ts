export const REALTIME_VOICES = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse", "cedar", "marin"] as const;
export const REALTIME_MODELS = ["gpt-realtime", "gpt-4o-realtime-preview-2025-06-03"] as const;
export const TURN_DETECTION_TYPES = ["server_vad", "semantic_vad"] as const;
export const CONNECTION_STATUSES = ["disconnected", "connecting", "connected"] as const;
export const VAD_EAGERNESS = ["auto", "low", "medium", "high"] as const;

export type RealtimeVoice = (typeof REALTIME_VOICES)[number];
export type RealtimeModel = (typeof REALTIME_MODELS)[number];
export type TurnDetectionType = (typeof TURN_DETECTION_TYPES)[number];
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];
export type VadEagerness = (typeof VAD_EAGERNESS)[number];

export const DEFAULT_INSTRUCTIONS = "You are a helpful assistant. Speak in Japanese. Keep replies concise unless asked.";
