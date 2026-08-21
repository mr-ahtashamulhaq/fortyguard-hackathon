import { type ReactNode, useState } from "react";

export function ScrollExpand({ src, poster, children }: { src: string; poster: string; children: ReactNode }) {
  const [videoFailed, setVideoFailed] = useState(false);
  return <section className="scroll-expand" aria-label="Aerial field footage used for the synthetic heat-wave scenario">
    <div className="scroll-expand-sticky">
      <div className="scroll-expand-frame" style={{ backgroundImage: `url(${poster})` }}>
        {!videoFailed && <video src={src} poster={poster} autoPlay muted loop playsInline preload="auto" onError={() => setVideoFailed(true)} aria-label="Aerial field footage" />}
        <div className="scroll-expand-scrim" />
        <span className="field-footage-label"><i /> field footage · synthetic scenario</span>
        <div className="scroll-expand-content">{children}</div>
      </div>
      <p className="scroll-expand-hint">Aerial field footage · synthetic heat-wave scenario</p>
    </div>
  </section>;
}
