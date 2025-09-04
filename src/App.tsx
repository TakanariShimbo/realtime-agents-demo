import VoiceClient from "./components/VoiceClient";
import { Container } from "@chakra-ui/react";

function App() {
  return (
    <Container maxW="container.md" py={6}>
      <VoiceClient />
    </Container>
  );
}

export default App;
