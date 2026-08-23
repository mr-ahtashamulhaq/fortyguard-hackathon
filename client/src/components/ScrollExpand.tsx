import { resolveRetryableMediaSource, shouldUseMediaFallback } from "@/lib/landing-media";
import { type ReactNode, useEffect, useState } from "react";

export function ScrollExpand({ src, fallback, children }: { src?: string; fallback?: string; children: ReactNode }) {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [hasExhaustedRetry, setHasExhaustedRetry] = useState(false);

  useEffect(() => {
    setRetryAttempt(0);
    setHasExhaustedRetry(false);
  }, [src]);

  const mediaSource = resolveRetryableMediaSource(src, retryAttempt);
  const retryVideo = () => {
    if (retryAttempt === 0) {
      setRetryAttempt(1);
      return;
    }
    setHasExhaustedRetry(true);
  };

  const media = shouldUseMediaFallback(src, hasExhaustedRetry)
    ? fallback
      ? <img className="scroll-expand-fallback" src={fallback} alt="Aerial wheat field" />
      : <div className="scroll-expand-fallback scroll-expand-signal-fallback" role="img" aria-label="Illustrative aerial field signal" />
    : <video
        key={mediaSource}
        src={mediaSource}
        poster={fallback}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onError={retryVideo}
        aria-label="Aerial field footage"
      />;
  return <section className="scroll-expand" aria-label="Aerial field footage used for the synthetic heat-wave scenario">
    <div className="scroll-expand-sticky">
      <div className="scroll-expand-frame">
        {media}
        <div className="scroll-expand-scrim" />
        <span className="field-footage-label"><i /> field footage · synthetic scenario</span>
        <div className="scroll-expand-content">{children}</div>
      </div>
      <p className="scroll-expand-hint">Aerial field footage · synthetic heat-wave scenario</p>
    </div>
  </section>;
}
