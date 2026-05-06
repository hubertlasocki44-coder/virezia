import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Approach",
  description:
    "How VIREZIA works. Properties selected for architecture, location, and story. Access by application.",
  alternates: {
    canonical: "https://virezia.com/approach",
  },
};

export default function ApproachPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[60vh] items-center py-[120px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <SectionLabel text="The Approach" />
            <h1 className="mt-6 font-serif text-[clamp(40px,5.5vw,72px)] font-light leading-[1.1]">
              The Approach
            </h1>
            <p className="mt-8 max-w-xl font-sans text-[17px] font-light leading-[1.75] text-text-secondary">
              Most good properties are badly presented. Portals treat a $2M architect-designed house the same as a spec build. We started VIREZIA because that felt wrong.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What gets in */}
      <section className="border-t border-border bg-bg-secondary py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              What gets in
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Every property on VIREZIA was chosen for a reason. Usually it&apos;s the architecture, the location, or the story behind it. Sometimes it&apos;s an investment thesis that makes sense. Sometimes it&apos;s off-market access you can&apos;t get elsewhere.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
              We keep the number small enough to know every property well.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* For buyers */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              For buyers and investors
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Start with an application. We get back to you within 48 hours.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
              If there&apos;s a fit between what you&apos;re looking for and what we&apos;re working with, we start a conversation. From there it depends on the property and on you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* For owners */}
      <section className="border-t border-border bg-bg-secondary py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              For property owners
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Owners come to us when they want their property shown to the right people, presented the way it deserves. We review submissions every quarter.
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

      {/* What we don't do */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              What this isn&apos;t
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              If you want to scroll through hundreds of listings, this isn&apos;t the place. We don&apos;t do volume, we don&apos;t do mass-market, and we don&apos;t feature anything we wouldn&apos;t personally recommend. That&apos;s the filter.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection>
            <Link
              href="/apply"
              className="inline-block border border-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-bg-primary"
            >
              Apply for Access
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
