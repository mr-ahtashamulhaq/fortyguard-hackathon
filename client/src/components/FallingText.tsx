import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";

export function FallingText({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null); const target = useRef<HTMLDivElement>(null); const canvas = useRef<HTMLDivElement>(null); const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started || !root.current || !target.current || !canvas.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = root.current; const rect = host.getBoundingClientRect(); const engine = Matter.Engine.create(); engine.world.gravity.y = .7;
    const render = Matter.Render.create({ element: canvas.current, engine, options: { width: rect.width, height: rect.height, wireframes: false, background: "transparent" } });
    const boundaries = [Matter.Bodies.rectangle(rect.width / 2, rect.height + 25, rect.width, 50, { isStatic: true }), Matter.Bodies.rectangle(-25, rect.height / 2, 50, rect.height, { isStatic: true }), Matter.Bodies.rectangle(rect.width + 25, rect.height / 2, 50, rect.height, { isStatic: true })];
    const words = Array.from(target.current.querySelectorAll<HTMLElement>("span")).map(node => { const box = node.getBoundingClientRect(); const x = box.left - rect.left; const y = box.top - rect.top; const body = Matter.Bodies.rectangle(x + box.width / 2, y + box.height / 2, box.width, box.height, { restitution: .5 }); node.style.position = "absolute"; node.style.left = `${x}px`; node.style.top = `${y}px`; return { node, body, x, y, width: box.width, height: box.height }; });
    Matter.World.add(engine.world, [...boundaries, ...words.map(word => word.body)]); const runner = Matter.Runner.create(); Matter.Runner.run(runner, engine); Matter.Render.run(render);
    let requestId = 0; const update = () => { words.forEach(({ node, body, x, y, width, height }) => node.style.transform = `translate(${body.position.x - (x + width / 2)}px, ${body.position.y - (y + height / 2)}px) rotate(${body.angle}rad)`); requestId = requestAnimationFrame(update); }; requestId = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(requestId); Matter.Render.stop(render); Matter.Runner.stop(runner); Matter.World.clear(engine.world, false); Matter.Engine.clear(engine); render.canvas.remove(); };
  }, [started]);
  return <div ref={root} className="falling-text" onPointerDown={() => setStarted(true)}><div ref={target}>{text.split(" ").map((word, index) => <span key={`${word}-${index}`}>{word}&nbsp;</span>)}</div><div ref={canvas} /></div>;
}
