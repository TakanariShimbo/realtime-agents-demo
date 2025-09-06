import { type RealtimeConnectOptions, type RealtimeSessionHandle, prepareRealtimeSession } from "./prepareSession";
import type { ConnectionStatus } from "./constants";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type RealtimeHandlers = {
  onStatus?: (s: ConnectionStatus) => void;
  onMessage?: (m: ChatMessage) => void;
  onError?: (e: any) => void;
};

function extractTranscript(parts: any[]): string {
  if (!Array.isArray(parts)) return "";
  const tPart = parts.find((p: any) => typeof p?.transcript === "string" && p.transcript.trim());
  return tPart ? String(tPart.transcript).trim() : "";
}

export async function connectSession(opts: RealtimeConnectOptions, handlers: RealtimeHandlers = {}): Promise<{ handle: RealtimeSessionHandle; stop: () => void }> {
  const { onStatus, onMessage, onError } = handlers;

  const handle = prepareRealtimeSession(opts);
  const seen = new Set<string>();

  handle.session.on("error", (e: any) => {
    const msg = e instanceof Error ? e : e?.error?.message ?? e?.message ?? JSON.stringify(e);
    console.error("Realtime session error:", msg);
    onError?.(e);
  });

  handle.session.on("history_updated", (history: any[]) => {
    for (const item of history) {
      try {
        if (!item || item.type !== "message") continue;
        if (item.role !== "user" && item.role !== "assistant") continue;

        const id = String(item.itemId ?? item.id ?? "");
        if (!id || seen.has(id)) continue;

        const parts = Array.isArray(item.content) ? item.content : [];
        const text = extractTranscript(parts);
        if (text) {
          seen.add(id);
          onMessage?.({ id, role: item.role, text });
        }
      } catch {}
    }
  });

  await handle.connect();
  onStatus?.("connected");

  function stop() {
    try {
      handle.session.close();
    } finally {
      onStatus?.("disconnected");
    }
  }

  return { handle, stop } as const;
}
