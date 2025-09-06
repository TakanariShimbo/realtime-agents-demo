import { useEffect, useRef, useState } from "react";
import type { ConnectionStatus, RealtimeConnectOptions } from "../lib/realtime";
import { connectRealtimeSession, type ChatMessage } from "../lib/realtimeSimple";

export type { ChatMessage };

export function useRealtimeSession() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<null | (() => void)>(null);

  useEffect(() => () => stopRef.current?.(), []);

  async function connect(p: RealtimeConnectOptions) {
    setStatus("connecting");
    stopRef.current?.();
    setMessages([]);
    const { stop } = await connectRealtimeSession(
      { ...p, audioElement: audioRef.current },
      {
        onStatus: (s) => setStatus(s),
        onMessage: (m) => setMessages((prev) => prev.concat(m)),
        onError: (e) => console.error("Realtime error:", e),
      }
    );
    stopRef.current = stop;
  }

  function disconnect() {
    stopRef.current?.();
    stopRef.current = null;
  }

  return { status, messages, connect, disconnect, audioRef } as const;
}

export default useRealtimeSession;
