import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import { DEFAULT_INSTRUCTIONS } from "../lib/constants";
import { Box, Flex } from "@chakra-ui/react";
import useRealtimeSession from "../hooks/useRealtimeSession";
import ChatLog from "./ChatLog";

export default function VoiceClient() {
  const { status, messages, connect, disconnect, audioRef } = useRealtimeSession();

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
    await connect({
      apiKey: v.apiKey,
      conversationModel: v.conversationModel || undefined,
      transcriptionModel: v.transcriptionModel || undefined,
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
