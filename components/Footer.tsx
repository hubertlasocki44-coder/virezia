import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Left — Logo + tagline */}
          <div>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="VIREZIA"
                width={100}
                height={25}
                className="h-6 w-auto brightness-0 invert opacity-60"
              />
            </Link>
            <p className="mt-3 font-sans text-[12px] text-text-muted">
              Curated homes, by invitation.
            </p>
          </div>

          {/* Center — Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center">
            <Link href="/#featured" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Featured</Link>
            <Link href="/approach" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Approach</Link>
            <Link href="/bespoke-living" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Bespoke Living</Link>
            <Link href="/apply" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">Apply</Link>
          </div>

          {/* Right — Contact */}
          <div className="md:text-right">
            <a href="mailto:hello@virezia.com" className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary">
              hello@virezia.com
            </a>
            <p className="mt-2 font-sans text-[12px] text-text-muted">
              Canc&uacute;n &middot; Mexico
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="font-sans text-[11px] text-text-muted">&copy; 2026 VIREZIA. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">Privacy</Link>
            <Link href="/terms" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">Terms</Link>
            <Link href="/for-owners" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">For Owners &rarr;</Link>
            <Link href="/circle" className="font-sans text-[11px] text-text-muted transition-colors hover:text-text-secondary">Circle &rarr;</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
