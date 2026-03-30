import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import HeroContent from "@/components/HeroAnimations";

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Hero image — low opacity, blended from right */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          className="object-cover object-right"
          style={{ opacity: 0.2 }}
          priority
        />
        {/* Gradient mask: solid black on left → transparent on right */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, #080808 0%, #080808 35%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.3) 100%)`,
          }}
        />
      </div>

      {/* Subtle gold radial accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 25% 60%, rgba(201,169,110,0.05) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 20%, rgba(201,169,110,0.03) 0%, transparent 45%)
          `,
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
        }}
      />

      <HeroContent />
    </section>
  );
}

/* ─── Problem Contrast ─────────────────────────────────────── */

function ProblemContrast() {
  return (
    <section className="border-t border-border-subtle bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Why this matters" />
        </AnimatedSection>

        <div className="mt-12 grid gap-20 md:grid-cols-2">
          {/* Left — The Market (boosted contrast) */}
          <AnimatedSection>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-text-muted">
              The market
            </span>
            <div className="mt-8 border-l-2 border-text-muted/30 pl-6 space-y-3">
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-secondary/80">Hundreds of listings.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-secondary/80">Inflated prices.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-secondary/80">No legal clarity.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-secondary/80">No independent verification.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-secondary/80">Brokers optimizing for commission,<br />not for your outcome.</p>
            </div>
          </AnimatedSection>

          {/* Right — VIREZIA */}
          <AnimatedSection delay={0.15}>
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold">
              VIREZIA
            </span>
            <div className="mt-8 border-l-2 border-accent-gold pl-6 space-y-3">
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-primary">Every deal audited before you see it.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-primary">Price benchmarked against market signals.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-primary">Legal status verified by local counsel.</p>
              <p className="font-serif text-[22px] font-light leading-[1.6] text-text-primary">Matched to your intent, not our inventory.</p>
              <p className="font-serif text-[22px] font-light italic leading-[1.6] text-accent-gold">You see less. You decide with more clarity.</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Visual Break — Aerial ─────────────────────────────────── */

function VisualBreak() {
  return (
    <AnimatedSection>
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <Image
          src="/images/tulum-aerial.webp"
          alt="Aerial view of coastal architecture in Mexico"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.65)]" />
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center">
            <p className="font-sans text-[13px] uppercase tracking-[0.15em] text-accent-gold">
              Every deal verified · Every client profiled · Every option matched
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

/* ─── How It Works — Pillars + Process merged ──────────────── */

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Build Your Profile",
      text: "Tell us your goals, budget, timeline, and what matters most. We build your buyer profile — the filter everything else runs through.",
    },
    {
      number: "02",
      title: "Receive Your Selection",
      text: "We surface the best available options matched to your profile. Each one cleared by our verification standard before it reaches you.",
    },
    {
      number: "03",
      title: "Acquire with Clarity",
      text: "From first review to notarial close. Legal coordination, partner network, full transparency on costs. Or audit a deal you found yourself — on demand.",
    },
  ];

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="How it works" />
          <h2 className="mt-6">
            We Don&apos;t Show You Everything.
            <br />
            We Show You What&apos;s Right for You.
          </h2>
        </AnimatedSection>

        {/* Three step cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="group border border-border bg-bg-card p-10 transition-colors duration-200 hover:border-accent-gold/30">
                <span className="font-serif text-[48px] font-light leading-none text-accent-gold/20">
                  {step.number}
                </span>
                <h3 className="mt-4 text-[24px]">{step.title}</h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-text-secondary">
                  {step.text}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-10 flex flex-col gap-4">
          <Link
            href="/how-it-works"
            className="font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold transition-colors hover:text-accent-gold-light"
          >
            Full process breakdown →
          </Link>
          <Link
            href="/how-it-works"
            className="font-sans text-[13px] text-text-muted underline underline-offset-4 decoration-text-muted/40 transition-colors hover:text-text-secondary hover:decoration-text-secondary/40"
          >
            Already found a property? Commission an independent verification →
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── For Whom ─────────────────────────────────────────────── */

function ForWhom() {
  const forList = [
    "Expats relocating to Mexico",
    "Foreign investors entering emerging markets",
    "Remote founders seeking a base of operations",
    "Individuals who value clarity over volume",
    "Buyers who don't want to navigate an unfamiliar market alone",
  ];

  const notForList = [
    "Browsing hundreds of listings",
    "Comparing options without intent to buy",
    "Those expecting an automated platform",
    "Mass-market property search",
  ];

  return (
    <section className="bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Who this is for" />
        </AnimatedSection>

        <div className="mt-14 grid gap-16 md:grid-cols-2">
          <AnimatedSection>
            <h3 className="text-2xl text-text-primary">VIREZIA is for:</h3>
            <ul className="mt-8 space-y-4">
              {forList.map((item) => (
                <li key={item} className="font-sans text-base font-light leading-relaxed text-text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-2xl text-text-muted">VIREZIA is not for:</h3>
            <ul className="mt-8 space-y-4">
              {notForList.map((item) => (
                <li key={item} className="font-sans text-base font-light leading-relaxed text-text-muted line-through decoration-text-muted/30">
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>

        {/* Access limited — boosted visual weight */}
        <AnimatedSection className="mt-14">
          <div className="border border-border bg-bg-card px-8 py-6 max-w-md">
            <p className="font-sans text-[15px] text-text-primary">
              Access is limited. Each application is reviewed individually.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          <p className="font-serif text-[18px] italic text-text-secondary">
            For investors seeking pre-market deal access before public release —
            VIREZIA Circle operates by invitation only.{" "}
            <Link href="/circle" className="text-accent-gold transition-colors hover:text-accent-gold-light">→</Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── How We Work (Trust) ──────────────────────────────────── */

function HowWeWork() {
  const stats = [
    {
      headline: "3 Focus Regions",
      sub: "Tulum · Riviera Maya · Oaxaca",
      detail: "Markets monitored daily for pricing, demand, and legal shifts. Expanding into select Latin American markets.",
    },
    {
      headline: "Independent Verification",
      sub: "Every deal cleared before delivery.",
      detail: "Legal title, physical inspection, Registro Publico records. Verification starts at $890.",
    },
    {
      headline: "End-to-End Guidance",
      sub: "First inquiry to notarial close.",
      detail: "Legal, notarial, and relocation partners coordinated by us. No handoff, no disappearing act.",
    },
  ];

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="How we work" />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.headline} delay={i * 0.1}>
              <div className="group border border-border bg-bg-card p-8 transition-colors duration-200 hover:border-accent-gold/30">
                <h3 className="text-xl font-light">{stat.headline}</h3>
                <p className="mt-3 font-sans text-sm text-accent-gold">{stat.sub}</p>
                <p className="mt-3 font-sans text-sm font-light text-text-secondary">{stat.detail}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Case study */}
        <AnimatedSection className="mt-16">
          <div className="max-w-2xl border border-border bg-bg-card p-10">
            <p className="font-serif text-[20px] font-light italic leading-[1.6] text-text-primary">
              &ldquo;A US-based founder with a $280k budget and a 90-day timeline
              received three verified options in Tulum within 5 days.
              Acquisition completed in 7 weeks.&rdquo;
            </p>
            <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.1em] text-text-muted">
              Anonymous · Q1 2026
            </p>
          </div>
        </AnimatedSection>

        {/* Process statement */}
        <AnimatedSection className="mt-12">
          <div className="max-w-2xl border-l-2 border-accent-gold/30 py-2 pl-8">
            <p className="font-serif text-[22px] font-light italic leading-[1.6] text-text-secondary">
              Every client engagement begins with a profile call.
              Every deal delivered has passed our verification standard.
              No exceptions.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Behind VIREZIA ───────────────────────────────────────── */

function BehindVirezia() {
  return (
    <section className="bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-center gap-16 md:grid-cols-[1fr_240px]">
          <AnimatedSection>
            <SectionLabel text="Who we are" />
            <p className="mt-8 font-serif text-[28px] font-light leading-[1.3] text-text-primary">
              Lucas Hubert
            </p>
            <p className="mt-1 font-sans text-[13px] text-text-muted">
              Founder, VIREZIA
            </p>
            <div className="mt-8 max-w-xl">
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                I built VIREZIA after years of watching foreign buyers navigate
                Mexico&apos;s real estate market without a reliable guide —
                overpaying, under-informed, and alone in the process.
              </p>
              <p className="mt-4 font-serif text-[20px] font-light italic text-text-primary">
                VIREZIA is the infrastructure I wish had existed.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="hidden md:block">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/lucas-hubert.jpg"
                alt="Lucas Hubert, Founder of VIREZIA"
                fill
                className="object-cover grayscale"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="py-[80px]"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 60%), #080808`,
      }}
    >
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-xl">
          <h2 className="text-[clamp(36px,5vw,56px)]">
            Private Access.
            <br />
            Reviewed Individually.
          </h2>
          <p className="mt-6 font-sans text-base font-light text-text-secondary">
            Submit your application and tell us what you are looking for. We
            review every request and respond within 48 hours.
          </p>
          <div className="mt-8">
            <Link
              href="/apply"
              className="inline-block bg-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity duration-200 hover:opacity-90"
            >
              Apply for Private Access
            </Link>
          </div>
          <p className="mt-4 font-sans text-sm text-text-muted">
            No commitment. No browsing. Just clarity.
          </p>
          <p className="mt-5 font-sans text-[12px] text-text-muted opacity-60 transition-opacity hover:opacity-100">
            Already a member?{" "}
            <Link href="/circle" className="text-text-secondary hover:text-accent-gold">→ VIREZIA Circle</Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemContrast />
      <VisualBreak />
      <HowItWorks />
      <ForWhom />
      <HowWeWork />
      <BehindVirezia />
      <FinalCTA />
    </>
  );
}
