import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deploymentConfig = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const serverlessEntry = readFileSync(new URL("../api/[...path].ts", import.meta.url), "utf8");
const clientIndex = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");

describe("Vercel deployment configuration", () => {
  it("builds the Vite client and routes API traffic through the catch-all serverless function", () => {
    expect(deploymentConfig.buildCommand).toBe("pnpm build");
    expect(deploymentConfig.outputDirectory).toBe("dist/public");
    expect(deploymentConfig.functions["api/[...path].ts"].maxDuration).toBe(60);
    expect(deploymentConfig.functions["api/[...path].ts"].includeFiles).toBe("dist/serverless/**");
    expect(deploymentConfig.rewrites).toContainEqual({ source: "/api/:path*", destination: "/api/[...path]" });
  });

  it("preserves client-side application routes after static files and API routes are resolved", () => {
    expect(deploymentConfig.rewrites).toContainEqual({ source: "/:path*", destination: "/index.html" });
  });

  it("builds and imports an explicit serverless API bundle instead of a source-only module", () => {
    expect(packageJson.scripts.build).toContain("server/_core/api-app.ts");
    expect(serverlessEntry).toContain("../dist/serverless/api-app.js");
  });

  it("includes the branded AgriGuard favicon in the public HTML head", () => {
    expect(clientIndex).toContain('rel="icon"');
    expect(clientIndex).toContain('href="/favicon.svg"');
  });
});
