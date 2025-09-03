import VoiceClient from "./components/VoiceClient";
import { Box, Container } from "@chakra-ui/react";

function App() {
  return (
    <Container maxW="container.md" py={6}>
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <VoiceClient />
      </Box>
    </Container>
  );
}

export default App;
