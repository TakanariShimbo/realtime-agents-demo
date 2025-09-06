import { HStack, Circle, Text } from "@chakra-ui/react";
import type { ConnectionStatus } from "../lib/realtime";

export default function StatusDot({ status }: { status: ConnectionStatus }) {
  const color = status === "connected" ? "green.400" : status === "connecting" ? "orange.400" : "gray.400";
  return (
    <HStack gap={2} color="gray.500" fontSize="sm">
      <Circle size="10px" bg={color} />
      <Text color="gray.500">Session: {status}</Text>
    </HStack>
  );
}
