import type { ChangeEvent } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";

export type LandingTuning = {
  heroScale: number;
  globeScale: number;
  heroTop: number;
  videoBrightness: number;
  videoOverlay: number;
  velocity: number;
  footerHeight: number;
  footerScale: number;
};

export const defaultLandingTuning: LandingTuning = {
  heroScale: 1,
  globeScale: 1,
  heroTop: 9.5,
  videoBrightness: 1,
  videoOverlay: 0.38,
  velocity: 3,
  footerHeight: 30,
  footerScale: 1,
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function Slider({ label, value, min, max, step, suffix = "", onChange }: SliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value));
  return <label className="visual-tuner-slider"><span>{label}<output>{value}{suffix}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={handleChange} /></label>;
}

export function VisualTuner({ values, onChange, onReset }: { values: LandingTuning; onChange: (patch: Partial<LandingTuning>) => void; onReset: () => void }) {
  const update = <K extends keyof LandingTuning>(key: K) => (value: LandingTuning[K]) => onChange({ [key]: value });
  return <aside className="visual-tuner" aria-label="Temporary visual tuning controls">
    <details open>
      <summary><SlidersHorizontal size={16} strokeWidth={1.7} /> Visual tuning <span>temporary</span></summary>
      <div className="visual-tuner-body">
        <p>Adjust the high-impact values, then tell me when you want these controls removed and your selected values locked into the design.</p>
        <div className="visual-tuner-grid">
          <Slider label="Hero scale" value={values.heroScale} min={.82} max={1.18} step={.01} suffix="×" onChange={update("heroScale")} />
          <Slider label="Globe scale" value={values.globeScale} min={.72} max={1.32} step={.01} suffix="×" onChange={update("globeScale")} />
          <Slider label="Hero top" value={values.heroTop} min={6} max={13} step={.25} suffix="rem" onChange={update("heroTop")} />
          <Slider label="Video brightness" value={values.videoBrightness} min={.65} max={1.3} step={.01} suffix="×" onChange={update("videoBrightness")} />
          <Slider label="Video overlay" value={values.videoOverlay} min={.08} max={.7} step={.01} onChange={update("videoOverlay")} />
          <Slider label="Idle velocity" value={values.velocity} min={0} max={8} step={.25} onChange={update("velocity")} />
          <Slider label="Footer height" value={values.footerHeight} min={22} max={44} step={1} suffix="rem" onChange={update("footerHeight")} />
          <Slider label="Footer type" value={values.footerScale} min={.72} max={1.25} step={.01} suffix="×" onChange={update("footerScale")} />
        </div>
        <button type="button" className="visual-tuner-reset" onClick={onReset}><RotateCcw size={14} /> Reset values</button>
      </div>
    </details>
    <button type="button" className="visual-tuner-close" aria-label="Close visual tuning controls" onClick={(event) => { const details = event.currentTarget.parentElement?.querySelector("details"); if (details) details.open = false; }}><X size={14} /></button>
  </aside>;
}
