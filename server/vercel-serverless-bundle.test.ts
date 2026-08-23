import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = new URL("../", import.meta.url).pathname;
const outputPath = new URL("../dist/serverless/api-app.smoke-test.js", import.meta.url).pathname;

describe("Vercel serverless API bundle", () => {
  it("compiles and imports the API application without a source-module dependency", async () => {
    rmSync(outputPath, { force: true });

    try {
      execFileSync("pnpm", [
        "exec",
        "esbuild",
        "server/_core/api-app.ts",
        "--platform=node",
        "--packages=external",
        "--bundle",
        "--format=esm",
        `--outfile=${outputPath}`,
      ], { cwd: projectRoot, stdio: "pipe" });

      expect(existsSync(outputPath)).toBe(true);
      const { createApiApp } = await import(`${pathToFileURL(outputPath).href}?test=${Date.now()}`);
      expect(typeof createApiApp).toBe("function");
      expect(typeof createApiApp()).toBe("function");
    } finally {
      rmSync(outputPath, { force: true });
    }
  });
});
