import { describe, expect, it } from "vitest";

const fortyGuardApiKey = process.env.FORTYGUARD_API_KEY;

describe.skipIf(!fortyGuardApiKey)("FortyGuard configuration", () => {
  it("accepts the server-side API key on the status endpoint", async () => {
    const response = await fetch("https://api.fortyguard.com/v1/status/credential-healthcheck", {
      headers: {
        "api-key": fortyGuardApiKey!,
      },
    });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.status).toBeLessThan(500);
  }, 15000);
});
