# Realtime Agents Demo (WebRTC voice only)

React + Vite で最新の `@openai/agents-realtime` を用いた「音声のみ」の最小デモです。ブラウザから WebRTC で Realtime API に接続し、マイクの音声に応答して音声を再生します（テキスト履歴は表示しません）。

## Run locally

```bash
npm i
npm run dev
```

画面で OpenAI API Key（`sk-...`）と任意の Voice 名を入力→Connect。マイク許可後、そのまま話しかけると音声で応答します。

## What’s inside

- `@openai/agents-realtime`: Realtime Agents browser SDK
- 交通層: WebRTC のみ（`src/lib/realtime.ts`）
- UI: `KeyForm`（接続/Voice）, サイドバー＋状態表示のみ

## Notes

- デモではブラウザから `sk-` キーを直接使用しています（SDK の `useInsecureApiKey` を有効化）。本番では必ずサーバでエフェメラルキーを発行してください。
- WebRTC はマイク/スピーカーを自動構成します。ネットワークやブラウザ設定により WebRTC がブロックされると接続に失敗します。

## References

- Agents SDK README / Voice Agents Quickstart / Transport guide（公式ドキュメント）
