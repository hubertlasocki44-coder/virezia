import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { MARKET_REGIONS, MONITORING_AREAS } from "@/lib/constants/market-data";

export const metadata: Metadata = {
  title: "Market Intelligence — VIREZIA",
  description:
    "Real-time monitoring of emerging real estate markets in Mexico and Latin America. Regional analysis, risk factors, and verified market data for informed buyers.",
  alternates: {
    canonical: "https://virezia.com/market",
  },
};

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="Market Intelligence" />
          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light leading-[1.15] text-text-primary">
            We Monitor the Markets
            <br />
            So You Don&apos;t Have To.
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-text-secondary">
            Emerging markets move fast. Pricing shifts, new developments
            launch, regulations change. We track the signals that matter
            across Mexico and Latin America — and filter them through our
            verification standard before anything reaches your profile.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Region Cards ─────────────────────────────────────────── */

function RegionCards() {
  return (
    <section className="bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Active regions" />
          <h2 className="mt-6 font-serif text-[clamp(28px,4vw,44px)] font-light text-text-primary">
            Where We Operate
          </h2>
          <p className="mt-4 max-w-xl font-sans text-base font-light text-text-secondary">
            Each region presents a distinct profile of opportunity and risk.
            We maintain deep local intelligence in every market we cover.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {MARKET_REGIONS.map((region, i) => (
            <AnimatedSection key={region.id} delay={i * 0.1}>
              <div className="group flex h-full flex-col border border-border bg-bg-card transition-colors duration-200 hover:border-accent-gold/30">
                {/* Region image */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={region.image}
                    alt={`${region.name}, ${region.state}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="font-serif text-[24px] font-light text-text-primary">
                      {region.name}
                    </h3>
                    <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold">
                      {region.state}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-sans text-sm font-light leading-relaxed text-text-secondary">
                    {region.description}
                  </p>

                  {/* Market metrics */}
                  <div className="mt-6 grid grid-cols-3 gap-3 border border-border-subtle bg-bg-primary/50 p-4">
                    <div>
                      <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-text-muted">
                        Price / m²
                      </span>
                      <span className="mt-1 block font-sans text-[14px] font-light text-text-primary">
                        {region.metrics.pricePerSqm}
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-text-muted">
                        STR Yield
                      </span>
                      <span className="mt-1 block font-sans text-[14px] font-light text-text-primary">
                        {region.metrics.avgStrYield}
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-text-muted">
                        Demand
                      </span>
                      <span className={`mt-1 block font-sans text-[14px] font-light ${
                        region.metrics.demandTrend === "rising"
                          ? "text-accent-gold"
                          : "text-text-primary"
                      }`}>
                        {region.metrics.demandTrend === "rising" ? "↑ Rising" : region.metrics.demandTrend === "stable" ? "→ Stable" : "↓ Cooling"}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-6">
                    <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold">
                      Highlights
                    </span>
                    <ul className="mt-3 space-y-2">
                      {region.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-sans text-[13px] font-light text-text-secondary"
                        >
                          <span className="mt-[6px] block h-[4px] w-[4px] shrink-0 bg-accent-gold/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Factors */}
                  <div className="mt-6">
                    <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-text-muted">
                      Risk factors
                    </span>
                    <ul className="mt-3 space-y-2">
                      {region.riskFactors.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-sans text-[13px] font-light text-text-muted"
                        >
                          <span className="mt-[6px] block h-[4px] w-[4px] shrink-0 bg-text-muted/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── What We Monitor ──────────────────────────────────────── */

function WhatWeMonitor() {
  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr]">
          <AnimatedSection>
            <SectionLabel text="Our process" />
            <h2 className="mt-6 font-serif text-[clamp(28px,4vw,44px)] font-light text-text-primary">
              What We Monitor
            </h2>
            <p className="mt-4 max-w-md font-sans text-base font-light text-text-secondary">
              Market intelligence is not a snapshot — it is a continuous
              process. We track the following across every active region,
              updated as conditions change.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <ul className="space-y-5 md:mt-12">
              {MONITORING_AREAS.map((area, i) => (
                <li
                  key={area}
                  className="flex items-start gap-4 border-b border-border pb-5 last:border-0"
                >
                  <span className="font-serif text-[20px] font-light leading-none text-accent-gold/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[15px] font-light text-text-primary">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Gated Data Note ──────────────────────────────────────── */

function GatedDataNote() {
  return (
    <section className="bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl border border-border bg-bg-card p-10 text-center">
            <SectionLabel text="Client access" />
            <p className="mt-6 font-serif text-[22px] font-light leading-[1.6] text-text-primary">
              Full market data, pricing analysis, and regional reports are
              available to verified VIREZIA clients.
            </p>
            <p className="mt-4 font-sans text-sm font-light text-text-secondary">
              Apply for private access to receive market intelligence matched
              to your buyer profile and regions of interest.
            </p>
            <div className="mt-8">
              <Link
                href="/apply"
                className="inline-block bg-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity duration-200 hover:opacity-90"
              >
                Apply for Private Access
              </Link>
            </div>
          </div>
        </AnimatedSection>
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
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-light text-text-primary">
            Intelligence, Not Inventory.
          </h2>
          <p className="mt-6 font-sans text-base font-light text-text-secondary">
            VIREZIA does not sell listings. We provide the research,
            verification, and market context that lets you acquire with
            clarity — in markets most buyers navigate blind.
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
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function MarketPage() {
  return (
    <>
      <Hero />
      <RegionCards />
      <WhatWeMonitor />
      <GatedDataNote />
      <FinalCTA />
    </>
  );
}
