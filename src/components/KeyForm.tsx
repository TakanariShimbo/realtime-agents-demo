import type React from "react";
import { useMemo, useState } from "react";
import { isValidApiKey } from "../lib/validation";
import { REALTIME_MODELS, REALTIME_VOICES, TURN_DETECTION_TYPES } from "../lib/constants";
import {
  Field,
  Input,
  Textarea,
  Button,
  Stack,
  Heading,
  NativeSelect,
} from "@chakra-ui/react";

export type KeyFormValues = {
  apiKey: string;
  model: typeof REALTIME_MODELS[number];
  voice: typeof REALTIME_VOICES[number];
  instructions: string;
  vadMode: (typeof TURN_DETECTION_TYPES)[number];
};

export function KeyForm(props: { initial: KeyFormValues; onConnect: (vals: KeyFormValues) => void; connecting?: boolean; connected?: boolean }) {
  const [apiKey, setApiKey] = useState(props.initial.apiKey);
  const [model, setModel] = useState(props.initial.model);
  const [voice, setVoice] = useState(props.initial.voice);
  const [instructions, setInstructions] = useState(props.initial.instructions);
  const [vadMode, setVadMode] = useState<KeyFormValues["vadMode"]>(props.initial.vadMode);

  const validKey = useMemo(() => isValidApiKey(apiKey), [apiKey]);
  const canSubmit = validKey && !props.connecting;

  return (
    <Stack gap={4}>
      <Heading size="md">Realtime Demo</Heading>

      <Field.Root>
        <Field.Label>OpenAI API Key</Field.Label>
        <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
        <Field.HelperText>{validKey ? "APIキーがセットされています" : "APIキーを入力してください"}</Field.HelperText>
      </Field.Root>

      <Field.Root>
        <Field.Label>Model</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={model} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value as KeyFormValues["model"])}>
            {REALTIME_MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Voice</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={voice} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVoice(e.target.value as KeyFormValues["voice"])}>
            {REALTIME_VOICES.map((v) => (
              <option key={v} value={v}>{v}</option>
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
          <NativeSelect.Field value={vadMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVadMode(e.target.value as KeyFormValues["vadMode"]) }>
            {TURN_DETECTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Button colorPalette="blue" disabled={!canSubmit} onClick={() => props.onConnect({ apiKey, model, voice, instructions, vadMode })}>
        {props.connecting ? "Connecting..." : props.connected ? "Reconnect" : "Connect"}
      </Button>
    </Stack>
  );
}

export default KeyForm;
