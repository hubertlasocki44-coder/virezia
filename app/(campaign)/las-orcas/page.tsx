"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import FormInput from "@/components/forms/FormInput";
import FormRadioGroup from "@/components/forms/FormRadioGroup";
import { submitLasOrcasForm } from "@/lib/actions/campaign-submit";

const INVESTMENT_OPTIONS = [
  { value: "under_500k", label: "Under $500K" },
  { value: "500k_1m", label: "$500K \u2013 $1M" },
  { value: "1m_2m", label: "$1M \u2013 $2M" },
  { value: "2m_plus", label: "$2M+" },
];

const TIMELINE_OPTIONS = [
  { value: "ready_now", label: "Ready now" },
  { value: "3_6_months", label: "3\u20136 months" },
  { value: "exploring", label: "Exploring" },
];

const INTENT_OPTIONS = [
  { value: "personal_residence", label: "Personal residence" },
  { value: "mixed", label: "Mixed" },
  { value: "investment_yield", label: "Investment yield" },
];

/* -- YouTube video teaser (19s clip: 3:29-3:48) -------------------- */
function VideoTeaser() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black overflow-hidden">
      {showVideo ? (
        <iframe
          src="https://www.youtube.com/embed/scE6aC4XyyY?start=209&end=228&autoplay=1&rel=0&modestbranding=1&color=white"
          title="Robert Couturier on Las Orcas"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setShowVideo(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
        >
          <Image
            src={`https://img.youtube.com/vi/scE6aC4XyyY/maxresdefault.jpg`}
            alt="Robert Couturier on Las Orcas"
            fill
            className="object-cover opacity-70 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white/90 group-hover:scale-105 transition-all">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Main page component                                               */
/* ================================================================== */
export default function LasOrcasPage() {
  return (
    <Suspense>
      <LasOrcasContent />
    </Suspense>
  );
}

function LasOrcasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [investmentRange, setInvestmentRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [intent, setIntent] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Capture UTMs once
  const utmRef = useRef({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
  });

  useEffect(() => {
    utmRef.current = {
      utmSource: searchParams.get("utm_source") || "",
      utmMedium: searchParams.get("utm_medium") || "",
      utmCampaign: searchParams.get("utm_campaign") || "",
      utmContent: searchParams.get("utm_content") || "",
      utmTerm: searchParams.get("utm_term") || "",
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!investmentRange || !timeline || !intent || !fullName || !email || !phone) {
      setError("Please complete all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await submitLasOrcasForm({
        fullName,
        email,
        phone,
        investmentRange,
        timeline,
        intent,
        ...utmRef.current,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.matched) {
        router.push("/las-orcas/confirmed");
      } else {
        router.push("/las-orcas/welcome");
      }
    } catch {
      setError("Something went wrong. Please try again or email hello@virezia.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-end pb-20 md:pb-28">
        <div className="absolute inset-0">
          <Image
            src="/images/las-orcas/hero-aerial.webp"
            alt="Las Orcas — beachfront villas, Puerto Escondido"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-bg-primary/20 to-bg-primary" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-content px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">
              A VIREZIA Selection
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-8">
              Robert Couturier &middot; Oaxacan Coast &middot; 2026
            </p>
            <h1 className="font-serif text-[clamp(36px,7vw,80px)] font-light leading-[1.05] max-w-4xl">
              Forty years after Cuixmala,
              <br className="hidden md:block" />
              he returns to the Pacific.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE CUIXMALA YEARS                                        */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <AnimatedSection>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/couturier-architecture.jpg"
                  alt="Robert Couturier — architect"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="md:pt-16">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-8">
                1987
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                In 1987, Sir James Goldsmith entrusted a thirty-two-year-old French architect with the single greatest private commission of modern times: a 20,000-acre estate on Mexico&apos;s Pacific Coast.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                The result was Cuixmala &mdash; later named by Architectural Digest among the seven most beautiful resorts of the Pacific. The commission lasted a decade. It launched Robert Couturier&apos;s career.
              </p>
              <p className="font-serif text-xl text-accent-gold mt-10">
                Las Orcas is his return.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. IN HIS WORDS (video)                                      */}
      {/* ============================================================ */}
      <section className="bg-bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <AnimatedSection>
            <VideoTeaser />
            <div className="max-w-2xl mx-auto mt-10 text-center">
              <p className="font-sans text-sm font-light leading-relaxed text-text-secondary">
                Robert Couturier on Las Orcas, Oaxaca, and his return to Mexico&apos;s Pacific Coast.
              </p>
              <p className="font-sans text-sm font-light leading-relaxed text-text-muted mt-3">
                The full conversation is shared with members of the VIREZIA Circle.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ON LUXURY (manifest quote)                                */}
      {/* ============================================================ */}
      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <blockquote className="font-serif text-[clamp(24px,4vw,48px)] font-light leading-[1.3]">
              &ldquo;Luxury there is the ability to live simply, comfortably, with excellent food, with great services, with access to most pleasant things in life &mdash; and to have sort of a slow, peaceful life.&rdquo;
            </blockquote>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mt-10">
              &mdash; Robert Couturier
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. VIREZIA SELECTIONS (trust block)                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-8">
              VIREZIA Selections
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
              Las Orcas is part of VIREZIA Selections &mdash; a small set of curated opportunities reviewed for architectural significance, regulatory integrity, and the seriousness of the process behind them.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. THE WORK                                                  */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <AnimatedSection>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/villa-front.webp"
                  alt="Las Orcas villa — designed by Robert Couturier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="md:pt-20">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-8">
                Las Orcas
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                Six villas. Five remaining. Beachfront, Puerto Escondido, Oaxaca. Pre-construction. Pre-titled lots. Designed by Robert Couturier.
              </p>
              <p className="font-sans text-lg font-normal text-text-primary mt-8">
                From $561,000.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. COUTURIER ON LAS ORCAS (quotes)                           */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <AnimatedSection className="space-y-20 md:space-y-28">
            <blockquote className="text-center">
              <p className="font-serif text-[clamp(22px,3.5vw,40px)] font-light leading-[1.3]">
                &ldquo;What will distinguish Las Orcas is the care with which it was designed and built. Luxury but also simplicity.&rdquo;
              </p>
            </blockquote>

            <blockquote className="text-center">
              <p className="font-serif text-[clamp(22px,3.5vw,40px)] font-light leading-[1.3]">
                &ldquo;Materials that will live in the sea air and age gracefully &mdash; as we all should.&rdquo;
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mt-10">
                &mdash; Robert Couturier
              </p>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. QUALIFIER (form)                                          */}
      {/* ============================================================ */}
      <section id="join" className="bg-bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-xl px-6 md:px-10">
          <AnimatedSection>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-6 text-center">
              Join the VIREZIA Circle
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary text-center mb-12">
              Las Orcas is offered through the VIREZIA Circle. Three questions to join, and the full conversation with Robert Couturier is shared.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <FormRadioGroup
                label="Investment range"
                name="investment_range"
                options={INVESTMENT_OPTIONS}
                value={investmentRange}
                onChange={setInvestmentRange}
              />

              <FormRadioGroup
                label="Timeline"
                name="timeline"
                options={TIMELINE_OPTIONS}
                value={timeline}
                onChange={setTimeline}
              />

              <FormRadioGroup
                label="Primary intent"
                name="intent"
                options={INTENT_OPTIONS}
                value={intent}
                onChange={setIntent}
              />

              <div className="pt-4 space-y-4">
                <FormInput
                  label="Full name"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormInput
                  label="Phone (with country code)"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {error && (
                <p className="font-sans text-sm text-red-400 text-center">{error}</p>
              )}

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent-gold px-10 py-4 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Join the VIREZIA Circle"}
                </button>
                <p className="font-sans text-[12px] text-text-muted mt-4">
                  A response within 24 hours.
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="py-16 border-t border-border">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <p className="font-sans text-[12px] text-text-muted tracking-wide">
            VIREZIA &middot; Private Real Estate Intelligence &mdash; Curated Selections in Mexico and Latin America
          </p>
          <a
            href="/privacy"
            className="inline-block font-sans text-[11px] text-text-muted/60 hover:text-text-muted mt-4 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </>
  );
}
