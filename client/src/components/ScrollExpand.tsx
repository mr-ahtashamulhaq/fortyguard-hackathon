import { type ReactNode, useState } from "react";

export function ScrollExpand({ src, fallback, children }: { src?: string; fallback?: string; children: ReactNode }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const media = !src || videoFailed
    ? fallback
      ? <img className="scroll-expand-fallback" src={fallback} alt="Aerial wheat field" />
      : <div className="scroll-expand-fallback scroll-expand-signal-fallback" role="img" aria-label="Illustrative aerial field signal" />
    : <video src={src} autoPlay muted loop playsInline preload="auto" onError={() => setVideoFailed(true)} aria-label="Aerial field footage" />;
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
