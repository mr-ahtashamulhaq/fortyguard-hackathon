import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.,1.); }`;
const fragment = `precision highp float; uniform vec2 iResolution; uniform float iTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec2 vUv; float wave(vec2 p){return sin(p.x*1.2+iTime*.12)+sin(p.y*1.9-iTime*.09)+sin((p.x+p.y)*.7+iTime*.07);} void main(){vec2 uv=gl_FragCoord.xy/iResolution.xy; vec2 p=(uv-.5)*vec2(iResolution.x/iResolution.y,1.); float w=wave(p*3.); float ridge=smoothstep(-1.4,1.8,w+p.y*2.2); vec3 col=mix(uA,uB,uv.y); col=mix(col,uC,ridge*.64); float fade=smoothstep(.0,.72,uv.y); gl_FragColor=vec4(col,fade*.94);}`;
const colour = (hex: string) => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];

export function GradientWaves({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const renderer = new Renderer({ alpha: true, dpr: Math.min(devicePixelRatio, 1.5), antialias: false });
    const gl = renderer.gl; const canvas = gl.canvas; host.appendChild(canvas);
    const program = new Program(gl, { vertex, fragment, uniforms: { iTime: { value: 0 }, iResolution: { value: [1, 1] }, uA: { value: colour("#10221d") }, uB: { value: colour("#2e6b55") }, uC: { value: colour("#72bfe5") } } });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => { const r = host.getBoundingClientRect(); renderer.setSize(r.width, r.height); (program.uniforms.iResolution.value as number[])[0] = gl.drawingBufferWidth; (program.uniforms.iResolution.value as number[])[1] = gl.drawingBufferHeight; };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    let frame = 0; let visible = true; const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); io.observe(host);
    const render = (time: number) => { if (visible) { program.uniforms.iTime.value = time / 1000; renderer.render({ scene: mesh }); } frame = requestAnimationFrame(render); }; frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); io.disconnect(); canvas.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);
  return <div ref={ref} className={`gradient-waves ${className}`} aria-hidden="true" />;
}
