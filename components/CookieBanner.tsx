"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "virezia-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <p className="font-sans text-[12px] leading-relaxed text-text-secondary sm:text-sm">
          Cookies for site functionality and analytics.{" "}
          <Link href="/privacy" className="text-accent-gold hover:text-accent-gold-light transition-colors underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="px-3 py-1.5 font-sans text-[11px] uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary sm:px-4 sm:py-2 sm:text-xs"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="bg-accent-gold px-3 py-1.5 font-sans text-[11px] uppercase tracking-wider text-bg-primary transition-colors hover:bg-accent-gold-light sm:px-4 sm:py-2 sm:text-xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
