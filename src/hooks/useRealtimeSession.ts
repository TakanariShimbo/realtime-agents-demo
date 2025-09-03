import { useEffect, useRef, useState } from "react";
import { createRealtimeSession } from "../lib/realtime";
import type { ConnectionStatus, ConversationModel, TranscriptionModel, VadEagerness, RealtimeVoice, TurnDetectionType } from "../lib/constants";
import type { ChatMessage } from "../lib/constants";

export type ConnectParams = {
  apiKey: string;
  conversationModel?: ConversationModel;
  transcriptionModel?: TranscriptionModel;
  voice?: RealtimeVoice;
  instructions?: string;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
};

export function useRealtimeSession() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seenUserItemIds = useRef<Set<string>>(new Set());
  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => sessionRef.current?.session.close(), []);

  async function connect(p: ConnectParams) {
    try {
      setStatus("connecting");
      sessionRef.current?.session.close();
      setMessages([]);
      seenUserItemIds.current.clear();

      const created = createRealtimeSession({
        ...p,
        audioElement: audioRef.current,
      });

      created.session.on("error", (e: any) => {
        console.error("Realtime session error:", e instanceof Error ? e : e?.error?.message ?? e?.message ?? JSON.stringify(e));
      });

      created.session.on("agent_end", (_ctx: any, _agent: any, text: string) => {
        const content = (text ?? "").trim();
        if (!content) return;
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: content }]);
      });

      created.session.on("history_updated", (history: any[]) => {
        for (const item of history) {
          try {
            if (!item || item.type !== "message" || item.role !== "user") continue;
            const id = String(item.itemId ?? item.id ?? "");
            if (!id || seenUserItemIds.current.has(id)) continue;
            const parts = Array.isArray(item.content) ? item.content : [];
            const text = parts
              .filter((p: any) => p && (p.type === "input_text" || p.type === "text"))
              .map((p: any) => p.text || "")
              .filter(Boolean)
              .join(" ")
              .trim();
            if (text) {
              seenUserItemIds.current.add(id);
              setMessages((prev) => [...prev, { id, role: "user", text }]);
            }
          } catch {}
        }
      });

      await created.connect();
      sessionRef.current = created;
      setStatus("connected");
    } catch (e) {
      console.error("Connect failed:", e);
      setStatus("disconnected");
    }
  }

  function disconnect() {
    sessionRef.current?.session.close();
    sessionRef.current = null;
    setStatus("disconnected");
  }

  return { status, messages, connect, disconnect, audioRef } as const;
}

export default useRealtimeSession;
