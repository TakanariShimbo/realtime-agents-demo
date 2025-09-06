import { OpenAIRealtimeWebRTC } from "@openai/agents-realtime";

export function createTransport(opts: { conversationModel: string; audioElement?: HTMLAudioElement | null }) {
  return new OpenAIRealtimeWebRTC({
    baseUrl: `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(opts.conversationModel)}`,
    useInsecureApiKey: true,
    audioElement: opts.audioElement ?? undefined,
  });
}
