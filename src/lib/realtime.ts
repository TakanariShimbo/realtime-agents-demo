import {
  DEFAULT_OPENAI_REALTIME_MODEL,
  OpenAIRealtimeWebRTC,
  RealtimeAgent,
  RealtimeSession,
} from '@openai/agents-realtime'

export type ConnectOptions = {
  apiKey: string
  model?: string
  voice?: string
  instructions?: string
  audioElement?: HTMLAudioElement | null
}

export const DEFAULT_MODEL = DEFAULT_OPENAI_REALTIME_MODEL

export function createRealtimeSession(opts: ConnectOptions) {
  const agent = new RealtimeAgent({
    name: 'Web Realtime Demo',
    instructions:
      opts.instructions ??
      'You are a helpful assistant. Keep replies concise unless asked.',
    voice: opts.voice,
  })

  const transport = new OpenAIRealtimeWebRTC({
    // Ensure model on query until server-side SDP flow handles config-only
    baseUrl: `https://api.openai.com/v1/realtime?model=${encodeURIComponent(
      opts.model ?? DEFAULT_MODEL,
    )}`,
    useInsecureApiKey: true,
    audioElement: opts.audioElement ?? undefined,
  })

  const session = new RealtimeSession(agent, {
    transport,
    config: {
      outputModalities: ['audio'],
      audio: { output: { voice: opts.voice } },
    },
  })

  return {
    session,
    connect: async () => {
      await session.connect({ apiKey: opts.apiKey, model: opts.model ?? DEFAULT_MODEL })
    },
  }
}

// Utilities to render history items in UI
// No text UI for voice-only mode
