import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Left — Wordmark */}
          <div>
            <Link href="/" className="font-serif text-[16px] tracking-[0.15em] text-text-muted">
              VIREZIA
            </Link>
          </div>

          {/* Center — Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center">
            <Link href="/how-it-works" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">How It Works</Link>
            <Link href="/market" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Market</Link>
            <Link href="/bespoke-living" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Bespoke Living</Link>
            <Link href="/apply" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Apply</Link>
          </div>

          {/* Right — Contact */}
          <div className="md:text-right">
            <a href="mailto:hello@virezia.com" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">
              hello@virezia.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="font-sans text-[11px] text-text-muted">© 2026 VIREZIA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">Privacy Policy</Link>
            <Link href="/terms" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">Terms</Link>
            <Link href="/partners" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">List Your Property</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
