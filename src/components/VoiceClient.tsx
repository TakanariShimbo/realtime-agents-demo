import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import { DEFAULT_INSTRUCTIONS } from "../lib/constants";
import { Box, Flex } from "@chakra-ui/react";
import useRealtimeSession from "../hooks/useRealtimeSession";
import ChatLog from "./ChatLog";
import { useState } from "react";

export default function VoiceClient() {
  const { status, messages, connect, disconnect, audioRef } = useRealtimeSession();
  const [mode, setMode] = useState<"conversation" | "transcription">("transcription");
  const [lastForm, setLastForm] = useState<KeyFormValues | null>(null);

  const initialForm: KeyFormValues = {
    apiKey: "",
    conversationModel: "",
    transcriptionModel: "",
    voice: "",
    instructions: DEFAULT_INSTRUCTIONS,
    vadMode: "",
    silenceDurationMs: undefined,
    prefixPaddingMs: undefined,
    idleTimeoutMs: undefined,
    threshold: undefined,
    eagerness: "",
  };

  async function handleConnect(v: KeyFormValues) {
    setLastForm(v);
    await connect({
      apiKey: v.apiKey,
      conversationModel: v.conversationModel || undefined,
      transcriptionModel: v.transcriptionModel || undefined,
      mode,
      voice: v.voice || undefined,
      instructions: v.instructions || undefined,
      turnDetectionType: v.vadMode || undefined,
      silenceDurationMs: v.silenceDurationMs,
      prefixPaddingMs: v.prefixPaddingMs,
      idleTimeoutMs: v.idleTimeoutMs,
      threshold: v.threshold,
      eagerness: (v.eagerness as any) || undefined,
    });
  }

  function handleDisconnect() {
    disconnect();
  }

  async function handleSwitch(nextMode: "conversation" | "transcription") {
    setMode(nextMode);
    if (status === "connected" && lastForm) {
      await connect({
        apiKey: lastForm.apiKey,
        conversationModel: lastForm.conversationModel || undefined,
        transcriptionModel: lastForm.transcriptionModel || undefined,
        mode: nextMode,
        voice: lastForm.voice || undefined,
        instructions: lastForm.instructions || undefined,
        turnDetectionType: lastForm.vadMode || undefined,
        silenceDurationMs: lastForm.silenceDurationMs,
        prefixPaddingMs: lastForm.prefixPaddingMs,
        idleTimeoutMs: lastForm.idleTimeoutMs,
        threshold: lastForm.threshold,
        eagerness: (lastForm.eagerness as any) || undefined,
      });
    }
  }

  return (
    <Flex gap={4} alignItems="stretch">
      <Box flex="1 1 50%">
        <Box mt={2}>
          <StatusDot status={status} />
        </Box>
        <Box mt={4}>
          <KeyForm
            initial={initialForm}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            mode={mode}
            onSwitchMode={handleSwitch}
            connecting={status === "connecting"}
            connected={status === "connected"}
          />
        </Box>
        <audio ref={audioRef} autoPlay />
      </Box>
      <Box flex="1 1 50%" borderWidth="1px" borderRadius="lg" p={3} minH="320px">
        <ChatLog messages={messages} />
      </Box>
    </Flex>
  );
}
