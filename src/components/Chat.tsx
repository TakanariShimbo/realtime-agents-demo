import { useEffect, useMemo, useRef } from 'react'
import type { UiMessage } from '../lib/realtime'

export function Chat(props: {
  messages: UiMessage[]
  status: 'disconnected' | 'connecting' | 'connected'
}) {
  const endRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [props.messages.length])

  const dotClass = useMemo(() => {
    if (props.status === 'connected') return 'dot ok'
    if (props.status === 'connecting') return 'dot warn'
    return 'dot'
  }, [props.status])

  return (
    <div className="chat">
      <div className="status mb8">
        <span className={dotClass} />
        <span>Session: {props.status}</span>
      </div>
      {props.messages.map((m) => (
        <div
          key={m.id}
          className={`msg ${m.role} ${m.inProgress ? 'inprogress' : ''}`}
        >
          {m.text || <span className="small">(no text)</span>}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}

export default Chat

