import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";

export function FallingText({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null); const target = useRef<HTMLDivElement>(null); const canvas = useRef<HTMLDivElement>(null); const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started || !root.current || !target.current || !canvas.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = root.current; const rect = host.getBoundingClientRect(); const engine = Matter.Engine.create(); engine.world.gravity.y = .7;
    const render = Matter.Render.create({ element: canvas.current, engine, options: { width: rect.width, height: rect.height, wireframes: false, background: "transparent" } });
    const boundaries = [Matter.Bodies.rectangle(rect.width / 2, rect.height + 25, rect.width, 50, { isStatic: true }), Matter.Bodies.rectangle(-25, rect.height / 2, 50, rect.height, { isStatic: true }), Matter.Bodies.rectangle(rect.width + 25, rect.height / 2, 50, rect.height, { isStatic: true })];
    const words = Array.from(target.current.querySelectorAll<HTMLElement>("span")).map((node, index, all) => { const box = node.getBoundingClientRect(); const width = box.width; const height = box.height; const x = Math.max(10, ((index + .5) * rect.width) / all.length - width / 2); const y = 18 + (index % 2) * Math.min(52, rect.height * .12); const body = Matter.Bodies.rectangle(x + width / 2, y + height / 2, width, height, { restitution: .5 }); return { node, body, width, height }; });
    words.forEach(({ node }) => { node.style.position = "absolute"; node.style.left = "0"; node.style.top = "0"; });
    Matter.World.add(engine.world, [...boundaries, ...words.map(word => word.body)]); const runner = Matter.Runner.create(); Matter.Runner.run(runner, engine); Matter.Render.run(render);
    let requestId = 0; const update = () => { words.forEach(({ node, body, width, height }) => node.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`); requestId = requestAnimationFrame(update); }; requestId = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(requestId); Matter.Render.stop(render); Matter.Runner.stop(runner); Matter.World.clear(engine.world, false); Matter.Engine.clear(engine); render.canvas.remove(); };
  }, [started]);
  return <div ref={root} className="falling-text" onPointerDown={() => setStarted(true)}><div ref={target}>{text.split(" ").map((word, index) => <span key={`${word}-${index}`}>{word}&nbsp;</span>)}</div><div ref={canvas} /></div>;
}
