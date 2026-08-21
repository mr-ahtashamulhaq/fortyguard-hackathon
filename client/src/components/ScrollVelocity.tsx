import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

function VelocityRow({ children, baseVelocity }: { children: string; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 900], [0, 3], { clamp: false });
  const directionFactor = useRef(1);
  const reduceMotion = useReducedMotion();
  const x = useTransform(baseX, value => `${wrap(-48, 0, value)}%`);
  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    if (velocityFactor.get() > 0) directionFactor.current = 1;
    const move = directionFactor.current * baseVelocity * delta / 1000 * (1 + Math.abs(velocityFactor.get()));
    baseX.set(baseX.get() + move);
  });
  return <div className="velocity-row"><motion.div className="velocity-track" style={{ x }}><span>{children}&nbsp;</span><span>{children}&nbsp;</span><span>{children}&nbsp;</span><span>{children}&nbsp;</span></motion.div></div>;
}

export function ScrollVelocity({ rows }: { rows: string[] }) {
  return <div className="velocity-stack" aria-label={rows.join(" ")}>{rows.map((row, index) => <VelocityRow key={row} baseVelocity={index % 2 ? -12 : 12}>{row}</VelocityRow>)}</div>;
}
