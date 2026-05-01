import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import HeroContent from "@/components/HeroAnimations";

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
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

/* ─── Currently Featured ──────────────────────────────────── */

function CurrentlyFeatured() {
  return (
    <section id="featured" className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Currently Featured" />
        </AnimatedSection>

        {/* Featured 1 — Las Orcas (full-width hero card) */}
        <AnimatedSection className="mt-14">
          <Link href="/las-orcas" className="group block">
            <div className="relative overflow-hidden border border-border bg-bg-card transition-colors duration-300 hover:border-accent-gold/30">
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/hero-aerial.webp"
                  alt="Las Orcas — Robert Couturier residences"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
              </div>
              <div className="p-8 md:p-10">
                <h3 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
                  Las Orcas
                </h3>
                <p className="mt-2 font-sans text-sm text-accent-gold">
                  A coastal retreat by Robert Couturier
                </p>
                <p className="mt-1 font-sans text-[12px] uppercase tracking-[0.1em] text-text-muted">
                  Pacific Coast &middot; Mexico
                </p>
                <p className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-text-secondary">
                  Seven beachfront residences designed by the architect behind Cuixmala &mdash; his return to Mexico&apos;s Pacific Coast after four decades. Pre-construction. Pre-titled lots.
                </p>
                <p className="mt-6 font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold group-hover:text-accent-gold-light transition-colors">
                  View &rarr;
                </p>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── The Approach ─────────────────────────────────────────── */

function TheApproach() {
  return (
    <section className="bg-bg-secondary py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <SectionLabel text="The Approach" />
          <h2 className="mt-8">
            We don&apos;t list properties.
            <br />
            We feature them.
          </h2>
          <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
            Every property on VIREZIA is selected personally &mdash;
            for its architecture, its design, its location, or its story.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            We work with a small number of homes at a time,
            and with the people who own them, to tell each property
            the way it deserves to be told.
          </p>
          <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
            If something is exceptional, we feature it.
            If it isn&apos;t, we don&apos;t.
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
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Who this is for" />
        </AnimatedSection>

        <div className="mt-14 grid gap-16 md:grid-cols-2">
          <AnimatedSection>
            <h3 className="text-2xl text-text-primary">VIREZIA is for</h3>
            <div className="mt-8 space-y-4">
              <p className="font-sans text-base font-light text-text-secondary">Buyers who value character over volume.</p>
              <p className="font-sans text-base font-light text-text-secondary">Investors with a discerning eye.</p>
              <p className="font-sans text-base font-light text-text-secondary">Owners of exceptional properties.</p>
              <p className="font-sans text-base font-light text-text-secondary">People who prefer to be introduced.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h3 className="text-2xl text-text-muted">VIREZIA is not for</h3>
            <div className="mt-8 space-y-4">
              <p className="font-sans text-base font-light text-text-muted">Browsing.</p>
              <p className="font-sans text-base font-light text-text-muted">Mass-market property search.</p>
              <p className="font-sans text-base font-light text-text-muted">Volume listings.</p>
              <p className="font-sans text-base font-light text-text-muted">Anyone expecting a portal.</p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-14">
          <p className="font-sans text-sm text-text-muted">
            Access is limited. Each application is reviewed individually.
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
            If your property is exceptional,
            <br />
            we&apos;d like to hear about it.
          </h3>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            VIREZIA features a limited number of properties each year.
            Owners and developers with architecturally distinctive,
            design-led, or story-rich properties may submit for review.
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
      className="py-[120px]"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 60%), #080808`,
      }}
    >
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-xl">
          <h2 className="text-[clamp(36px,5vw,56px)]">
            By invitation.
            <br />
            By application.
            <br />
            By referral.
          </h2>
          <p className="mt-6 font-sans text-base font-light text-text-secondary">
            Submit your profile and tell us what you are looking for.
            We respond personally within 48 hours.
          </p>
          <div className="mt-8">
            <Link
              href="/apply"
              className="inline-block border border-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-bg-primary"
            >
              Apply for Private Access
            </Link>
          </div>
          <p className="mt-4 font-sans text-[12px] text-text-muted">
            Each application is reviewed individually.
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
      <CurrentlyFeatured />
      <TheApproach />
      <ForWhom />
      <ForOwners />
      <FinalCTA />
    </>
  );
}
