import { OpenAIRealtimeWebRTC, RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";
import type { RealtimeModel, RealtimeVoice, TurnDetectionType } from "./constants";
import { DEFAULT_INSTRUCTIONS, DEFAULT_REALTIME_MODEL, DEFAULT_REALTIME_VOICE, DEFAULT_TURN_DETECTION_TYPE } from "./constants";

export type ConnectOptions = {
  apiKey: string;
  model?: RealtimeModel;
  voice?: RealtimeVoice;
  instructions?: string;
  turnDetectionType?: TurnDetectionType;
  audioElement?: HTMLAudioElement | null;
};

export function createRealtimeSession({
  apiKey,
  model = DEFAULT_REALTIME_MODEL as RealtimeModel,
  voice = DEFAULT_REALTIME_VOICE as RealtimeVoice,
  instructions = DEFAULT_INSTRUCTIONS,
  turnDetectionType = DEFAULT_TURN_DETECTION_TYPE,
  audioElement,
}: ConnectOptions) {
  const agent = new RealtimeAgent({
    name: "RealtimeAgent",
    instructions,
  });

  const transport = new OpenAIRealtimeWebRTC({
    baseUrl: `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`,
    useInsecureApiKey: true,
    audioElement: audioElement ?? undefined,
  });

  const session = new RealtimeSession(agent, {
    transport,
    model,
    config: {
      outputModalities: ["audio"],
      audio: {
        input: {
          turnDetection: {
            type: turnDetectionType,
            createResponse: true,
            interruptResponse: true,
          },
        },
        output: { voice },
      },
    },
  });

  return {
    session,
    connect: async () => {
      await session.connect({
        apiKey,
      });
    },
  };
}
