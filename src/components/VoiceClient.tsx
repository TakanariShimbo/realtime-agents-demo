import KeyForm, { type KeyFormValues } from "./KeyForm";
import StatusDot from "./StatusDot";
import { DEFAULT_INSTRUCTIONS } from "../lib/constants";
import { Box, Flex, Heading, Field, Input, Text, Button, HStack, Dialog } from "@chakra-ui/react";
import useRealtimeSession from "../hooks/useRealtimeSession";
import ChatLog from "./ChatLog";
import { useMemo, useState } from "react";
import { isValidApiKey } from "../lib/validation";

export default function VoiceClient() {
  const { status, messages, connect, disconnect, audioRef } = useRealtimeSession();
  const [mode, setMode] = useState<"conversation" | "transcription">("transcription");
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyOpen, setApiKeyOpen] = useState<boolean>(false);
  const apiKeyValid = useMemo(() => isValidApiKey(apiKey), [apiKey]);
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
        apiKey: apiKey,
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
    <Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="md">Realtime Demo</Heading>
        <HStack gap={3} alignItems="center">
          <Button variant="outline" size="sm" onClick={() => setApiKeyOpen(true)}>
            API Key
          </Button>
          <StatusDot status={status} />
        </HStack>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" p={4} mt={3}>
        <Flex gap={4} alignItems="stretch">
          <Box flex="1 1 50%">
            <KeyForm
              initial={initialForm}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              mode={mode}
              onSwitchMode={handleSwitch}
              apiKey={apiKey}
              apiKeyValid={apiKeyValid}
              connecting={status === "connecting"}
              connected={status === "connected"}
            />
            <audio ref={audioRef} autoPlay />
          </Box>
          <Box flex="1 1 50%" borderWidth="1px" borderRadius="lg" p={3} minH="320px">
            <ChatLog messages={messages} />
          </Box>
        </Flex>
      </Box>

      <Dialog.Root open={apiKeyOpen} onOpenChange={(e) => setApiKeyOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>OpenAI API Key</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>OpenAI API Key</Field.Label>
                <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3} justifyContent="flex-end" width="100%">
                <Dialog.CloseTrigger asChild>
                  <Button variant="plain">Cancel</Button>
                </Dialog.CloseTrigger>
                <Dialog.CloseTrigger asChild>
                  <Button colorPalette="blue">Save</Button>
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
