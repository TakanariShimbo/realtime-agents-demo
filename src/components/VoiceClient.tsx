import { useEffect, useRef, useState } from "react";
import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import ConnectionControls from "./ConnectionControls";
import { createRealtimeSession } from "../lib/realtime";
import { DEFAULT_REALTIME_MODEL, DEFAULT_REALTIME_VOICE, DEFAULT_TURN_DETECTION_TYPE, DEFAULT_INSTRUCTIONS } from "../lib/constants";
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
    voice: DEFAULT_REALTIME_VOICE,
    instructions: DEFAULT_INSTRUCTIONS,
    vadMode: DEFAULT_TURN_DETECTION_TYPE,
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
        <KeyForm initial={initialForm} onConnect={handleConnect} connecting={status === "connecting"} connected={status === "connected"} />
      </Box>
      <ConnectionControls connected={status === "connected"} onDisconnect={handleDisconnect} />
      <audio ref={audioRef} autoPlay />
    </Box>
  );
}
