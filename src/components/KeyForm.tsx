import { useMemo, useState } from "react";
import { isValidApiKey } from "../lib/validation";

export type KeyFormValues = {
  apiKey: string;
  voice: string;
};

export function KeyForm(props: { initial: KeyFormValues; onConnect: (vals: KeyFormValues) => void; connecting?: boolean; connected?: boolean }) {
  const [apiKey, setApiKey] = useState(props.initial.apiKey);
  const [voice, setVoice] = useState(props.initial.voice);

  const validKey = useMemo(() => isValidApiKey(apiKey), [apiKey]);
  const canSubmit = validKey && !props.connecting;

  return (
    <div>
      <div className="sectionTitle">OpenAI API Key</div>
      <div className="row">
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
      </div>
      <div className="hint small">{validKey ? "ブラウザにのみ保持されます。" : "sk-... のAPIキーを入力してください"}</div>

      <div className="sectionTitle">Voice</div>
      <div className="row">
        <input type="text" value={voice} onChange={(e) => setVoice(e.target.value)} placeholder="alloy | verse | aria など" />
      </div>

      <div className="row mt8">
        <button className="primary" disabled={!canSubmit} onClick={() => props.onConnect({ apiKey, voice })}>
          {props.connecting ? "Connecting..." : props.connected ? "Reconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}

export default KeyForm;
