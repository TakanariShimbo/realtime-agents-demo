import { useEffect, useRef, useState } from "react";
import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import { createRealtimeSession } from "../lib/realtime";
import {
  DEFAULT_REALTIME_MODEL,
  DEFAULT_REALTIME_VOICE,
  DEFAULT_TURN_DETECTION_TYPE,
  DEFAULT_INSTRUCTIONS,
  DEFAULT_VAD_SILENCE_MS,
  DEFAULT_VAD_PREFIX_MS,
  DEFAULT_VAD_THRESHOLD,
  DEFAULT_VAD_EAGERNESS,
  DEFAULT_VAD_IDLE_MS,
} from "../lib/constants";
import { Box } from "@chakra-ui/react";
import type { ConnectionStatus } from "../lib/constants";
import { DEFAULT_CONNECTION_STATUS } from "../lib/constants";

export default function VoiceClient() {
  const [status, setStatus] = useState<ConnectionStatus>(DEFAULT_CONNECTION_STATUS);

  const sessionRef = useRef<ReturnType<typeof createRealtimeSession> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initialForm: KeyFormValues = {
    apiKey: "",
    model: DEFAULT_REALTIME_MODEL as KeyFormValues["model"],
    voice: DEFAULT_REALTIME_VOICE as KeyFormValues["voice"],
    instructions: DEFAULT_INSTRUCTIONS,
    vadMode: DEFAULT_TURN_DETECTION_TYPE as KeyFormValues["vadMode"],
    silenceDurationMs: DEFAULT_VAD_SILENCE_MS,
    prefixPaddingMs: DEFAULT_VAD_PREFIX_MS,
    idleTimeoutMs: DEFAULT_VAD_IDLE_MS,
    threshold: DEFAULT_VAD_THRESHOLD,
    eagerness: DEFAULT_VAD_EAGERNESS as KeyFormValues["eagerness"],
  };

  useEffect(() => () => sessionRef.current?.session.close(), []);

  async function handleConnect(v: KeyFormValues) {
    try {
      setStatus("connecting");
      sessionRef.current?.session.close();

      const created = createRealtimeSession({
        apiKey: v.apiKey,
        model: v.model,
        voice: v.voice,
        instructions: v.instructions,
        turnDetectionType: v.vadMode,
        silenceDurationMs: v.silenceDurationMs,
        prefixPaddingMs: v.prefixPaddingMs,
        idleTimeoutMs: v.idleTimeoutMs,
        threshold: v.threshold,
        eagerness: v.eagerness,
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
