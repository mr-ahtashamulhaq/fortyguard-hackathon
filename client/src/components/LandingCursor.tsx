import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { useEffect, useState } from "react";

export function LandingCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference) and (any-hover: hover) and (any-pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return (
    <SmoothCursor
      cursor={<span className="agri-cursor" aria-hidden="true" />}
      springConfig={{ damping: 32, stiffness: 430, mass: 0.62, restDelta: 0.001 }}
    />
  );
}
