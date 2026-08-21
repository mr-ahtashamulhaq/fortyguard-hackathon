import type { ChangeEvent, ReactNode } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";

export type LandingTuning = {
  dockScale: number;
  heroScale: number;
  globeScale: number;
  heroTop: number;
  signalPad: number;
  videoBrightness: number;
  videoOverlay: number;
  velocity: number;
  policyPad: number;
  evidencePad: number;
  judgeHeight: number;
  judgeScale: number;
  faqPad: number;
  footerHeight: number;
  footerScale: number;
};

export const defaultLandingTuning: LandingTuning = {
  dockScale: 1, heroScale: 1, globeScale: 1, heroTop: 9.5, signalPad: 10,
  videoBrightness: 1, videoOverlay: .38, velocity: 3, policyPad: 10,
  evidencePad: 12, judgeHeight: 74, judgeScale: 1, faqPad: 11, footerHeight: 30, footerScale: 1,
};

type SliderProps = { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (value: number) => void };
function Slider({ label, value, min, max, step, suffix = "", onChange }: SliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value));
  return <label className="visual-tuner-slider"><span>{label}<output>{value}{suffix}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={handleChange} /></label>;
}
function TunerGroup({ title, children }: { title: string; children: ReactNode }) { return <section className="visual-tuner-group"><h3>{title}</h3><div className="visual-tuner-grid">{children}</div></section>; }

export function VisualTuner({ values, onChange, onReset }: { values: LandingTuning; onChange: (patch: Partial<LandingTuning>) => void; onReset: () => void }) {
  const update = <K extends keyof LandingTuning>(key: K) => (value: LandingTuning[K]) => onChange({ [key]: value });
  return <aside className="visual-tuner" aria-label="Temporary visual tuning controls">
    <details>
      <summary><SlidersHorizontal size={16} strokeWidth={1.7} /> Visual tuning <span>temporary</span></summary>
      <div className="visual-tuner-body">
        <p>Every major landing section has an adjustable layout, scale, spacing, or motion control. Values save in this browser until you ask to lock them.</p>
        <TunerGroup title="Dock and hero">
          <Slider label="Dock scale" value={values.dockScale} min={.8} max={1.2} step={.01} suffix="×" onChange={update("dockScale")} />
          <Slider label="Hero scale" value={values.heroScale} min={.82} max={1.18} step={.01} suffix="×" onChange={update("heroScale")} />
          <Slider label="Globe scale" value={values.globeScale} min={.72} max={1.32} step={.01} suffix="×" onChange={update("globeScale")} />
          <Slider label="Hero top" value={values.heroTop} min={6} max={13} step={.25} suffix="rem" onChange={update("heroTop")} />
        </TunerGroup>
        <TunerGroup title="Signal and field video">
          <Slider label="Signal spacing" value={values.signalPad} min={5} max={15} step={.25} suffix="rem" onChange={update("signalPad")} />
          <Slider label="Video brightness" value={values.videoBrightness} min={.65} max={1.3} step={.01} suffix="×" onChange={update("videoBrightness")} />
          <Slider label="Video overlay" value={values.videoOverlay} min={.08} max={.7} step={.01} onChange={update("videoOverlay")} />
          <Slider label="Idle velocity" value={values.velocity} min={0} max={8} step={.25} onChange={update("velocity")} />
        </TunerGroup>
        <TunerGroup title="Policy and evidence">
          <Slider label="Policy spacing" value={values.policyPad} min={5} max={15} step={.25} suffix="rem" onChange={update("policyPad")} />
          <Slider label="Evidence spacing" value={values.evidencePad} min={6} max={17} step={.25} suffix="rem" onChange={update("evidencePad")} />
        </TunerGroup>
        <TunerGroup title="Judge, FAQ and footer">
          <Slider label="Judge height" value={values.judgeHeight} min={50} max={100} step={1} suffix="vh" onChange={update("judgeHeight")} />
          <Slider label="Judge type" value={values.judgeScale} min={.75} max={1.2} step={.01} suffix="×" onChange={update("judgeScale")} />
          <Slider label="FAQ spacing" value={values.faqPad} min={5} max={15} step={.25} suffix="rem" onChange={update("faqPad")} />
          <Slider label="Footer height" value={values.footerHeight} min={22} max={44} step={1} suffix="rem" onChange={update("footerHeight")} />
          <Slider label="Footer type" value={values.footerScale} min={.72} max={1.25} step={.01} suffix="×" onChange={update("footerScale")} />
        </TunerGroup>
        <button type="button" className="visual-tuner-reset" onClick={onReset}><RotateCcw size={14} /> Reset values</button>
      </div>
    </details>
    <button type="button" className="visual-tuner-close" aria-label="Close visual tuning controls" onClick={(event) => { const details = event.currentTarget.parentElement?.querySelector("details"); if (details) details.open = false; }}><X size={14} /></button>
  </aside>;
}
