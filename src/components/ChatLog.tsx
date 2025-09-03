import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import type { ChatMessage } from "../lib/constants";

export default function ChatLog(props: { messages: ChatMessage[]; emptyHint?: string }) {
  const emptyText = props.emptyHint ?? "No messages yet.";
  return (
    <>
      <Heading size="sm" mb={2}>
        Chat Log
      </Heading>
      <VStack align="stretch" gap={2} maxH="60vh" overflowY="auto">
        {props.messages.map((m) => (
          <Stack key={m.id} p={2} borderRadius="md" bg={m.role === "assistant" ? "gray.50" : "blue.50"} _dark={{ bg: m.role === "assistant" ? "gray.700" : "blue.900" }}>
            <Text fontSize="xs" color="gray.500">
              {m.role === "assistant" ? "Assistant" : "You"}
            </Text>
            <Text whiteSpace="pre-wrap">{m.text}</Text>
          </Stack>
        ))}
        {props.messages.length === 0 && <Text color="gray.500">{emptyText}</Text>}
      </VStack>
    </>
  );
}
