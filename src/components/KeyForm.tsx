import type React from "react";
import { useState } from "react";
import { Field, Input, Textarea, Stack, NativeSelect, Button, HStack } from "@chakra-ui/react";
import { CONVERSATION_MODELS, TRANSCRIPTION_MODELS, REALTIME_VOICES, TURN_DETECTION_TYPES, VAD_EAGERNESS } from "../realtime";

export type KeyFormValues = {
  apiKey: string;
  conversationModel: "" | (typeof CONVERSATION_MODELS)[number];
  transcriptionModel: "" | (typeof TRANSCRIPTION_MODELS)[number];
  voice: "" | (typeof REALTIME_VOICES)[number];
  instructions: string;
  vadMode: "" | (typeof TURN_DETECTION_TYPES)[number];
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: "" | (typeof VAD_EAGERNESS)[number];
};

export function KeyForm(props: {
  initial: KeyFormValues;
  onConnect: (vals: KeyFormValues) => void;
  onDisconnect: () => void;
  mode: "conversation" | "transcription";
  onSwitchMode: (mode: "conversation" | "transcription") => void;
  apiKey: string;
  apiKeyValid: boolean;
  connecting?: boolean;
  connected?: boolean;
}) {
  const [conversationModel, setConversationModel] = useState<KeyFormValues["conversationModel"]>(props.initial.conversationModel);
  const [transcriptionModel, setTranscriptionModel] = useState<KeyFormValues["transcriptionModel"]>(props.initial.transcriptionModel);
  const [voice, setVoice] = useState<KeyFormValues["voice"]>(props.initial.voice);
  const [instructions, setInstructions] = useState(props.initial.instructions);
  const [vadMode, setVadMode] = useState<KeyFormValues["vadMode"]>(props.initial.vadMode);
  const [silenceMs, setSilenceMs] = useState<number | undefined>(props.initial.silenceDurationMs);
  const [prefixMs, setPrefixMs] = useState<number | undefined>(props.initial.prefixPaddingMs);
  const [idleMs, setIdleMs] = useState<number | undefined>(props.initial.idleTimeoutMs);
  const [threshold, setThreshold] = useState<number | undefined>(props.initial.threshold);
  const [eagerness, setEagerness] = useState<KeyFormValues["eagerness"]>(props.initial.eagerness);

  const canSubmit = props.apiKeyValid && !props.connecting;

  return (
    <Stack gap={4}>
      <Field.Root>
        <Field.Label>Conversation Model</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={conversationModel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConversationModel(e.target.value as KeyFormValues["conversationModel"])}
          >
            <option value="">Default</option>
            {CONVERSATION_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Transcription Model</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={transcriptionModel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTranscriptionModel(e.target.value as KeyFormValues["transcriptionModel"])}
          >
            <option value="">Default</option>
            {TRANSCRIPTION_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Voice</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={voice} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVoice(e.target.value as KeyFormValues["voice"])}>
            <option value="">Default</option>
            {REALTIME_VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Instructions</Field.Label>
        <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Assistant behavior (日本語可)" />
      </Field.Root>

      <Field.Root>
        <Field.Label>VAD (Turn Detection)</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={vadMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVadMode(e.target.value as KeyFormValues["vadMode"])}>
            <option value="">Default</option>
            {TURN_DETECTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>VAD Eagerness</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={eagerness ?? ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEagerness(e.target.value as KeyFormValues["eagerness"])}>
            <option value="">Default</option>
            {VAD_EAGERNESS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <HStack gap={3}>
        <Field.Root flex="1">
          <Field.Label>Silence (ms)</Field.Label>
          <Input
            type="number"
            placeholder="e.g. 700"
            value={silenceMs ?? ""}
            onChange={(e) => setSilenceMs(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </Field.Root>
        <Field.Root flex="1">
          <Field.Label>Prefix padding (ms)</Field.Label>
          <Input type="number" placeholder="e.g. 250" value={prefixMs ?? ""} onChange={(e) => setPrefixMs(e.target.value === "" ? undefined : Number(e.target.value))} />
        </Field.Root>
      </HStack>

      <HStack gap={3}>
        <Field.Root flex="1">
          <Field.Label>Idle timeout (ms)</Field.Label>
          <Input type="number" placeholder="(optional)" value={idleMs ?? ""} onChange={(e) => setIdleMs(e.target.value === "" ? undefined : Number(e.target.value))} />
        </Field.Root>
        <Field.Root flex="1">
          <Field.Label>Threshold (0-1)</Field.Label>
          <Input
            type="number"
            step="0.05"
            min="0"
            max="1"
            placeholder="e.g. 0.5"
            value={threshold ?? ""}
            onChange={(e) => setThreshold(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </Field.Root>
      </HStack>

      <Field.Root>
        <Field.Label>Connection</Field.Label>
        <Button
          colorPalette={props.connected ? "red" : "blue"}
          disabled={props.connecting || (!props.connected && !props.apiKeyValid)}
          onClick={() => {
            if (props.connected) {
              props.onDisconnect();
            } else if (canSubmit) {
              props.onConnect({
                apiKey: props.apiKey,
                conversationModel,
                transcriptionModel,
                voice,
                instructions,
                vadMode,
                silenceDurationMs: silenceMs,
                prefixPaddingMs: prefixMs,
                idleTimeoutMs: idleMs,
                threshold,
                eagerness,
              });
            }
          }}
        >
          {props.connecting ? "Connecting..." : props.connected ? "Disconnect" : "Connect"}
        </Button>
      </Field.Root>

      <Field.Root>
        <Field.Label>Mode</Field.Label>
        <Button
          colorPalette="blue"
          disabled={!props.connected || props.connecting}
          onClick={() => props.onSwitchMode(props.mode === "transcription" ? "conversation" : "transcription")}
        >
          {props.mode === "transcription" ? "Conversation" : "Transcription"}
        </Button>
      </Field.Root>
    </Stack>
  );
}

export default KeyForm;
