import { Button, HStack } from "@chakra-ui/react";

export default function ConnectionControls(props: { connected: boolean; onDisconnect: () => void }) {
  return (
    <HStack gap={3} mt={3}>
      <Button onClick={props.onDisconnect} disabled={!props.connected} variant="outline">
        Disconnect
      </Button>
    </HStack>
  );
}
