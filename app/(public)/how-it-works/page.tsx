import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — VIREZIA | Private Real Estate Intelligence",
  description:
    "Learn how VIREZIA operates: verified properties, bespoke buyer profiles, independent audits, and end-to-end acquisition support in emerging markets.",
};

/* ─── Hero ─────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="flex min-h-[70vh] items-center py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="How it works" />
          <h1 className="mt-6 font-serif text-[clamp(40px,5.5vw,72px)] font-light leading-[1.1] text-text-primary">
            A Different Way to Enter the Market
          </h1>
          <p className="mt-8 max-w-xl font-sans text-[17px] font-light leading-[1.75] text-text-secondary">
            VIREZIA does not aggregate listings or connect you with local agents.
            We operate as a private intelligence layer — sourcing, verifying,
            and matching opportunities to individual buyer profiles before
            anything is presented.
          </p>
          <p className="mt-4 max-w-xl font-sans text-[15px] font-light leading-[1.75] text-text-muted">
            Every step is deliberate. Every recommendation is earned.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── How We See the Market ────────────────────────────────── */

function MarketApproach() {
  return (
    <section className="border-t border-border bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Market intelligence" />
          <h2 className="mt-6 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-text-primary">
            How We See the Market
          </h2>
        </AnimatedSection>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <AnimatedSection>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
              We monitor pricing trends, absorption rates, and legal compliance
              across emerging markets in Mexico and Latin America. Our process
              combines ground-level intelligence with structured data review —
              tracking demand shifts, permit activity, and developer behavior
              over time.
            </p>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
              This is not a search engine. It is an ongoing audit of the markets
              we operate in — designed to surface what is real and filter out
              what is not.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="border-l-2 border-accent-gold/30 pl-8">
              <p className="font-serif text-[20px] font-light italic leading-[1.6] text-text-primary">
                We do not rely on a single source, tool, or partnership.
                Intelligence is layered, cross-referenced, and updated
                continuously.
              </p>
              <p className="mt-6 font-sans text-sm font-light text-text-muted">
                Markets monitored include Tulum, Riviera Maya, Oaxaca Coast,
                Mexico City, and select regions across Latin America.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── What Verified Means ──────────────────────────────────── */

function VerificationStandard() {
  const checks = [
    {
      title: "Title Verification",
      description:
        "Ownership history and title chain reviewed for irregularities, liens, and encumbrances.",
    },
    {
      title: "Legal Status Review",
      description:
        "Zoning compliance, ejido classification, fideicomiso status, and regulatory standing confirmed.",
    },
    {
      title: "Price Benchmarking",
      description:
        "Asking price compared against recent comparable transactions, area trends, and development stage.",
    },
    {
      title: "Permit Confirmation",
      description:
        "Construction permits, environmental licenses, and municipal approvals cross-checked with local records.",
    },
    {
      title: "Developer Track Record",
      description:
        "Prior project delivery, financial standing, and reputation audited through independent channels.",
    },
  ];

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="Verification standard" />
          <h2 className="mt-6 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-text-primary">
            What Verified Means
          </h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            When we say a property is verified, it means it has passed a
            structured review process before reaching any buyer. We do not use
            the word loosely. These are the criteria.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {checks.map((check, i) => (
            <AnimatedSection key={check.title} delay={i * 0.08}>
              <div className="border border-border bg-bg-card p-8 transition-colors duration-200 hover:border-accent-gold/30">
                <h3 className="font-serif text-[20px] font-light text-text-primary">
                  {check.title}
                </h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-text-secondary">
                  {check.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12">
          <p className="font-sans text-sm font-light text-text-muted">
            Not every property clears verification. That is the point.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Your Profile Drives Everything ───────────────────────── */

function BuyerProfile() {
  return (
    <section className="border-t border-border bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <div className="grid items-start gap-16 md:grid-cols-2">
          <AnimatedSection>
            <SectionLabel text="Bespoke property profile" />
            <h2 className="mt-6 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-text-primary">
              Your Profile Drives Everything
            </h2>
            <p className="mt-8 font-sans text-base font-light leading-relaxed text-text-secondary">
              Every buyer who enters VIREZIA receives a Bespoke Property
              Profile. It captures your goals, constraints, timeline, risk
              tolerance, and acquisition intent — and it becomes the lens
              through which every opportunity is evaluated.
            </p>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
              You do not browse. You do not scroll through inventory. What
              reaches you has already been curated, verified, and matched to
              your profile. If nothing meets your criteria, nothing is sent.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="border border-border bg-bg-card p-10">
              <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold">
                What the profile determines
              </span>
              <ul className="mt-8 space-y-5">
                {[
                  "Which markets are relevant to you",
                  "What property types align with your intent",
                  "The price range benchmarked to your budget",
                  "Which developers and projects meet your risk profile",
                  "When and how opportunities are delivered",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-sans text-[15px] font-light leading-relaxed text-text-secondary"
                  >
                    <span className="mt-1.5 block h-[6px] w-[6px] flex-shrink-0 bg-accent-gold/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── From First Contact to Close ──────────────────────────── */

function ProcessTimeline() {
  const steps = [
    {
      number: "01",
      title: "Apply for Access",
      text: "Submit your application through our private intake form. Every request is reviewed individually.",
    },
    {
      number: "02",
      title: "Profile Call with VIREZIA Team",
      text: "A structured conversation to understand your goals, constraints, and timeline. This builds your Bespoke Property Profile.",
    },
    {
      number: "03",
      title: "Receive Your VIREZIA Selections",
      text: "Verified opportunities matched to your profile are delivered directly. Each has passed our full verification standard.",
    },
    {
      number: "04",
      title: "Visit, Review, and Decide",
      text: "We coordinate site visits, provide comparative analysis, and give you the space to evaluate without pressure.",
    },
    {
      number: "05",
      title: "Close with Legal Coordination",
      text: "From contract review to notarial close — legal partners, escrow coordination, and full transparency on costs throughout.",
    },
  ];

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="The process" />
          <h2 className="mt-6 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-text-primary">
            From First Contact to Close
          </h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            Five steps. No surprises. Every stage is coordinated by the VIREZIA
            team, with complete visibility into what happens next.
          </p>
        </AnimatedSection>

        <div className="mt-14 space-y-0">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.08}>
              <div className="group grid border-t border-border py-10 md:grid-cols-[80px_1fr]">
                <span className="font-serif text-[36px] font-light leading-none text-accent-gold/20 transition-colors group-hover:text-accent-gold/40">
                  {step.number}
                </span>
                <div className="mt-4 md:mt-0">
                  <h3 className="font-serif text-[22px] font-light text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg font-sans text-sm font-light leading-relaxed text-text-secondary">
                    {step.text}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}

/* ─── Paid Audit Section ───────────────────────────────────── */

function PaidAudit() {
  const tiers = [
    {
      name: "Audit Basic",
      price: "$890",
      turnaround: "48–72 hours",
      features: [
        "Market analysis and pricing score",
        "Comparable transaction review",
        "Red flag identification",
        "Written report delivered digitally",
      ],
    },
    {
      name: "Audit Premium",
      price: "$1,850",
      turnaround: "5–7 business days",
      features: [
        "Everything in Audit Basic",
        "Physical property inspection",
        "Registro Publico title search",
        "Permit and zoning verification",
        "Developer background review",
      ],
    },
    {
      name: "Audit Full Protection",
      price: "$4,500",
      turnaround: "7–10 business days",
      features: [
        "Everything in Audit Premium",
        "Contract review by licensed counsel",
        "Escrow coordination and guidance",
        "Closing cost breakdown and timeline",
        "Dedicated point of contact through close",
      ],
    },
  ];

  return (
    <section className="border-t border-border bg-bg-secondary py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-2xl">
          <SectionLabel text="Independent verification" />
          <h2 className="mt-6 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.2] text-text-primary">
            You Found a Property.
            <br />
            Before You Send Any Money — Let VIREZIA Verify It.
          </h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            Whether you found a deal through a broker, a listing portal, or a
            direct referral — our audit services provide independent
            verification before you commit. No affiliation with the seller. No
            conflict of interest.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <div className="flex h-full flex-col border border-border bg-bg-card p-10 transition-colors duration-200 hover:border-accent-gold/30">
                <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold">
                  {tier.name}
                </span>
                <p className="mt-4 font-serif text-[36px] font-light text-text-primary">
                  {tier.price}
                </p>
                <p className="mt-1 font-sans text-[13px] text-text-muted">
                  {tier.turnaround}
                </p>
                <ul className="mt-8 flex-1 space-y-4">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 font-sans text-sm font-light leading-relaxed text-text-secondary"
                    >
                      <span className="mt-1.5 block h-[5px] w-[5px] flex-shrink-0 bg-accent-gold/40" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    href="/apply"
                    className="inline-block w-full border border-accent-gold/30 px-6 py-3 text-center font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold transition-colors duration-200 hover:bg-accent-gold hover:text-bg-primary"
                  >
                    Request Audit
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-10">
          <p className="font-sans text-sm font-light text-text-muted">
            All audit reports are confidential and delivered directly to the
            requesting party. VIREZIA holds no financial interest in the
            properties reviewed.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Final CTA ────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-xl">
          <SectionLabel text="Get started" />
          <h2 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light leading-[1.1] text-text-primary">
            Ready to Begin?
          </h2>
          <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
            Submit your application and tell us what you are looking for.
            Every request is reviewed individually. We respond within 48 hours.
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

export default function HowItWorksPage() {
  return (
    <>
      <Hero />
      <MarketApproach />
      <VerificationStandard />
      <BuyerProfile />
      <ProcessTimeline />
      <PaidAudit />
      <FinalCTA />
    </>
  );
}
