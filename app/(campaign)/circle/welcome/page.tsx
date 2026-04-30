"use client";

import { motion } from "framer-motion";

export default function CircleWelcomePage() {
  return (
    <div className="min-h-screen flex flex-col">
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
              You are now part of the VIREZIA Circle. We curate a small number of opportunities each quarter &mdash; reviewed for architectural significance, regulatory integrity, and process quality.
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary max-w-lg mx-auto mt-6">
              Expect to hear from us when something aligns with your profile.
            </p>

            <div className="mt-12 border border-border bg-bg-card px-8 py-6 max-w-md mx-auto">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-3">
                What happens next
              </p>
              <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
                A welcome email from VIREZIA is on its way. Over the next two weeks, we will share more about Robert Couturier, Las Orcas, and how VIREZIA Selections works.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

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
