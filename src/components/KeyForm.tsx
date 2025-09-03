import { useMemo, useState } from 'react'
import { isValidApiKey } from '../lib/validation'

export type KeyFormValues = {
  apiKey: string
  model: string
  transport: 'websocket' | 'webrtc'
  voice: string
}

export function KeyForm(props: {
  initial: KeyFormValues
  onConnect: (vals: KeyFormValues) => void
  connecting?: boolean
  connected?: boolean
}) {
  const [apiKey, setApiKey] = useState(props.initial.apiKey)
  const [model, setModel] = useState(props.initial.model)
  const [transport, setTransport] = useState<KeyFormValues['transport']>(
    props.initial.transport,
  )
  const [voice, setVoice] = useState(props.initial.voice)

  const validKey = useMemo(() => isValidApiKey(apiKey), [apiKey])
  const canSubmit = validKey && !props.connecting

  return (
    <div>
      <div className="sectionTitle">OpenAI API Key</div>
      <div className="row">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          autoComplete="off"
        />
      </div>
      <div className="hint small">
        {validKey
          ? 'ブラウザにのみ保持されます。デモ用途としてご利用ください。'
          : 'sk-（通常キー）または ek_（エフェメラル）のキーを入力してください'}
      </div>

      <div className="sectionTitle">Model / Transport</div>
      <div className="row">
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-realtime">gpt-realtime</option>
          <option value="gpt-4o-realtime-preview-2025-06-03">
            gpt-4o-realtime-preview-2025-06-03
          </option>
          <option value="gpt-4o-realtime-preview-2024-12-17">
            gpt-4o-realtime-preview-2024-12-17
          </option>
          <option value="gpt-4o-mini-realtime-preview-2024-12-17">
            gpt-4o-mini-realtime-preview-2024-12-17
          </option>
        </select>
        <select
          value={transport}
          onChange={(e) => setTransport(e.target.value as any)}
        >
          <option value="websocket">websocket (text only)</option>
          <option value="webrtc">webrtc (voice + text)</option>
        </select>
      </div>

      {transport === 'webrtc' && (
        <>
          <div className="sectionTitle">Voice</div>
          <div className="row">
            <input
              type="text"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              placeholder="alloy | verse | aria など"
            />
          </div>
        </>
      )}

      <div className="row mt8">
        <button
          className="primary"
          disabled={!canSubmit}
          onClick={() => props.onConnect({ apiKey, model, transport, voice })}
        >
          {props.connecting ? 'Connecting...' : props.connected ? 'Reconnect' : 'Connect'}
        </button>
      </div>
    </div>
  )
}

export default KeyForm
