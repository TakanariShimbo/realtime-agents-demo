import { useEffect, useRef, useState } from 'react'
import './App.css'
import { KeyForm, type KeyFormValues } from './components/KeyForm'
import { createRealtimeSession, DEFAULT_MODEL } from './lib/realtime'

type Status = 'disconnected' | 'connecting' | 'connected'

function App() {
  const [status, setStatus] = useState<Status>('disconnected')
  const [error, setError] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)

  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(
    null,
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const initialForm: KeyFormValues = { apiKey: '', voice: 'alloy' }

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
        model: DEFAULT_MODEL,
        voice: v.voice,
        audioElement: audioRef.current,
      })

      created.session.on('error', (e) => setError(String(e.error ?? e)))

      try {
        await created.connect()
        sessionRef.current = created
        setStatus('connected')
        setMuted(false)
      } catch (err: any) {
        throw err
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
    setMuted(false)
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    sessionRef.current?.session.mute(next)
  }

  // voice-only

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 style={{ margin: 0 }}>Realtime Demo</h2>
        <div className="small">@openai/agents-realtime + WebRTC（音声のみ）</div>
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
          <button onClick={toggleMute} disabled={status !== 'connected'}>
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
        <audio ref={audioRef} autoPlay />
        {error && (
          <div className="mt8" style={{ color: '#ffb3b3' }}>
            Error: {error}
          </div>
        )}
        <div className="mt8 small">Connect 後に話しかけてください（自動 VAD）。</div>
      </aside>

      <main className="main">
        <div className="chat">
          <div className="status mb8">
            <span className={status === 'connected' ? 'dot ok' : status === 'connecting' ? 'dot warn' : 'dot'} />
            <span>Session: {status}</span>
          </div>
          <div className="msg system">
            音声のみの会話モード。接続後、マイクに向かって話しかけてください。
          </div>
          <div className="msg mt8 small">テキスト履歴は表示しません。</div>
        </div>
      </main>
    </div>
  )
}

export default App
