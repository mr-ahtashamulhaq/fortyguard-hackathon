import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const heightFor = (index: number, total: number, time: number) => {
  const arch = Math.sin(index / (total - 1) * Math.PI);
  return .2 + (.18 + arch * .7 + Math.sin(time * 1.1 + index) * .1) * .72;
};

export function AuroraBars() {
  const [heights, setHeights] = useState(() => Array.from({ length: 24 }, (_, index) => heightFor(index, 24, 0)));
  const time = useRef(0); const reduceMotion = useReducedMotion();
  useAnimationFrame((_, delta) => { if (!reduceMotion) { time.current += delta / 1000; setHeights(Array.from({ length: 24 }, (_, index) => heightFor(index, 24, time.current))); } });
  return <div className="aurora-bars" aria-hidden="true">{heights.map((height, index) => <motion.span key={index} animate={{ height: `${height * 100}%` }} transition={{ type: "tween", duration: .18 }} />)}</div>;
}
