"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import Button from "@/components/Button";

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.06) 0%, rgba(8,8,8,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-content px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionLabel text="Private Real Estate Intelligence · Mexico" />
        </motion.div>

        <motion.h1
          className="mx-auto mt-8 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Fewer Options.
          <br />
          Better Ones. Yours.
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-[520px] text-base font-light leading-relaxed text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          We help expats and foreign investors buy property in Mexico with full
          confidence.
          <br />
          <br />
          Every opportunity we show you is curated from the full market, verified
          on-site, benchmarked against real data, and matched personally to your
          profile.
          <br />
          <br />
          No hidden fees. No noise. No guesswork.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Button href="/apply">Apply for Private Access</Button>
          <Link
            href="/how-it-works"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Learn how it works →
          </Link>
        </motion.div>
      </div>

      {/* Bottom line + note */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="mx-auto max-w-content">
          <div className="mb-4 h-px w-full bg-border" />
          <p className="text-center font-sans text-xs text-text-muted">
            Not a listing portal. Every option is selected for you specifically.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Problem Contrast ─────────────────────────────────────── */

function ProblemContrast() {
  return (
    <section className="bg-bg-secondary py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left — The Market */}
          <AnimatedSection>
            <SectionLabel text="The market" />
            <div className="mt-8 space-y-2 font-sans text-base font-light leading-relaxed text-text-secondary">
              <p>Hundreds of listings.</p>
              <p>Inflated prices.</p>
              <p>No legal clarity.</p>
              <p>No independent verification.</p>
              <p>
                Brokers optimizing for commission,
                <br />
                not for your outcome.
              </p>
            </div>
          </AnimatedSection>

          {/* Right — VIREZIA */}
          <AnimatedSection delay={0.15}>
            <SectionLabel text="VIREZIA" />
            <div className="mt-8 space-y-2 font-sans text-base font-light leading-relaxed text-text-primary">
              <p>Every deal audited before you see it.</p>
              <p>Price benchmarked against market signals.</p>
              <p>Legal status verified by local counsel.</p>
              <p>Matched to your intent, not our inventory.</p>
              <p>You see less. You decide with more clarity.</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── What is VIREZIA ──────────────────────────────────────── */

function WhatIsVirezia() {
  const pillars = [
    {
      number: "01",
      title: "Personal Profile",
      text: "Tell us your goals, budget, and priorities. We build your buyer profile and match opportunities to it — not the other way around.",
    },
    {
      number: "02",
      title: "Curated & Verified",
      text: "Every option is sourced from the full market, selected for quality, verified on-site by our due diligence partner, and benchmarked against current pricing data. Including off-market and pre-sale opportunities not yet publicly listed.",
    },
    {
      number: "03",
      title: "Guided to Close",
      text: "Full transparency from first contact to notarial close. No hidden fees. Legal support, partner network, and clear process at every step — or audit your own found deal on demand.",
    },
  ];

  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <SectionLabel text="What we are" />
          <h2 className="mt-8">
            We Don&apos;t Show You Everything.
            <br />
            We Show You What&apos;s Right for You.
          </h2>
          <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
            VIREZIA curates a small number of opportunities from the full Mexican
            real estate market — not one list for everyone, but a personal
            selection built around your profile.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            Every property we surface is verified on-site, benchmarked against
            real market data, and reviewed for legal clarity. No hidden fees. No
            noise. No guesswork.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            And if you&apos;ve already found something — you can commission an
            independent audit through our partner network.
          </p>
        </AnimatedSection>

        {/* Three pillars */}
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.number} delay={i * 0.1}>
              <div className="border-t border-border pt-8">
                <span className="font-sans text-xs tracking-label text-accent-gold">
                  {pillar.number}
                </span>
                <h3 className="mt-4 text-2xl">{pillar.title}</h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-text-secondary">
                  {pillar.text}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Define Your Direction",
      text: "Tell us your goals, budget, and timeline. We build your buyer profile.",
    },
    {
      step: "02",
      title: "Receive Verified Options",
      text: "We surface audited opportunities matched to your intent. Off-market, pre-sales, and selected listings — verified before delivery.",
    },
    {
      step: "03",
      title: "Acquire with Clarity",
      text: "We guide you from first review to final close. Legal support, notarial process, partner network — all coordinated.",
    },
  ];

  return (
    <section className="bg-bg-secondary py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="The process" />
        </AnimatedSection>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedSection key={step.step} delay={i * 0.1}>
              <span className="font-sans text-xs tracking-label text-accent-gold">
                Step {step.step}
              </span>
              <h3 className="mt-4 text-2xl">{step.title}</h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-text-secondary">
                {step.text}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-16">
          <Link
            href="/how-it-works"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Full process breakdown →
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
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Who this is for" />
        </AnimatedSection>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <AnimatedSection>
            <h3 className="text-2xl">VIREZIA is for:</h3>
            <ul className="mt-8 space-y-3">
              {forList.map((item) => (
                <li
                  key={item}
                  className="font-sans text-base font-light text-text-secondary"
                >
                  · {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-2xl">VIREZIA is not for:</h3>
            <ul className="mt-8 space-y-3">
              {notForList.map((item) => (
                <li
                  key={item}
                  className="font-sans text-base font-light text-text-muted"
                >
                  · {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-16">
          <p className="font-sans text-sm text-text-muted">
            Access is limited. Each application is reviewed individually.
          </p>
          <p className="mt-4 font-sans text-sm italic text-accent-gold/60">
            For investors seeking pre-market deal access before public release —
            VIREZIA Circle operates by invitation only.{" "}
            <Link
              href="/circle"
              className="text-accent-gold/80 transition-colors hover:text-accent-gold"
            >
              →
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Trust Signals ────────────────────────────────────────── */

function TrustSignals() {
  const stats = [
    {
      headline: "3 Focus Regions",
      sub: "Tulum · Riviera Maya · Oaxaca",
      detail:
        "Markets monitored daily for pricing, demand, and legal shifts.",
    },
    {
      headline: "Independent Verification Standard",
      sub: "Legal title · Physical on-site inspection · Registro Público records",
      detail:
        "Every deal audited by our due diligence partner before you see it.",
    },
    {
      headline: "Full Cycle Support",
      sub: "From first inquiry to acquisition close.",
      detail: "Including legal, notarial, and relocation partners.",
    },
  ];

  return (
    <section className="bg-bg-secondary py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Track record" />
        </AnimatedSection>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.headline} delay={i * 0.1}>
              <div className="rounded border border-border bg-bg-card p-8">
                <h3 className="text-xl font-light">{stat.headline}</h3>
                <p className="mt-3 font-sans text-sm text-accent-gold">
                  {stat.sub}
                </p>
                <p className="mt-3 font-sans text-sm font-light text-text-secondary">
                  {stat.detail}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Anonymous case note */}
        <AnimatedSection className="mt-12">
          <div className="rounded border border-border bg-bg-card p-8 md:mx-auto md:max-w-2xl">
            <p className="font-serif text-lg font-light italic leading-relaxed text-text-primary">
              &ldquo;A US-based founder with a $280k budget and a 90-day
              timeline received three verified options in Tulum within 5 days.
              Acquisition completed in 7 weeks.&rdquo;
            </p>
            <p className="mt-4 font-sans text-xs tracking-label text-text-muted">
              — Anonymous · Q1 2026
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6 text-center">
        <AnimatedSection>
          <h2>
            Private Access.
            <br />
            Reviewed Individually.
          </h2>
          <p className="mx-auto mt-8 max-w-md font-sans text-base font-light text-text-secondary">
            Submit your application and tell us what you are looking for. We
            review every request and respond within 48 hours.
          </p>
          <div className="mt-10">
            <Button href="/apply">Apply for Private Access</Button>
          </div>
          <p className="mt-4 font-sans text-sm text-text-muted">
            No commitment. No browsing. Just clarity.
          </p>
          <div className="mx-auto mt-8 max-w-xs border-t border-border-subtle pt-4">
            <p className="font-sans text-xs text-text-muted">
              Already a member?{" "}
              <Link
                href="/circle"
                className="text-text-secondary transition-colors hover:text-accent-gold"
              >
                → VIREZIA Circle
              </Link>
            </p>
          </div>
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
      <WhatIsVirezia />
      <HowItWorks />
      <ForWhom />
      <TrustSignals />
      <FinalCTA />
    </>
  );
}
