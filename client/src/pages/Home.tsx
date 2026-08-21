import { AgriGlobe } from "@/components/AgriGlobe";
import { AuroraBars } from "@/components/AuroraBars";
import { FallingText } from "@/components/FallingText";
import { GradientWaves } from "@/components/GradientWaves";
import { LandingDock } from "@/components/LandingDock";
import { MotionFaq } from "@/components/MotionFaq";
import { ScrollExpand } from "@/components/ScrollExpand";
import { ScrollVelocity } from "@/components/ScrollVelocity";
import { defaultLandingTuning, type LandingTuning, VisualTuner } from "@/components/VisualTuner";
import { ArrowDownRight, ArrowUpRight, CircleDotDashed, FileCheck2, Orbit, ShieldCheck, ThermometerSun } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

const videoUrl = "/manus-storage/agriguard-aerial-fields-final-web_95a93812.mp4";
const videoPoster = "/manus-storage/agriguard-aerial-fields-final-poster_ce730a0b.jpg";

const policySteps = [
  { number: "01", title: "Observe", icon: ThermometerSun, copy: "Hourly temperature readings are normalized and attached to the field record." },
  { number: "02", title: "Apply", icon: Orbit, copy: "The server checks 34 °C, continuous duration, and crop stage with no model discretion." },
  { number: "03", title: "Record", icon: FileCheck2, copy: "The evidence and simulated result are written to a readable review trail." },
];

const faqItems = [
  { question: "Are these real insurance payouts?", answer: "No. Every amount in AgriGuard is a simulated payout for the hackathon demo. The project does not issue an insurance contract or transfer money." },
  { question: "What happens when the temperature data is missing?", answer: "The field becomes Data unavailable. AgriGuard does not invent observations or create a simulated payout from missing or stale data." },
  { question: "Does the AI agent decide the payout?", answer: "No. The deterministic heat policy engine applies the threshold, exposure duration, and crop-stage rules. The AI agent retrieves evidence and explains the result." },
  { question: "How does AgriGuard avoid duplicate payouts?", answer: "Every qualifying event receives a stable idempotency key. Re-running the same North Field scenario returns the existing evidence and simulated payout instead of creating a second ledger row." },
  { question: "Can FortyGuard data replace the demo readings?", answer: "Yes. The temperature adapter is designed to swap sources. Until the FortyGuard key is available, the deployed demonstration uses clearly labelled synthetic hourly observations." },
];

