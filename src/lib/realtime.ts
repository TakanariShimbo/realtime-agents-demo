import { DEFAULT_OPENAI_REALTIME_MODEL, OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";

export type ConnectOptions = {
  apiKey: string;
  model?: string;
  voice?: string;
  instructions?: string;
  audioElement?: HTMLAudioElement | null;
};

export const DEFAULT_MODEL = DEFAULT_OPENAI_REALTIME_MODEL;

export function createRealtimeSession(opts: ConnectOptions) {
  const agent = new RealtimeAgent({
    name: "Web Realtime Demo",
    instructions: opts.instructions ?? "You are a helpful assistant. Keep replies concise unless asked.",
    // avoid auto session.update payloads; voice can be set later
  });

  const transport = new OpenAIRealtimeWebRTC({
    // Pass model in query to ensure the server returns SDP answer, not JSON error
    baseUrl: `https://api.openai.com/v1/realtime?model=${encodeURIComponent(opts.model ?? DEFAULT_MODEL)}`,
    useInsecureApiKey: true,
    audioElement: opts.audioElement ?? undefined,
  });

  // Workaround: sanitize or drop outbound session.update events to avoid unknown_parameter errors
  const originalSendEvent = transport.sendEvent.bind(transport);
  transport.sendEvent = (ev: any) => {
    try {
      if (ev && ev.type === "session.update" && ev.session && typeof ev.session === "object") {
        // Temporarily drop session.update entirely (SDK/server schema mismatch)
        return;
      }
    } catch {
      // fall through
    }
    return originalSendEvent(ev);
  };

  const session = new RealtimeSession(agent, {
    transport,
    config: {
      outputModalities: ["audio"],
      audio: { output: { voice: opts.voice } },
    },
  });

  return {
    session,
    connect: async () => {
      await session.connect({
        apiKey: opts.apiKey,
        model: opts.model ?? DEFAULT_MODEL,
      });
    },
  };
}
