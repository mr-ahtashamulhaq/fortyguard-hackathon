import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deploymentConfig = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

describe("Vercel deployment configuration", () => {
  it("builds the Vite client and routes API traffic through the catch-all serverless function", () => {
    expect(deploymentConfig.buildCommand).toBe("pnpm build");
    expect(deploymentConfig.outputDirectory).toBe("dist/public");
    expect(deploymentConfig.functions["api/[...path].ts"].maxDuration).toBe(60);
    expect(deploymentConfig.rewrites).toContainEqual({ source: "/api/:path*", destination: "/api/[...path]" });
  });

  it("preserves client-side application routes after static files and API routes are resolved", () => {
    expect(deploymentConfig.rewrites).toContainEqual({ source: "/:path*", destination: "/index.html" });
  });
});
