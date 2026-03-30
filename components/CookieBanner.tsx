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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-text-secondary">
          We use essential cookies for site functionality and analytics cookies to improve our services.
          Read our{" "}
          <Link href="/privacy" className="text-accent-gold hover:text-accent-gold-light transition-colors underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded border border-border-subtle px-4 py-2 font-sans text-xs uppercase tracking-wider text-text-muted transition-colors hover:border-text-muted hover:text-text-secondary"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded bg-accent-gold px-4 py-2 font-sans text-xs uppercase tracking-wider text-bg-primary transition-colors hover:bg-accent-gold-light"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
