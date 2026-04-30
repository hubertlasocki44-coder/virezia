"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

export default function LasOrcasConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Confirmation hero */}
      <section className="flex-1 flex items-center py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-6">
              VIREZIA Circle
            </p>
            <h1 className="font-serif text-[clamp(32px,5vw,56px)] font-light leading-[1.1] mb-8">
              Welcome to the Circle.
            </h1>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary max-w-lg mx-auto">
              Robert Couturier&apos;s full conversation on Las Orcas is below. We will be in touch within 24 hours to arrange an introduction with Paul Krueger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full video embed */}
      <section className="bg-bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <AnimatedSection>
            <div className="relative aspect-video w-full bg-bg-primary border border-border">
              {/* PLACEHOLDER: Replace with Vimeo embed (full 4-min video)
                  <iframe src="https://player.vimeo.com/video/VIDEO_ID" ... />
              */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-accent-gold/40 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="font-sans text-xs text-text-muted uppercase tracking-label">
                    Full Couturier video (4 min)
                  </p>
                  <p className="font-sans text-[11px] text-text-muted mt-1">
                    Vimeo embed placeholder
                  </p>
                </div>
              </div>
            </div>
            <p className="font-sans text-sm font-light text-text-secondary text-center mt-8">
              Robert Couturier on Las Orcas &mdash; the full conversation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-xl px-6 md:px-10 text-center">
          <AnimatedSection>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-6">
              Next Step
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary mb-8">
              Schedule a private conversation with Paul Krueger, who oversees the Las Orcas process.
            </p>
            {/* PLACEHOLDER: Replace href with Paul Krueger's Cal.com link */}
            <a
              href="#booking-placeholder"
              className="inline-block bg-accent-gold px-10 py-4 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
            >
              Schedule a Conversation
            </a>
            <p className="font-sans text-[11px] text-text-muted mt-4">
              30 minutes. No obligation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border mt-auto">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <p className="font-sans text-[12px] text-text-muted tracking-wide">
            VIREZIA &middot; Private Real Estate Intelligence &mdash; Curated Selections in Mexico and Latin America
          </p>
        </div>
      </footer>
    </div>
  );
}
