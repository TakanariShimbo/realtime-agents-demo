import { tool } from "@openai/agents-realtime";
import { runResponsesWebSearch } from "./respApi";

export function makeResponsesWebSearchTool(apiKey: string) {
  return tool({
    name: "web_search",
    description: "Use this tool to search the web. Input should be a search query in natural language.",
    parameters: {
      type: "object",
      required: ["query"],
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "User's web search query in natural language." },
      },
    },
    async execute(input: any) {
      const { query } = input ?? {};
      const text = await runResponsesWebSearch({ apiKey, query });
      return text;
    },
  });
}
