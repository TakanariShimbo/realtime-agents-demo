import { DEFAULT_OPENAI_REALTIME_MODEL, OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

export type ConnectOptions = {
  apiKey: string;
  model?: string;
  voice?: string;
  instructions?: string;
  // VAD mode for turn detection. See OpenAI Realtime docs.
  turnDetectionType?: "server_vad" | "semantic_vad";
  audioElement?: HTMLAudioElement | null;
};

export const DEFAULT_MODEL = DEFAULT_OPENAI_REALTIME_MODEL;

export function createRealtimeSession(opts: ConnectOptions) {
  const agent = new RealtimeAgent({
    name: "Web Realtime Demo",
    instructions: opts.instructions ?? "You are a helpful assistant. Keep replies concise unless asked.",
  });

  const transport = new OpenAIRealtimeWebRTC({
    // Use the GA WebRTC endpoint. Model is set via session/transport config, not URL.
    baseUrl: `https://api.openai.com/v1/realtime/calls`,
    useInsecureApiKey: true,
    audioElement: opts.audioElement ?? undefined,
  });

  const session = new RealtimeSession(agent, {
    transport,
    model: (opts.model ?? DEFAULT_MODEL) as any,
    config: {
      outputModalities: ["audio"],
      audio: {
        input: {
          turnDetection: {
            type: opts.turnDetectionType ?? "server_vad",
            createResponse: true,
            interruptResponse: true,
          },
        },
        output: { voice: opts.voice },
      },
    },
  });

  return {
    session,
    connect: async () => {
      await session.connect({
        apiKey: opts.apiKey,
      });
    },
  };
}
