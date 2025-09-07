import { tool } from "@openai/agents-realtime";
import { runWebSearchAgent } from "../responses";

export function WebSearchAgentTool(opts: { apiKey: string }) {
  return tool({
    name: "web_search",
    description:
      "Use this when you need up-to-date external information. " +
      "Input is a single natural-language search query. " +
      "Return a concise answer and include key sources (site name + URL) when helpful. " +
      "If uncertain, state the uncertainty.",
    parameters: {
      type: "object",
      required: ["query"],
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "A single natural-language search query (e.g., 'latest USD/JPY rate')." },
      },
    },
    async execute(input: any) {
      const { query } = input ?? {};
      const text = await runWebSearchAgent({ apiKey: opts.apiKey, query });
      return text;
    },
  });
}

export function getTools(opts: { apiKey: string }) {
  return [WebSearchAgentTool({ apiKey: opts.apiKey }) as any];
}