export default function Home() {
  const [tuning, setTuning] = useState<LandingTuning>(() => {
    try { return { ...defaultLandingTuning, ...JSON.parse(localStorage.getItem("agriguard-landing-tuning") ?? "{}") }; }
    catch { return defaultLandingTuning; }
  });
  useEffect(() => { localStorage.setItem("agriguard-landing-tuning", JSON.stringify(tuning)); }, [tuning]);
  const landingStyle = {
    "--tune-edge-inset": `${tuning.edgeInset}rem`,
    "--tune-dock-scale": tuning.dockScale,
    "--tune-dock-offset": `${tuning.dockOffset}rem`,
    "--tune-hero-scale": tuning.heroScale,
    "--tune-globe-scale": tuning.globeScale,
    "--tune-hero-top": `${tuning.heroTop}rem`,
    "--tune-hero-side": `${tuning.heroSide}rem`,
    "--tune-hero-type": tuning.heroType,
    "--tune-proof-padding": `${tuning.proofPad}rem`,
    "--tune-proof-type": tuning.proofType,
    "--tune-velocity-padding": `${tuning.velocityPad}rem`,
    "--tune-velocity-type": tuning.velocityType,
    "--tune-video-brightness": tuning.videoBrightness,
    "--tune-video-overlay": tuning.videoOverlay,
    "--tune-signal-padding": `${tuning.signalPad}rem`,
    "--tune-signal-side": `${tuning.signalSide}rem`,
    "--tune-signal-type": tuning.signalType,
    "--tune-orbit-scale": tuning.orbitScale,
    "--tune-video-height": `${tuning.videoHeight}dvh`,
    "--tune-video-copy-scale": tuning.videoCopyScale,
    "--tune-video-copy-side": `${tuning.videoCopySide}rem`,
    "--tune-policy-padding": `${tuning.policyPad}rem`,
    "--tune-policy-type": tuning.policyType,
    "--tune-policy-card-scale": tuning.policyCardScale,
    "--tune-evidence-padding": `${tuning.evidencePad}rem`,
    "--tune-evidence-type": tuning.evidenceType,
    "--tune-evidence-side": `${tuning.evidenceSide}rem`,
    "--tune-evidence-sheet-scale": tuning.evidenceSheetScale,
    "--tune-judge-height": `${tuning.judgeHeight}dvh`,
    "--tune-judge-scale": tuning.judgeScale,
    "--tune-judge-side": `${tuning.judgeSide}rem`,
    "--tune-faq-padding": `${tuning.faqPad}rem`,
    "--tune-faq-type": tuning.faqType,
    "--tune-faq-width": `${tuning.faqWidth}%`,
    "--tune-footer-height": `${tuning.footerHeight}rem`,
    "--tune-footer-scale": tuning.footerScale,
    "--tune-footer-inset": `${tuning.footerInset}rem`,
  } as CSSProperties;
  return (
    <div className="landing-page landing-rebuild" id="top" style={landingStyle}>
      <LandingDock />
      <main>
        <section className="hero-constellation">
          <GradientWaves className="hero-waves" />
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow"><span /> Agentic heat cover / demo</div>
            <h1>When heat crosses the line,<em>the evidence is already waiting.</em></h1>
            <p className="hero-intro">AgriGuard turns hourly wheat-field temperature readings into a deterministic, inspectable heat-event record.</p>
            <div className="hero-actions">
              <a className="cta-primary" href="/app">Open the live demo <span><ArrowUpRight size={17} strokeWidth={1.5} /></span></a>
              <a className="cta-text" href="#signal">Follow the signal <ArrowDownRight size={17} strokeWidth={1.5} /></a>
            </div>
          </div>
          <AgriGlobe />
          <div className="hero-rule hero-rule-rebuild">
            <div><strong>34 °C</strong><small>fixed threshold</small></div>
            <div><strong>03 h</strong><small>continuous exposure</small></div>
            <div><strong>Wheat</strong><small>flowering / grain fill</small></div>
            <div><strong>1 record</strong><small>evidence before ledger</small></div>
          </div>
        </section>

        <section className="proof-strip proof-strip-rebuild">
          <p>Not a black box. A readable chain of custody from field reading to simulated record.</p>
          <div className="proof-label"><ShieldCheck size={18} strokeWidth={1.35} /> Deterministic policy · controlled agent · reviewable result</div>
        </section>

        <section className="velocity-section" aria-label="AgriGuard product principles">
          <ScrollVelocity idleVelocity={tuning.velocity} rows={["FIELD SIGNAL · POLICY PROOF · EVIDENCE FIRST", "NO BLACK BOX · NO SILENT PAYOUT · NO GUESSWORK"]} />
        </section>

        <section id="signal" className="signal-intro">
          <div className="signal-intro-copy">
            <span className="section-kicker">Field signal / 01</span>
            <h2>A heat event should feel physical. <em>Its decision trail should feel inevitable.</em></h2>
            <p>Start with the field, not a form. The stage below widens from a single landscape into the traceable event that AgriGuard can inspect.</p>
          </div>
          <div className="signal-orbit" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <ScrollExpand src={videoUrl} fallback={videoPoster}>
          <div className="expand-overlay-copy">
            <span className="section-kicker">Synthetic heat-wave scenario</span>
            <h2>Five hours above the threshold.<br />One record to challenge.</h2>
            <p>The demonstration data stays visibly labelled, even when the experience gets immersive.</p>
          </div>
        </ScrollExpand>

        <section id="policy" className="policy-cinema">
          <AuroraBars />
          <div className="policy-cinema-inner">
            <div className="policy-heading">
              <span className="section-kicker">Policy engine / 02</span>
              <h2>It is not an estimate.<br /><em>It is a fixed path.</em></h2>
              <p>The policy engine is deterministic. The agent can retrieve, record, and explain, but never change the decision.</p>
            </div>
            <div className="policy-steps policy-steps-rebuild">
              {policySteps.map(step => {
                const Icon = step.icon;
                return <article className="policy-step" key={step.title}>
                  <div className="policy-step-top"><span className="step-number">{step.number}</span><Icon size={22} strokeWidth={1.35} /></div>
                  <h3>{step.title}</h3><p>{step.copy}</p><span className="step-tail"><ArrowDownRight size={20} strokeWidth={1.35} /></span>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="evidence" className="evidence-moment">
          <div className="evidence-halo" aria-hidden="true" />
          <div className="evidence-stamp"><CircleDotDashed size={19} /> policy result stored</div>
          <div className="evidence-copy">
            <span className="section-kicker">Evidence record / 03</span>
            <h2>A simulated payout must be <em>easy to dispute.</em></h2>
            <p>AgriGuard keeps its sources, policy version, qualifying readings, heat score, and agent explanation together. A reviewer never has to reconstruct a conclusion from a dashboard.</p>
            <a className="cta-text" href="/app/evidence/demo-042">Inspect DEMO-042 <ArrowUpRight size={17} /></a>
          </div>
          <div className="evidence-sheet evidence-sheet-rebuild">
            <div className="sheet-topline"><span>Evidence record</span><span>DEMO-042</span></div>
            <div className="sheet-title">North Field / heat event</div>
            <div className="sheet-grid"><div><small>Source</small><strong>Synthetic demo data</strong></div><div><small>Exposure</small><strong>05 continuous hours</strong></div><div><small>Heat score</small><strong>11.8 degree-hours</strong></div><div><small>Decision</small><strong className="heat-text">50% simulated payout</strong></div></div>
            <div className="sheet-note">The agent explains this record. It cannot change the policy result.</div>
          </div>
        </section>

        <section className="judge-band">
          <div className="judge-band-inner"><span className="section-kicker">Judge-ready demo</span><h2>Watch a field move from safe to triggered in one clear flow.</h2><a className="cta-primary cta-inverse" href="/app">Run the scenario <span><ArrowUpRight size={17} /></span></a></div>
        </section>

        <section className="faq-section faq-section-rebuild">
          <div className="faq-intro"><span className="section-kicker">Boundaries / 04</span><h2>Clear about what the demo does and does not do.</h2></div>
          <MotionFaq items={faqItems} gap={12} />
        </section>
      </main>
      <footer className="landing-footer landing-footer-rebuild">
        <div className="footer-meta"><span>AgriGuard / FortyGuard Hackathon 2026</span><span>Agentic (API + Agentic) track</span><span>Synthetic demo data · simulated payouts</span></div>
        <div className="footer-falling-field"><span className="section-kicker">Make the signal accountable</span><FallingText text="Trace every reading. Challenge every result." /></div>
      </footer>
      <VisualTuner values={tuning} onChange={(patch) => setTuning(current => ({ ...current, ...patch }))} onReset={() => setTuning(defaultLandingTuning)} />
    </div>
  );
}
