import { useState } from 'react'

export function Composer(props: {
  disabled?: boolean
  onSend: (text: string) => void
  onInterrupt?: () => void
}) {
  const [text, setText] = useState('')
  return (
    <div className="composer">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (text.trim()) {
              props.onSend(text)
              setText('')
            }
          }
        }}
        placeholder={
          props.disabled ? 'Connect to start chatting…' : 'Type message and press Enter'
        }
        disabled={props.disabled}
      />
      <button
        className="primary"
        disabled={props.disabled || !text.trim()}
        onClick={() => {
          if (!text.trim()) return
          props.onSend(text)
          setText('')
        }}
      >
        Send
      </button>
      {props.onInterrupt && (
        <button className="ghost" onClick={props.onInterrupt} disabled={props.disabled}>
          Interrupt
        </button>
      )}
    </div>
  )
}

export default Composer

