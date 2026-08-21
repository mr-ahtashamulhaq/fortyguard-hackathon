import { type ReactNode, useEffect, useRef } from "react";

export function ScrollExpand({ src, poster, children }: { src: string; poster: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null); const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current; const target = frame.current;
    if (!element || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frameId = 0;
    const update = () => { const rect = element.getBoundingClientRect(); const total = Math.max(1, element.offsetHeight - innerHeight); const progress = Math.max(0, Math.min(1, -rect.top / total)); const radius = 10 * (1 - progress); target.style.clipPath = `inset(0 round ${radius}px)`; target.style.setProperty("--expand-progress", String(progress)); frameId = 0; };
    const request = () => { if (!frameId) frameId = requestAnimationFrame(update); }; addEventListener("scroll", request, { passive: true }); addEventListener("resize", request); request(); return () => { cancelAnimationFrame(frameId); removeEventListener("scroll", request); removeEventListener("resize", request); };
  }, []);
  return <section className="scroll-expand" ref={root}><div className="scroll-expand-sticky"><div className="scroll-expand-frame" ref={frame}><video src={src} poster={poster} autoPlay muted loop playsInline /><div className="scroll-expand-scrim" /> <div className="scroll-expand-content">{children}</div></div><p className="scroll-expand-hint">Scroll to widen the field signal</p></div></section>;
}
