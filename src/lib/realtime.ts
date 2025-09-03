import {
  DEFAULT_OPENAI_REALTIME_MODEL,
  OpenAIRealtimeWebRTC,
  OpenAIRealtimeWebSocket,
  RealtimeAgent,
  RealtimeSession,
} from '@openai/agents-realtime'
import type { RealtimeItem, RealtimeMessageItem } from '@openai/agents-realtime'

export type TransportChoice = 'websocket' | 'webrtc'

export type ConnectOptions = {
  apiKey: string
  model?: string
  transport: TransportChoice
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

  const transport =
    opts.transport === 'webrtc'
      ? new OpenAIRealtimeWebRTC({
          // Older gateways expect the model in the query:
          baseUrl: `https://api.openai.com/v1/realtime?model=${encodeURIComponent(
            opts.model ?? DEFAULT_MODEL,
          )}`,
          useInsecureApiKey: true,
          audioElement: opts.audioElement ?? undefined,
        })
      : new OpenAIRealtimeWebSocket({ useInsecureApiKey: true })

  const session = new RealtimeSession(agent, {
    transport,
    config: {
      // Prefer text for WebSocket; for WebRTC model will stream audio automatically
      outputModalities: opts.transport === 'webrtc' ? ['text', 'audio'] : ['text'],
      audio: { output: { voice: opts.voice } },
    },
  })

  return {
    session,
    connect: async () => {
      await session.connect({
        apiKey: opts.apiKey,
        model: opts.model ?? DEFAULT_MODEL,
      })
    },
  }
}

// Utilities to render history items in UI
export type UiMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  inProgress?: boolean
}

export function itemsToUiMessages(items: RealtimeItem[]): UiMessage[] {
  const messages: UiMessage[] = []
  for (const it of items) {
    if (it.type !== 'message') continue
    const m = it as RealtimeMessageItem
    let text = ''
    if (m.role === 'assistant') {
      text = m.content
        .map((c) => (c.type === 'output_text' ? c.text : c.transcript ?? ''))
        .join('')
    } else if (m.role === 'user' || m.role === 'system') {
      text = m.content
        .map((c) => (c.type === 'input_text' ? c.text : c.transcript ?? ''))
        .join('')
    }
    const status = (m as any).status as
      | 'in_progress'
      | 'completed'
      | 'incomplete'
      | undefined
    messages.push({ id: m.itemId, role: m.role, text, inProgress: status === 'in_progress' })
  }
  return messages
}
