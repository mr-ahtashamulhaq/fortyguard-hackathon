import { describe, expect, it } from "vitest";
import { resolveRetryableMediaSource, shouldUseMediaFallback } from "./landing-media";

describe("landing media retry behavior", () => {
  it("keeps the original public media URL for the first playback attempt", () => {
    const source = "https://example.vercel-storage.com/landing/video.mp4";
    expect(resolveRetryableMediaSource(source, 0)).toBe(source);
  });

  it("uses a cache-busting retry URL after one media failure", () => {
    expect(resolveRetryableMediaSource("https://example.vercel-storage.com/landing/video.mp4", 1))
      .toBe("https://example.vercel-storage.com/landing/video.mp4?agriguardMediaRetry=1");
    expect(resolveRetryableMediaSource("https://example.vercel-storage.com/landing/video.mp4?version=2", 1))
      .toBe("https://example.vercel-storage.com/landing/video.mp4?version=2&agriguardMediaRetry=1");
  });

  it("uses the image fallback only when a media source is absent or its retry has failed", () => {
    expect(shouldUseMediaFallback(undefined, false)).toBe(true);
    expect(shouldUseMediaFallback("https://example.com/video.mp4", false)).toBe(false);
    expect(shouldUseMediaFallback("https://example.com/video.mp4", true)).toBe(true);
  });
});
