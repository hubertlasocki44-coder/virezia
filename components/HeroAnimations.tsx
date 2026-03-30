"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";

export default function HeroContent() {
  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-content px-6" style={{ marginTop: "-5vh" }}>
        <div className="max-w-[620px]">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block h-[2px] w-6 bg-accent-gold" />
            <SectionLabel text="Private Real Estate Intelligence · Mexico & Emerging Markets" />
          </motion.div>

          <motion.h1
            className="mt-8"
            style={{ fontSize: "clamp(52px, 7vw, 88px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Fewer Options.
            <br />
            Better Ones. Yours.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[500px] font-sans text-[17px] font-light leading-[1.75] text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            We help expats and foreign investors buy property in Mexico
            with full confidence. Verified opportunities matched to your
            profile. No noise. No hidden fees.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              href="/apply"
              className="bg-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity duration-200 hover:opacity-90"
            >
              Apply for Private Access
            </Link>
            <Link
              href="/how-it-works"
              className="border-b border-text-secondary pb-px font-sans text-[13px] text-text-secondary transition-colors duration-200 hover:text-text-primary hover:border-text-primary"
            >
              Learn how it works →
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-0 right-0 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <p className="mx-auto max-w-content text-center font-sans text-[12px] tracking-[0.05em] text-text-secondary">
          Not a listing portal. Every option is selected for you specifically.
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <motion.div
          className="h-6 w-px bg-text-muted"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </>
  );
}
