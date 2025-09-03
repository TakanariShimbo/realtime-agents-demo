import { useEffect, useRef, useState } from 'react'
import './App.css'
import { KeyForm, type KeyFormValues } from './components/KeyForm'
import Chat from './components/Chat'
import Composer from './components/Composer'
import {
  createRealtimeSession,
  DEFAULT_MODEL,
  itemsToUiMessages,
  type UiMessage,
} from './lib/realtime'

type Status = 'disconnected' | 'connecting' | 'connected'

function App() {
  const [status, setStatus] = useState<Status>('disconnected')
  const [history, setHistory] = useState<UiMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [connectedInfo, setConnectedInfo] = useState<{
    model: string
    transport: 'websocket' | 'webrtc'
  } | null>(null)

  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(
    null,
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const initialForm: KeyFormValues = {
    apiKey: '',
    model: DEFAULT_MODEL,
    transport: 'websocket',
    voice: 'alloy',
  }

  useEffect(() => {
    return () => {
      // cleanup on unmount
      sessionRef.current?.session.close()
    }
  }, [])

  async function handleConnect(v: KeyFormValues) {
    try {
      setError(null)
      setStatus('connecting')
      // Close previous session if any
      sessionRef.current?.session.close()

      const created = createRealtimeSession({
        apiKey: v.apiKey,
        model: v.model,
        transport: v.transport,
        voice: v.voice,
        audioElement: v.transport === 'webrtc' ? audioRef.current : null,
      })

      created.session.on('history_updated', (items) => {
        setHistory(itemsToUiMessages(items))
      })
      created.session.on('error', (e) => {
        setError(String(e.error ?? e))
      })

      try {
        await created.connect()
        sessionRef.current = created
        setStatus('connected')
        setConnectedInfo({ model: v.model, transport: v.transport })
      } catch (err: any) {
        // WebRTC SDP parse errors often mean the endpoint returned non-SDP (e.g. 401/HTML).
        const msg = String(err?.message ?? err)
        const sdpError = /setRemoteDescription|SessionDescription|Expect line: v=/.test(msg)
        if (v.transport === 'webrtc' && sdpError) {
          // auto-fallback to websocket (text only)
          const fallback = createRealtimeSession({
            apiKey: v.apiKey,
            model: v.model,
            transport: 'websocket',
            voice: v.voice,
          })
          fallback.session.on('history_updated', (items) => {
            setHistory(itemsToUiMessages(items))
          })
          fallback.session.on('error', (e) => {
            setError(String(e.error ?? e))
          })
          await fallback.connect()
          sessionRef.current = fallback
          setStatus('connected')
          setConnectedInfo({ model: v.model, transport: 'websocket' })
          setError(
            'WebRTC 交渉に失敗したため WebSocket にフォールバックしました。ブラウザから WebRTC を使う場合は、バックエンドでエフェメラルキーを発行してください。',
          )
        } else {
          throw err
        }
      }
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? String(e))
      setStatus('disconnected')
    }
  }

  function handleDisconnect() {
    sessionRef.current?.session.close()
    sessionRef.current = null
    setStatus('disconnected')
    setConnectedInfo(null)
    setHistory([])
  }

  function handleSend(text: string) {
    sessionRef.current?.session.sendMessage(text)
  }

  function handleInterrupt() {
    sessionRef.current?.session.interrupt()
  }

  const canChat = status === 'connected'

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 style={{ margin: 0 }}>Realtime Demo</h2>
        <div className="small">@openai/agents-realtime + React (frontend only)</div>
        <div className="mt8">
          <KeyForm
            initial={initialForm}
            onConnect={handleConnect}
            connecting={status === 'connecting'}
            connected={status === 'connected'}
          />
        </div>
        <div className="mt8 controls">
          <button onClick={handleDisconnect} disabled={status !== 'connected'}>
            Disconnect
          </button>
        </div>
        {connectedInfo && (
          <div className="mt8 small">
            Connected via {connectedInfo.transport} · model {connectedInfo.model}
          </div>
        )}
        <audio ref={audioRef} autoPlay />
        {error && (
          <div className="mt8" style={{ color: '#ffb3b3' }}>
            Error: {error}
          </div>
        )}
        <div className="mt8 small">
          セキュリティ注意: デモのためブラウザから直接接続しています。必ず
          本番ではサーバでエフェメラルキーを発行してください。
        </div>
      </aside>

      <main className="main">
        <Chat messages={history} status={status} />
        <Composer
          disabled={!canChat}
          onSend={handleSend}
          onInterrupt={canChat ? handleInterrupt : undefined}
        />
      </main>
    </div>
  )
}

export default App
