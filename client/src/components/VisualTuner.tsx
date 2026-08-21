import type { ChangeEvent, ReactNode } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";

export type LandingTuning = {
  edgeInset: number;
  dockScale: number;
  dockOffset: number;
  heroScale: number;
  globeScale: number;
  heroTop: number;
  heroSide: number;
  heroType: number;
  proofPad: number;
  proofType: number;
  velocityPad: number;
  velocityType: number;
  signalPad: number;
  signalSide: number;
  signalType: number;
  orbitScale: number;
  videoHeight: number;
  videoBrightness: number;
  videoOverlay: number;
  videoCopyScale: number;
  videoCopySide: number;
  velocity: number;
  policyPad: number;
  policyType: number;
  policyCardScale: number;
  evidencePad: number;
  evidenceType: number;
  evidenceSide: number;
  evidenceSheetScale: number;
  judgeHeight: number;
  judgeScale: number;
  judgeSide: number;
  faqPad: number;
  faqType: number;
  faqWidth: number;
  footerHeight: number;
  footerScale: number;
  footerInset: number;
};

export const defaultLandingTuning: LandingTuning = {
  edgeInset: 0, dockScale: 1, dockOffset: 0, heroScale: 1, globeScale: 1, heroTop: 9.5, heroSide: 0, heroType: 1,
  proofPad: 0, proofType: 1, velocityPad: 0, velocityType: 1, signalPad: 10, signalSide: 0, signalType: 1, orbitScale: 1,
  videoHeight: 100, videoBrightness: 1, videoOverlay: .38, videoCopyScale: 1, videoCopySide: 0, velocity: 3,
  policyPad: 10, policyType: 1, policyCardScale: 1, evidencePad: 12, evidenceType: 1, evidenceSide: 0, evidenceSheetScale: 1,
  judgeHeight: 74, judgeScale: 1, judgeSide: 0, faqPad: 11, faqType: 1, faqWidth: 100, footerHeight: 30, footerScale: 1, footerInset: 0,
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
        <p>Each landing section has independent spacing, type, scale, side-position, or size controls. Existing saved values remain the baseline until you ask to lock them.</p>
        <TunerGroup title="Global, dock and hero">
          <Slider label="Global side inset" value={values.edgeInset} min={-2} max={4} step={.1} suffix="rem" onChange={update("edgeInset")} />
          <Slider label="Dock scale" value={values.dockScale} min={.8} max={1.2} step={.01} suffix="×" onChange={update("dockScale")} />
          <Slider label="Dock lift" value={values.dockOffset} min={-2} max={2} step={.1} suffix="rem" onChange={update("dockOffset")} />
          <Slider label="Hero scale" value={values.heroScale} min={.82} max={1.18} step={.01} suffix="×" onChange={update("heroScale")} />
          <Slider label="Globe scale" value={values.globeScale} min={.72} max={1.32} step={.01} suffix="×" onChange={update("globeScale")} />
          <Slider label="Hero top" value={values.heroTop} min={6} max={13} step={.25} suffix="rem" onChange={update("heroTop")} />
          <Slider label="Hero side" value={values.heroSide} min={-6} max={6} step={.1} suffix="rem" onChange={update("heroSide")} />
          <Slider label="Hero type" value={values.heroType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("heroType")} />
        </TunerGroup>
        <TunerGroup title="Proof and velocity">
          <Slider label="Proof spacing" value={values.proofPad} min={-3} max={5} step={.1} suffix="rem" onChange={update("proofPad")} />
          <Slider label="Proof type" value={values.proofType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("proofType")} />
          <Slider label="Velocity spacing" value={values.velocityPad} min={-3} max={5} step={.1} suffix="rem" onChange={update("velocityPad")} />
          <Slider label="Velocity type" value={values.velocityType} min={.7} max={1.3} step={.01} suffix="×" onChange={update("velocityType")} />
          <Slider label="Idle velocity" value={values.velocity} min={0} max={8} step={.25} onChange={update("velocity")} />
        </TunerGroup>
        <TunerGroup title="Signal introduction">
          <Slider label="Signal spacing" value={values.signalPad} min={5} max={15} step={.25} suffix="rem" onChange={update("signalPad")} />
          <Slider label="Signal side" value={values.signalSide} min={-6} max={6} step={.1} suffix="rem" onChange={update("signalSide")} />
          <Slider label="Signal type" value={values.signalType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("signalType")} />
          <Slider label="Orbit scale" value={values.orbitScale} min={.65} max={1.35} step={.01} suffix="×" onChange={update("orbitScale")} />
        </TunerGroup>
        <TunerGroup title="Field video">
          <Slider label="Stage height" value={values.videoHeight} min={65} max={120} step={1} suffix="vh" onChange={update("videoHeight")} />
          <Slider label="Video brightness" value={values.videoBrightness} min={.65} max={1.3} step={.01} suffix="×" onChange={update("videoBrightness")} />
          <Slider label="Video overlay" value={values.videoOverlay} min={.08} max={.7} step={.01} onChange={update("videoOverlay")} />
          <Slider label="Video copy scale" value={values.videoCopyScale} min={.7} max={1.3} step={.01} suffix="×" onChange={update("videoCopyScale")} />
          <Slider label="Video copy side" value={values.videoCopySide} min={-7} max={7} step={.1} suffix="rem" onChange={update("videoCopySide")} />
        </TunerGroup>
        <TunerGroup title="Policy engine">
          <Slider label="Policy spacing" value={values.policyPad} min={5} max={15} step={.25} suffix="rem" onChange={update("policyPad")} />
          <Slider label="Policy type" value={values.policyType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("policyType")} />
          <Slider label="Policy cards" value={values.policyCardScale} min={.75} max={1.2} step={.01} suffix="×" onChange={update("policyCardScale")} />
        </TunerGroup>
        <TunerGroup title="Evidence record">
          <Slider label="Evidence spacing" value={values.evidencePad} min={6} max={17} step={.25} suffix="rem" onChange={update("evidencePad")} />
          <Slider label="Evidence type" value={values.evidenceType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("evidenceType")} />
          <Slider label="Evidence copy side" value={values.evidenceSide} min={-6} max={6} step={.1} suffix="rem" onChange={update("evidenceSide")} />
          <Slider label="Record sheet" value={values.evidenceSheetScale} min={.75} max={1.2} step={.01} suffix="×" onChange={update("evidenceSheetScale")} />
        </TunerGroup>
        <TunerGroup title="Judge demo">
          <Slider label="Judge height" value={values.judgeHeight} min={50} max={100} step={1} suffix="vh" onChange={update("judgeHeight")} />
          <Slider label="Judge type" value={values.judgeScale} min={.75} max={1.2} step={.01} suffix="×" onChange={update("judgeScale")} />
          <Slider label="Judge side" value={values.judgeSide} min={-6} max={6} step={.1} suffix="rem" onChange={update("judgeSide")} />
        </TunerGroup>
        <TunerGroup title="FAQ">
          <Slider label="FAQ spacing" value={values.faqPad} min={5} max={15} step={.25} suffix="rem" onChange={update("faqPad")} />
          <Slider label="FAQ type" value={values.faqType} min={.75} max={1.25} step={.01} suffix="×" onChange={update("faqType")} />
          <Slider label="FAQ width" value={values.faqWidth} min={65} max={115} step={1} suffix="%" onChange={update("faqWidth")} />
        </TunerGroup>
        <TunerGroup title="Footer">
          <Slider label="Footer height" value={values.footerHeight} min={22} max={44} step={1} suffix="rem" onChange={update("footerHeight")} />
          <Slider label="Footer type" value={values.footerScale} min={.72} max={1.25} step={.01} suffix="×" onChange={update("footerScale")} />
          <Slider label="Footer side inset" value={values.footerInset} min={-4} max={8} step={.1} suffix="rem" onChange={update("footerInset")} />
        </TunerGroup>
        <button type="button" className="visual-tuner-reset" onClick={onReset}><RotateCcw size={14} /> Reset values</button>
      </div>
    </details>
    <button type="button" className="visual-tuner-close" aria-label="Close visual tuning controls" onClick={(event) => { const details = event.currentTarget.parentElement?.querySelector("details"); if (details) details.open = false; }}><X size={14} /></button>
  </aside>;
}
