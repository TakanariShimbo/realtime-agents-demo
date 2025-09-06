import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import type { ChatMessage } from "../hooks/useRealtimeSession";

export default function TranscriptionLog(props: { messages: ChatMessage[]; emptyHint?: string }) {
  const userOnly = props.messages.filter((m) => m.role === "user");
  const emptyText = props.emptyHint ?? "No transcription yet.";
  return (
    <>
      <Heading size="sm" mb={2}>
        Transcription
      </Heading>
      <VStack align="stretch" gap={2} maxH="60vh" overflowY="auto">
        {userOnly.map((m) => (
          <Stack key={m.id} p={2} borderRadius="md" bg="blue.50" _dark={{ bg: "blue.900" }}>
            <Text fontSize="xs" color="gray.500">
              You
            </Text>
            <Text whiteSpace="pre-wrap">{m.text}</Text>
          </Stack>
        ))}
        {userOnly.length === 0 && <Text color="gray.500">{emptyText}</Text>}
      </VStack>
    </>
  );
}
