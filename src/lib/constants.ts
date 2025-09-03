export const REALTIME_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
] as const;

export const REALTIME_MODELS = [
  "gpt-realtime",
  "gpt-4o-realtime-preview-2025-06-03",
] as const;

export type RealtimeVoice = typeof REALTIME_VOICES[number];
export type RealtimeModel = typeof REALTIME_MODELS[number] | string;

