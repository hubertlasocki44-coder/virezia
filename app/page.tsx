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
      {/* Warm organic gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(196,169,125,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,115,85,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Decorative line — zen accent */}
      <motion.div
        className="absolute left-1/2 top-[15%] h-[100px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent/20 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />

      <div className="relative z-10 mx-auto max-w-content px-6 py-32 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <SectionLabel text="Private Real Estate Intelligence · Mexico" />
        </motion.div>

        <motion.h1
          className="mx-auto mt-10 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Fewer Options.
          <br />
          Better Ones. Yours.
        </motion.h1>

        <motion.p
          className="mx-auto mt-10 max-w-[520px] text-[15px] font-light leading-[1.9] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
        >
          We help expats and foreign investors buy property in Mexico with full
          confidence.
        </motion.p>

        <motion.p
          className="mx-auto mt-4 max-w-[520px] text-[15px] font-light leading-[1.9] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15 }}
        >
          Every opportunity we show you is curated from the full market, verified
          on-site, benchmarked against real data, and matched personally to your
          profile.
        </motion.p>

        <motion.p
          className="mx-auto mt-4 max-w-[520px] text-[15px] font-light leading-[1.9] text-text-primary/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          No hidden fees. No noise. No guesswork.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button href="/apply">Apply for Private Access</Button>
          <Link
            href="/how-it-works"
            className="font-sans text-[13px] text-text-muted transition-colors duration-300 hover:text-text-primary"
          >
            Learn how it works →
          </Link>
        </motion.div>
      </div>

      {/* Bottom note */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <div className="mx-auto max-w-content lg:px-8">
          <div className="mb-5 h-px w-full bg-border" />
          <p className="text-center font-sans text-[11px] tracking-wide text-text-muted">
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
    <section className="bg-bg-secondary py-[140px]">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <div className="grid gap-20 md:grid-cols-2">
          {/* Left — The Market */}
          <AnimatedSection>
            <SectionLabel text="The market" />
            <div className="mt-10 space-y-3 font-sans text-[15px] font-light leading-[1.9] text-text-muted">
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
            <div className="mt-10 space-y-3 font-sans text-[15px] font-light leading-[1.9] text-text-primary">
              <p>Every deal audited before you see it.</p>
              <p>Price benchmarked against market signals.</p>
              <p>Legal status verified by local counsel.</p>
              <p>Matched to your intent, not our inventory.</p>
              <p className="text-accent">
                You see less. You decide with more clarity.
              </p>
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
    <section className="py-[140px]">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <SectionLabel text="What we are" />
          <h2 className="mt-10">
            We Don&apos;t Show You Everything.
            <br />
            We Show You What&apos;s Right for You.
          </h2>
          <p className="mt-10 font-sans text-[15px] font-light leading-[1.9] text-text-secondary">
            VIREZIA curates a small number of opportunities from the full Mexican
            real estate market — not one list for everyone, but a personal
            selection built around your profile.
          </p>
          <p className="mt-4 font-sans text-[15px] font-light leading-[1.9] text-text-secondary">
            Every property we surface is verified on-site, benchmarked against
            real market data, and reviewed for legal clarity. No hidden fees. No
            noise. No guesswork.
          </p>
          <p className="mt-4 font-sans text-[15px] font-light leading-[1.9] text-text-secondary">
            And if you&apos;ve already found something — you can commission an
            independent audit through our partner network.
          </p>
        </AnimatedSection>

        {/* Three pillars */}
        <div className="mt-24 grid gap-px bg-border md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.number} delay={i * 0.1}>
              <div className="bg-bg-primary p-10 md:p-12">
                <span className="font-sans text-[11px] tracking-[0.18em] text-accent">
                  {pillar.number}
                </span>
                <h3 className="mt-5 text-[24px]">{pillar.title}</h3>
                <p className="mt-5 font-sans text-[14px] font-light leading-[1.9] text-text-secondary">
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
    <section className="bg-bg-secondary py-[140px]">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <AnimatedSection>
          <SectionLabel text="The process" />
        </AnimatedSection>

        <div className="mt-20 grid gap-16 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedSection key={step.step} delay={i * 0.1}>
              <div className="relative">
                {/* Step number — large, faded */}
                <span className="font-serif text-[72px] font-light leading-none text-border">
                  {step.step}
                </span>
                <h3 className="mt-2 text-[24px]">{step.title}</h3>
                <p className="mt-4 font-sans text-[14px] font-light leading-[1.9] text-text-secondary">
                  {step.text}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-20">
          <Link
            href="/how-it-works"
            className="font-sans text-[13px] text-accent transition-colors duration-300 hover:text-text-primary"
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
    <section className="py-[140px]">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <AnimatedSection>
          <SectionLabel text="Who this is for" />
        </AnimatedSection>

        <div className="mt-16 grid gap-20 md:grid-cols-2">
          <AnimatedSection>
            <h3 className="text-[24px]">VIREZIA is for:</h3>
            <ul className="mt-8 space-y-4">
              {forList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-[15px] font-light text-text-secondary"
                >
                  <span className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-[24px]">VIREZIA is not for:</h3>
            <ul className="mt-8 space-y-4">
              {notForList.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-[15px] font-light text-text-muted"
                >
                  <span className="mt-2 block h-1 w-1 flex-shrink-0 rounded-full bg-border" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-20">
          <p className="font-sans text-[13px] text-text-muted">
            Access is limited. Each application is reviewed individually.
          </p>
          <p className="mt-5 font-sans text-[13px] italic text-accent/60">
            For investors seeking pre-market deal access before public release —
            VIREZIA Circle operates by invitation only.{" "}
            <Link
              href="/circle"
              className="text-accent/80 transition-colors hover:text-accent"
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
      detail: "Markets monitored daily for pricing, demand, and legal shifts.",
    },
    {
      headline: "Independent Verification Standard",
      sub: "Legal title · On-site inspection · Registro Público records",
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
    <section className="bg-bg-dark py-[140px] text-[#F4F1EB]">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <AnimatedSection>
          <span className="inline-block font-sans text-[11px] font-normal uppercase tracking-[0.18em] text-accent-warm">
            Track record
          </span>
        </AnimatedSection>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.headline} delay={i * 0.1}>
              <div className="border border-[#2A2925] bg-[#222220] p-10">
                <h3 className="text-[20px] font-light text-[#F4F1EB]">
                  {stat.headline}
                </h3>
                <p className="mt-4 font-sans text-[13px] text-accent-warm">
                  {stat.sub}
                </p>
                <p className="mt-4 font-sans text-[13px] font-light leading-[1.8] text-[#9A9590]">
                  {stat.detail}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Anonymous case note */}
        <AnimatedSection className="mt-12">
          <div className="border-l-2 border-accent-warm/30 py-2 pl-8 md:mx-auto md:max-w-2xl">
            <p className="font-serif text-[20px] font-light italic leading-[1.6] text-[#E8E4DC]">
              &ldquo;A US-based founder with a $280k budget and a 90-day
              timeline received three verified options in Tulum within 5 days.
              Acquisition completed in 7 weeks.&rdquo;
            </p>
            <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.18em] text-[#5C5850]">
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
    <section className="py-[160px]">
      <div className="mx-auto max-w-content px-6 text-center lg:px-8">
        <AnimatedSection>
          {/* Decorative zen line */}
          <div className="mx-auto mb-16 h-16 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

          <h2>
            Private Access.
            <br />
            Reviewed Individually.
          </h2>
          <p className="mx-auto mt-8 max-w-md font-sans text-[15px] font-light leading-[1.9] text-text-secondary">
            Submit your application and tell us what you are looking for. We
            review every request and respond within 48 hours.
          </p>
          <div className="mt-12">
            <Button href="/apply">Apply for Private Access</Button>
          </div>
          <p className="mt-5 font-sans text-[13px] text-text-muted">
            No commitment. No browsing. Just clarity.
          </p>
          <div className="mx-auto mt-12 max-w-xs">
            <p className="font-sans text-[11px] text-text-muted">
              Already a member?{" "}
              <Link
                href="/circle"
                className="text-accent transition-colors hover:text-text-primary"
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
