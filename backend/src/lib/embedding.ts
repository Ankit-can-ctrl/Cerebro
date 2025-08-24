import OpenAi from "openai";

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY || "ollama",
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const input = text.replace(/\s+/g, " ").trim();
  const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

  // Prefer native Ollama embeddings API when OLLAMA_BASE_URL is provided
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
  if (ollamaBaseUrl) {
    const url = `${ollamaBaseUrl.replace(/\/$/, "")}/api/embeddings`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: input }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama embeddings failed (${response.status}): ${body}`);
    }
    const data: any = await response.json();
    if (!data || !Array.isArray(data.embedding)) {
      throw new Error("Ollama embeddings response missing embedding array");
    }
    return data.embedding as number[];
  }

  // Fallback to OpenAI-compatible route (works with OpenAI or Ollama /v1 if supported)
  const res = await client.embeddings.create({ model, input });
  return res.data[0].embedding;
}
