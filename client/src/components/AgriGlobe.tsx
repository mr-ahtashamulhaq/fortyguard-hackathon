import { Globe } from "@/components/ui/globe";
import { useEffect, useMemo, useRef, useState } from "react";

export function AgriGlobe() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [canRender, setCanRender] = useState(false);

  const config = useMemo(
    () => ({
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 1,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 9500,
      mapBrightness: 0.95,
      baseColor: [0.07, 0.19, 0.15] as [number, number, number],
      markerColor: [0.79, 0.35, 0.17] as [number, number, number],
      glowColor: [0.27, 0.63, 0.5] as [number, number, number],
      markers: [
        { location: [30.0, 65.0] as [number, number], size: 0.055 },
        { location: [39.0, -97.0] as [number, number], size: 0.035 },
        { location: [-34.0, 147.0] as [number, number], size: 0.035 },
      ],
    }),
    [],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setCanRender(!reduceMotion && desktop);
    if (reduceMotion || !desktop || !shellRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px" },
    );
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="agri-globe-shell" ref={shellRef} aria-label="Illustrative global climate signal">
      <div className="agri-globe-fallback" aria-hidden="true">
        <span className="globe-grid globe-grid-one" />
        <span className="globe-grid globe-grid-two" />
        <span className="globe-signal globe-signal-one" />
        <span className="globe-signal globe-signal-two" />
        <span className="globe-core" />
      </div>
      {canRender && shouldRender ? <Globe className="agri-globe" config={config} /> : null}
      <div className="globe-legend"><span /> Preparing field signal</div>
      <div className="globe-caption">Illustrative climate signal · not a field-location map</div>
    </div>
  );
}
