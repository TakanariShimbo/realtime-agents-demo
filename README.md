# Realtime Agents Demo (frontend-only)

Simple React + Vite app that connects to the OpenAI Realtime API using the new Agents Realtime SDK (`@openai/agents-realtime`). It runs entirely in the browser and is intended for demos and local exploration only.

Important: In production, never expose your normal OpenAI API key to the browser. Use an ephemeral client key minted by your backend and pass that to `session.connect({ apiKey })`. The official quickstart and transport guides cover ephemeral tokens and browser usage. See References.

## Run locally

```bash
npm i
npm run dev
```

Open the app, paste your OpenAI API key, pick a model, then Connect. For text-only chat pick Transport: `websocket`. For voice, pick `webrtc` and grant the microphone permission.

## What’s inside

- `@openai/agents-realtime`: Realtime Agents browser SDK
- Minimal service wrapper: `src/lib/realtime.ts`
- Simple components: `KeyForm`, `Chat`, `Composer`

## Notes

- This demo sets an SDK option that allows a regular API key to be used from the browser for testing. Replace this with a backend that issues ephemeral client tokens for real deployments.
- WebRTC transport auto-configures audio I/O; WebSocket transport is great for text-only chat. Managing raw PCM audio over WebSocket is also supported by the API if needed.

## References

- Agents SDK README (RealtimeAgent / RealtimeSession, browser usage)
- Voice Agents Quickstart (ephemeral tokens, `session.connect({ apiKey })`, WebRTC auto-setup)
- Transport guide (choose WebSocket vs WebRTC and raw audio handling)
