export const DEFAULT_INSTRUCTIONS =
  "You are a helpful assistant. Speak in Japanese. Keep replies concise unless asked. If the user asks you to research or check up-to-date information, use the web_search tool without asking for permission before answering.";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
