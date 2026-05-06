import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import HeroContent from "@/components/HeroAnimations";

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          className="object-cover object-right"
          style={{ opacity: 0.2 }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, #080808 0%, #080808 35%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.3) 100%)`,
          }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 25% 60%, rgba(201,169,110,0.05) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 20%, rgba(201,169,110,0.03) 0%, transparent 45%)
          `,
        }}
      />
      <HeroContent />
    </section>
  );
}

/* ─── What VIREZIA Is ─────────────────────────────────────── */

function WhatVireziaIs() {
  return (
    <section className="border-t border-border-subtle py-[140px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="What VIREZIA Is" />
          <h2 className="mt-8">
            A private real estate network.
          </h2>
          <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
            Properties aren&apos;t published here. They&apos;re inside VIREZIA Circle, visible only to members.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            We pick real estate from across the market based on architecture, location, and investment logic, and present each property to the right people inside the Circle.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            Investors apply to create a profile and access opportunities.
            Developers and asset owners apply to submit properties.
            We read every application.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── The Approach ─────────────────────────────────────────── */

function TheApproach() {
  return (
    <section className="bg-bg-secondary py-[140px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <SectionLabel text="The Approach" />
          <h2 className="mt-8">
            Every property here was chosen for a reason.
          </h2>
          <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
            Usually it&apos;s the architecture, the location, or the story behind it. Sometimes it&apos;s an investment thesis that makes sense, or off-market access you won&apos;t find elsewhere.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            We work with the owners and developers behind each property to present it the way it deserves to be presented. Some properties we feature are off the public market. Others are publicly available, but worth a closer look than the noise around them allows.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            We only feature what we&apos;d personally spend time on.
          </p>
          <Link
            href="/approach"
            className="mt-8 inline-block font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold transition-colors hover:text-accent-gold-light"
          >
            Read the full approach &rarr;
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── For Whom ─────────────────────────────────────────────── */

function ForWhom() {
  return (
    <section className="py-[140px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Who this is for" />
        </AnimatedSection>

        <div className="mt-14 grid gap-16 md:grid-cols-2">
          <AnimatedSection>
            <h3 className="text-2xl text-text-primary">VIREZIA is for</h3>
            <div className="mt-8 space-y-4">
              <p className="font-sans text-base font-light text-text-secondary">Serious buyers.</p>
              <p className="font-sans text-base font-light text-text-secondary">Investors who know what they&apos;re looking at.</p>
              <p className="font-sans text-base font-light text-text-secondary">Property owners who want their work shown properly.</p>
              <p className="font-sans text-base font-light text-text-secondary">People who&apos;d rather be introduced than browse.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-2xl text-text-muted">Not for</h3>
            <div className="mt-8">
              <p className="font-sans text-base font-light text-text-muted">
                If you want to scroll through hundreds of listings, this isn&apos;t the place.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-14">
          <p className="font-sans text-sm text-text-muted">
            Spots are limited.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── For Owners ──────────────────────────────────────────── */

function ForOwners() {
  return (
    <section className="bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-xl">
          <SectionLabel text="For Owners & Developers" />
          <h3 className="mt-8 text-[clamp(24px,3vw,32px)]">
            If you&apos;ve built something worth showing properly, tell us about it.
          </h3>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            We feature a small number of properties each year. If it has real architecture, a strong location, or a story behind it, we want to hear from you.
          </p>
          <Link
            href="/for-owners"
            className="mt-8 inline-block font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold transition-colors hover:text-accent-gold-light"
          >
            Submit a property &rarr;
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="py-[140px]"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 60%), #080808`,
      }}
    >
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-xl">
          <h2 className="text-[clamp(36px,5vw,56px)]">
            Create your VIREZIA profile.
          </h2>
          <p className="mt-6 font-sans text-base font-light text-text-secondary">
            Tell us what you&apos;re looking for, or what you&apos;re offering. We get back to you within 48 hours.
          </p>
          <div className="mt-8">
            <Link
              href="/apply"
              className="inline-block border border-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-bg-primary"
            >
              Apply for Access
            </Link>
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
      <WhatVireziaIs />
      <TheApproach />
      <ForWhom />
      <ForOwners />
      <FinalCTA />
    </>
  );
}
