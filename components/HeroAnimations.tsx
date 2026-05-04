"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroContent() {
  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-content px-6">
        <div className="max-w-[640px]">
          <motion.p
            className="font-sans text-[11px] uppercase tracking-[0.2em] text-accent-gold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A Curated Real Estate Network
          </motion.p>

          <motion.h1
            className="mt-8"
            style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Curated real estate,
            <br />
            selected &mdash; not listed.
          </motion.h1>

          <motion.p
            className="mt-6 font-serif text-[clamp(18px,2.5vw,24px)] font-light leading-[1.5] text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            A network where international investors meet
            and find good opportunities.
          </motion.p>

          <motion.div
            className="mt-8 max-w-[520px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="font-sans text-[16px] font-light leading-[1.8] text-text-secondary">
              VIREZIA selects properties from across the market &mdash;
              architectural, design-led, location-driven, investment-grade &mdash;
              and presents them inside VIREZIA Circle.
            </p>
            <p className="font-sans text-[16px] font-light leading-[1.8] text-text-secondary mt-4">
              Apply to create your profile.
              We work with buyers, investors, developers, and asset owners.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              href="/apply"
              className="border border-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-bg-primary"
            >
              Apply for Access
            </Link>
            <Link
              href="/approach"
              className="border-b border-text-secondary pb-px font-sans text-[13px] text-text-secondary transition-colors duration-200 hover:text-text-primary hover:border-text-primary"
            >
              How VIREZIA works &rarr;
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-0 right-0 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="mx-auto max-w-content">
          <div className="border-t border-border-subtle pt-5">
            <p className="font-sans text-[12px] tracking-[0.05em] text-text-muted">
              Properties available inside VIREZIA Circle. Apply to create your profile.
            </p>
            <p className="mt-2 font-serif text-[14px] italic text-accent-gold/60">
              VIREZIA Circle &mdash; by invitation only.{" "}
              <Link href="/circle" className="hover:text-accent-gold transition-colors">&rarr;</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
