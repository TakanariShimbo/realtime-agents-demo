import { useEffect, useRef, useState } from "react";
import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import { createRealtimeSession } from "../lib/realtime";
import { DEFAULT_INSTRUCTIONS } from "../lib/constants";
import { Box } from "@chakra-ui/react";
import type { ConnectionStatus } from "../lib/constants";

export default function VoiceClient() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initialForm: KeyFormValues = {
    apiKey: "",
    model: "",
    voice: "",
    instructions: DEFAULT_INSTRUCTIONS,
    vadMode: "",
    silenceDurationMs: undefined,
    prefixPaddingMs: undefined,
    idleTimeoutMs: undefined,
    threshold: undefined,
    eagerness: "",
  };

  useEffect(() => () => sessionRef.current?.session.close(), []);

  async function handleConnect(v: KeyFormValues) {
    try {
      setStatus("connecting");
      sessionRef.current?.session.close();

      const created = createRealtimeSession({
        apiKey: v.apiKey,
        model: v.model || undefined,
        voice: v.voice || undefined,
        instructions: v.instructions || undefined,
        turnDetectionType: v.vadMode || undefined,
        silenceDurationMs: v.silenceDurationMs,
        prefixPaddingMs: v.prefixPaddingMs,
        idleTimeoutMs: v.idleTimeoutMs,
        threshold: v.threshold,
        eagerness: (v.eagerness as any) || undefined,
        audioElement: audioRef.current,
      });

      created.session.on("error", (e: any) => {
        console.error("Realtime session error:", e instanceof Error ? e : e?.error?.message ?? e?.message ?? JSON.stringify(e));
      });

      await created.connect();
      sessionRef.current = created;
      setStatus("connected");
    } catch (e: any) {
      console.error("Connect failed:", e instanceof Error ? e : e?.error?.message ?? e?.message ?? JSON.stringify(e));
      setStatus("disconnected");
    }
  }

  function handleDisconnect() {
    sessionRef.current?.session.close();
    sessionRef.current = null;
    setStatus("disconnected");
  }

  return (
    <Box>
      <Box mt={2}>
        <StatusDot status={status} />
      </Box>
      <Box mt={4}>
        <KeyForm
          initial={initialForm}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          connecting={status === "connecting"}
          connected={status === "connected"}
        />
      </Box>
      <audio ref={audioRef} autoPlay />
    </Box>
  );
}
