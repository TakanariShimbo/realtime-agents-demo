import OpenAI from "openai";
import { Agent, OpenAIResponsesModel, run, webSearchTool } from "@openai/agents";

type WebSearchOptions = {
  apiKey: string;
  query: string;
  instructions?: string;
  model?: string;
};

const DEFAULT_MODEL = "gpt-4.1";
const DEFAULT_INSTRUCTIONS = "Use the built-in web_search tool to answer the user's question. Keep the answer short and concise.";

function buildAgent(opts: { apiKey: string; model: string; instructions: string }) {
  const openai = new OpenAI({ apiKey: opts.apiKey, dangerouslyAllowBrowser: true });
  const responsesModel = new OpenAIResponsesModel(openai, opts.model);
  return new Agent({
    name: "ResponsesWebSearchAgent",
    model: responsesModel,
    tools: [webSearchTool()],
    instructions: opts.instructions,
  });
}

export async function runWebSearchAgent({ apiKey, query, instructions = DEFAULT_INSTRUCTIONS, model = DEFAULT_MODEL }: WebSearchOptions): Promise<string> {
  const agent = buildAgent({ apiKey, model, instructions });
  const result = await run(agent, query);
  const out = result.finalOutput;
  return typeof out === "string" ? out : JSON.stringify(out);
}
