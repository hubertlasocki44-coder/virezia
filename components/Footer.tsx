import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Left — Wordmark */}
          <div>
            <Link
              href="/"
              className="font-serif text-lg tracking-[0.2em] text-accent-gold"
            >
              VIREZIA
            </Link>
            <p className="mt-2 font-sans text-xs uppercase tracking-label text-text-muted">
              Bespoke Living
            </p>
          </div>

          {/* Center — Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center">
            <Link
              href="/how-it-works"
              className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              How It Works
            </Link>
            <Link
              href="/market"
              className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Market
            </Link>
            <Link
              href="/bespoke-living"
              className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Bespoke Living
            </Link>
            <Link
              href="/apply"
              className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Apply
            </Link>
          </div>

          {/* Right — Contact */}
          <div className="md:text-right">
            <a
              href="mailto:hello@virezia.com"
              className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              hello@virezia.com
            </a>
            <p className="mt-1 font-sans text-sm text-text-muted">
              Cancún · Mexico
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="font-sans text-xs text-text-muted">
            © 2026 VIREZIA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-sans text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-sans text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              Terms
            </Link>
            <Link
              href="/partners"
              className="font-sans text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              List Your Property →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
