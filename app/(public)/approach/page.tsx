import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Approach",
  description:
    "How VIREZIA selects, features, and introduces exceptional properties. By invitation, by application, by referral.",
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
              VIREZIA exists because the way exceptional properties
              are usually presented does them a disservice.
            </p>
            <p className="mt-4 max-w-xl font-sans text-[17px] font-light leading-[1.75] text-text-secondary">
              Most homes are listed. A small number deserve to be introduced.
            </p>
            <p className="mt-4 max-w-xl font-sans text-[17px] font-light leading-[1.75] text-text-secondary">
              These are the ones we work with.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What we feature */}
      <section className="border-t border-border bg-bg-secondary py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              What we feature
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Every property featured on VIREZIA is selected personally
              for one or more of the following:
            </p>
            <div className="mt-8 space-y-4">
              <p className="font-sans text-base font-light text-text-secondary">&mdash; Architectural or design distinction</p>
              <p className="font-sans text-base font-light text-text-secondary">&mdash; Location with character</p>
              <p className="font-sans text-base font-light text-text-secondary">&mdash; A story worth telling</p>
              <p className="font-sans text-base font-light text-text-secondary">&mdash; A defined investment thesis</p>
              <p className="font-sans text-base font-light text-text-secondary">&mdash; Off-market access not available elsewhere</p>
            </div>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              We feature a defined number of properties at any time.
              Not the largest. Not the cheapest. The right ones for the right buyer.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* If you are looking to acquire */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              If you are looking to acquire
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              You apply. We respond personally within 48 hours.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
              If there is alignment between what you are looking for
              and what we are featuring or sourcing,
              we begin a private conversation.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
              What follows is shaped by the property and by you &mdash;
              not by a fixed process diagram.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* If you own a property */}
      <section className="border-t border-border bg-bg-secondary py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              If you own a property worth featuring
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Owners and developers approach VIREZIA when they want
              their property told properly &mdash; and placed in front of
              buyers who will value it.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-text-secondary">
              Featured selection is reviewed quarterly.
              Inclusion is by invitation following submission.
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

      {/* What we do not do */}
      <section className="py-[100px]">
        <div className="mx-auto max-w-content px-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-light">
              What we do not do
            </h2>
            <div className="mt-8 space-y-4">
              <p className="font-sans text-base font-light text-text-secondary">We do not list.</p>
              <p className="font-sans text-base font-light text-text-secondary">We do not browse.</p>
              <p className="font-sans text-base font-light text-text-secondary">We do not work with mass-market product.</p>
              <p className="font-sans text-base font-light text-text-secondary">We do not feature what we would not personally consider exceptional.</p>
            </div>
            <p className="mt-8 font-sans text-base font-light text-text-muted">
              Selectivity is the entire point.
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
              Apply for Private Access
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
