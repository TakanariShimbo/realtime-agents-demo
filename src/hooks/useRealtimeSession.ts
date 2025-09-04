import { useEffect, useRef, useState } from "react";
import { createRealtimeSession } from "../lib/realtime";
import type { ConnectionStatus, ConversationModel, TranscriptionModel, VadEagerness, RealtimeVoice, TurnDetectionType, SessionMode } from "../lib/constants";
import type { ChatMessage } from "../lib/constants";

export type ConnectParams = {
  apiKey: string;
  conversationModel?: ConversationModel;
  transcriptionModel?: TranscriptionModel;
  mode?: SessionMode;
  voice?: RealtimeVoice;
  instructions?: string;
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
};

function extractTranscript(parts: any[]): string {
  if (!Array.isArray(parts)) {
    return "";
  }
  const tPart = parts.find((p: any) => typeof p?.transcript === "string" && p.transcript.trim());
  if (tPart) {
    return tPart.transcript.trim();
  }
  return "";
}

export function useRealtimeSession() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seenItemIds = useRef<Set<string>>(new Set());
  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => sessionRef.current?.session.close(), []);

  async function connect(p: ConnectParams) {
    try {
      setStatus("connecting");
      sessionRef.current?.session.close();
      setMessages([]);
      seenItemIds.current.clear();

      const created = createRealtimeSession({
        ...p,
        audioElement: audioRef.current,
      });

      created.session.on("error", (e: any) => {
        console.error("Realtime session error:", e instanceof Error ? e : e?.error?.message ?? e?.message ?? JSON.stringify(e));
      });

      created.session.on("history_updated", (history: any[]) => {
        for (const item of history) {
          try {
            if (!item || item.type !== "message") continue;
            if (item.role !== "user" && item.role !== "assistant") continue;

            const id = String(item.itemId ?? item.id ?? "");
            if (!id || seenItemIds.current.has(id)) continue;

            const parts = Array.isArray(item.content) ? item.content : [];
            const text = extractTranscript(parts);
            if (text) {
              seenItemIds.current.add(id);
              setMessages((prev) => [...prev, { id, role: item.role, text }]);
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
