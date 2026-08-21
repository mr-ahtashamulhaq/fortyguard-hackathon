import { describe, expect, it } from "vitest";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const groqApiKey = process.env.GROQ_API_KEY;
const hasSupabaseConfiguration = Boolean(supabaseUrl && publishableKey && secretKey);

async function readApiRoot(apiKey: string) {
  return fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: apiKey,
    },
  });
}

describe.skipIf(!hasSupabaseConfiguration)("Supabase configuration", () => {
  it("accepts the browser publishable key", async () => {
    const response = await readApiRoot(publishableKey!);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.status).toBeLessThan(500);
  });

  it("accepts the server secret key", async () => {
    const response = await readApiRoot(secretKey!);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.status).toBeLessThan(500);
  });
});

describe.skipIf(!groqApiKey)("Groq configuration", () => {
  it("accepts the server-side API key", async () => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: "Reply with OK." }],
        max_completion_tokens: 16,
        temperature: 0,
      }),
    });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.status).toBeLessThan(500);
  }, 15000);
});
