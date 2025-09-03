import { useEffect, useRef, useState } from "react";
import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot, { type Status } from "./StatusDot";
import ConnectionControls from "./ConnectionControls";
import { createRealtimeSession, DEFAULT_MODEL } from "../lib/realtime";

export default function VoiceClient() {
  const [status, setStatus] = useState<Status>("disconnected");
  const [muted, setMuted] = useState(false);

  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initialForm: KeyFormValues = { apiKey: "", voice: "alloy" };

  useEffect(() => () => sessionRef.current?.session.close(), []);

  async function handleConnect(v: KeyFormValues) {
    try {
      setStatus("connecting");
      sessionRef.current?.session.close();

      const created = createRealtimeSession({
        apiKey: v.apiKey,
        model: DEFAULT_MODEL,
        voice: v.voice,
        audioElement: audioRef.current,
      });

      created.session.on("error", (e) => {
        console.error("Realtime session error:", e);
      });

      await created.connect();
      sessionRef.current = created;
      setStatus("connected");
      setMuted(false);
    } catch (e: any) {
      console.error("Connect failed:", e);
      setStatus("disconnected");
    }
  }

  function handleDisconnect() {
    sessionRef.current?.session.close();
    sessionRef.current = null;
    setStatus("disconnected");
    setMuted(false);
  }

  function handleToggleMute() {
    const next = !muted;
    setMuted(next);
    sessionRef.current?.session.mute(next);
  }

  return (
    <>
      <h2 style={{ margin: 0 }}>Realtime Demo</h2>
      <div className="mt8">
        <StatusDot status={status} />
      </div>
      <div className="mt8">
        <KeyForm initial={initialForm} onConnect={handleConnect} connecting={status === "connecting"} connected={status === "connected"} />
      </div>
      <ConnectionControls connected={status === "connected"} muted={muted} onDisconnect={handleDisconnect} onToggleMute={handleToggleMute} />
      <audio ref={audioRef} autoPlay />
    </>
  );
}
