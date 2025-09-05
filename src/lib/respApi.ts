export type WebSearchOptions = {
  apiKey: string;
  query: string;
  instructions?: string;
};

export async function runResponsesWebSearch({ apiKey, query }: WebSearchOptions): Promise<string> {
  const res = await fetchResponsesWebSearch({ apiKey, query });
  return extractResponsesOutput(res) || JSON.stringify(res);
}

export async function fetchResponsesWebSearch({
  apiKey,
  query,
  instructions = "Use the built-in web_search tool to answer the user's question. Keep the answer short and concise.",
  model = "gpt-4.1",
}: {
  apiKey: string;
  query: string;
  instructions?: string;
  model?: string;
}): Promise<any> {
  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: query,
      instructions: instructions,
      tools: [{ type: "web_search" }],
      text: { format: { type: "text" } },
    }),
  });

  if (!resp.ok) {
    let detail = "";
    try {
      const j = await resp.json();
      detail = j?.error?.message || JSON.stringify(j);
    } catch {}
    throw new Error(`Responses API error (${resp.status}): ${detail}`);
  }
  return await resp.json();
}

function extractResponsesOutput(payload: any): string {
  if (!payload) return "";
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const items = Array.isArray(payload.output) ? payload.output : [];
  const parts: string[] = [];
  for (const it of items) {
    const content = Array.isArray(it?.content) ? it.content : [];
    for (const c of content) {
      if (c?.type === "output_text" && typeof c?.text === "string" && c.text.trim()) {
        parts.push(c.text.trim());
      }
    }
  }
  return parts.join("\n\n").trim();
}
