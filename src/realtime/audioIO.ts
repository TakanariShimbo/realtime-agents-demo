import type { TranscriptionModel, RealtimeVoice } from "./constants";

export function buildAudioInput(opts: { transcriptionModel: TranscriptionModel | string; turnDetection?: any }) {
  const { transcriptionModel, turnDetection } = opts;
  const audioInput: any = {
    transcription: { model: transcriptionModel, language: "ja" },
  };
  if (turnDetection && Object.keys(turnDetection).length > 0) audioInput.turnDetection = turnDetection;
  return audioInput;
}

export function buildAudioOutput(opts: { voice?: RealtimeVoice }) {
  const { voice } = opts;
  return {
    format: { type: "audio/pcm", rate: 24000 },
    ...(voice ? { voice } : {}),
  } as any;
}
