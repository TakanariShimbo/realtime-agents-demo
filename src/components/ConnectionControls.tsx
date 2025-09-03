import { Button, HStack } from "@chakra-ui/react";

export default function ConnectionControls(props: {
  connected: boolean;
  muted: boolean;
  onDisconnect: () => void;
  onToggleMute: () => void;
}) {
  return (
    <HStack gap={3} mt={3}>
      <Button onClick={props.onDisconnect} disabled={!props.connected} variant="outline">
        Disconnect
      </Button>
      <Button onClick={props.onToggleMute} disabled={!props.connected}>
        {props.muted ? "Unmute" : "Mute"}
      </Button>
    </HStack>
  );
}
