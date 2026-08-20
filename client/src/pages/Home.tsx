import { AgriGlobe } from "@/components/AgriGlobe";
import { LandingCursor } from "@/components/LandingCursor";
import { MotionFaq } from "@/components/MotionFaq";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Ripple } from "@/components/ui/ripple";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const videoUrl = "/manus-storage/agriguard-aerial-fields-final-web_95a93812.mp4";
const videoPoster = "/manus-storage/agriguard-aerial-fields-final-poster_7f9c2449.jpg";

const policySteps = [
  ["01", "Observe", "Hourly temperature readings stay attached to the field record."],
  ["02", "Apply", "The policy checks 34 °C, three continuous hours, and crop stage."],
  ["03", "Record", "The evidence and simulated result are saved for review."],
];

const faqItems = [
  {
    question: "Are these real insurance payouts?",
    answer: "No. Every amount in AgriGuard is a simulated payout for the hackathon demo. The project does not issue an insurance contract or transfer money.",
  },
  {
    question: "What happens when the temperature data is missing?",
    answer: "The field becomes Data unavailable. AgriGuard does not invent observations or create a simulated payout from missing or stale data.",
  },
  {
    question: "Does the AI agent decide the payout?",
    answer: "No. The deterministic heat policy engine applies the threshold, exposure duration, and crop-stage rules. The AI agent retrieves evidence and explains the result.",
  },
];

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-copy]",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, delay: 0.12, ease: "power3.out", stagger: 0.08 },
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
        gsap.fromTo(
          element,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, pageRef);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      context.revert();
    };
  }, []);

  return (
    <div className="landing-page" ref={pageRef}>
      <LandingCursor />
      <header className="landing-nav">
        <a className="wordmark" href="#top" aria-label="AgriGuard home">
          <span className="wordmark-mark" />
          <span>AgriGuard</span>
        </a>
        <div className="landing-nav-actions">
          <a className="nav-text-link" href="#policy">How it works</a>
          <ThemeToggle />
          <a className="nav-demo-button" href="/app">
            Open demo <ArrowUpRight size={15} strokeWidth={1.5} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow" data-hero-copy><span /> Agentic (API + Agentic) track</div>
            <h1 data-hero-copy>When heat crosses the line, <em>the evidence is already waiting.</em></h1>
            <p className="hero-intro" data-hero-copy>
              AgriGuard turns hourly wheat-field temperature readings into an evidence record, using a fixed policy rule and a controlled monitoring agent.
            </p>
            <div className="hero-actions" data-hero-copy>
              <a className="cta-primary" href="/app">Open the field demo <span><ArrowUpRight size={17} strokeWidth={1.5} /></span></a>
              <a className="cta-text" href="#policy">See the policy <ArrowDownRight size={17} strokeWidth={1.5} /></a>
            </div>
            <div className="hero-rule" data-hero-copy>
              <span className="rule-line" />
              <div><strong>34 °C</strong><small>temperature threshold</small></div>
              <div><strong>3 h</strong><small>continuous exposure</small></div>
              <div><strong>Wheat</strong><small>flowering or grain filling</small></div>
            </div>
          </div>
          <AgriGlobe />
        </section>

        <section className="proof-strip" data-reveal>
          <p>Not a black box. A readable chain of custody from reading to record.</p>
          <div className="proof-label"><ShieldCheck size={18} strokeWidth={1.35} /> Deterministic policy, controlled agent</div>
        </section>

        <section className="landing-section video-section" data-reveal>
          <div className="section-kicker">Field signal / 01</div>
          <div className="video-frame-shell">
            <video className="field-video" poster={videoPoster} muted loop playsInline preload="metadata" autoPlay aria-label="Aerial view of agricultural fields">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="video-overlay">
              <span>Temperatures change. The source stays visible.</span>
              <span>User-supplied demonstration footage</span>
            </div>
          </div>
          <div className="video-caption">
            <h2>Heat becomes evidence, not an unanswered claim.</h2>
            <p>The system stores the observations that qualify a heat event. The evidence sheet keeps the data source, policy version, calculation, and plain-English explanation together.</p>
          </div>
        </section>

        <section id="policy" className="landing-section policy-section">
          <div className="section-heading" data-reveal>
            <div className="section-kicker">Policy engine / 02</div>
            <h2>One policy. Three clear steps.</h2>
          </div>
          <div className="policy-steps">
            {policySteps.map(([number, title, copy]) => (
              <article className="policy-step" key={title} data-reveal>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="step-tail"><ArrowDownRight size={19} strokeWidth={1.35} /></span>
              </article>
            ))}
          </div>
          <div className="policy-signal" aria-hidden="true">
            <Ripple mainCircleSize={110} mainCircleOpacity={0.13} numCircles={4} />
            <span>34°</span>
            <small>fixed threshold</small>
          </div>
        </section>

        <section className="landing-section record-section" data-reveal>
          <div className="record-copy">
            <div className="section-kicker">Evidence record / 03</div>
            <h2>A simulated payout must be easy to challenge.</h2>
            <p>AgriGuard does not send money or issue a real insurance policy. It produces a structured, auditable simulation that a reviewer can inspect before it reaches the ledger.</p>
            <ul>
              <li><Check size={16} strokeWidth={1.55} /> Exact timestamps and qualifying observations</li>
              <li><Check size={16} strokeWidth={1.55} /> Rule version, exposure time, and heat score</li>
              <li><Check size={16} strokeWidth={1.55} /> AI explanation with a template fallback</li>
            </ul>
          </div>
          <div className="evidence-sheet">
            <div className="sheet-topline"><span>Evidence record</span><span>DEMO-042</span></div>
            <div className="sheet-title">North Field / heat event</div>
            <div className="sheet-grid">
              <div><small>Source</small><strong>Synthetic demo data</strong></div>
              <div><small>Exposure</small><strong>05 continuous hours</strong></div>
              <div><small>Heat score</small><strong>12.8 degree-hours</strong></div>
              <div><small>Decision</small><strong className="heat-text">50% simulated payout</strong></div>
            </div>
            <div className="sheet-note">The agent explains this record. It cannot change the policy result.</div>
          </div>
        </section>

        <section className="landing-close" data-reveal>
          <p className="section-kicker">Judge-ready demo</p>
          <h2>See a field move from safe to triggered in one clear flow.</h2>
          <a className="cta-primary cta-inverse" href="/app">Open AgriGuard <span><ArrowUpRight size={17} strokeWidth={1.5} /></span></a>
          <p className="close-disclaimer">Every payout shown in the demo is simulated. Synthetic data is visibly labelled.</p>
        </section>

        <section className="landing-section faq-section">
          <div className="faq-intro" data-reveal>
            <div className="section-kicker">Boundaries / 04</div>
            <h2>Clear about what the demo does and does not do.</h2>
          </div>
          <MotionFaq items={faqItems} />
        </section>
      </main>

      <footer className="landing-footer">
        <span>AgriGuard / FortyGuard Hackathon 2026</span>
        <span>Built for the Agentic (API + Agentic) track</span>
      </footer>
    </div>
  );
}
