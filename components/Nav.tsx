"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/market", label: "Market" },
    { href: "/bespoke-living", label: "Bespoke Living" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-[rgba(8,8,8,0.95)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        <Link href="/" className="relative block">
          <Image
            src="/logo.png"
            alt="VIREZIA — Bespoke Living"
            width={140}
            height={36}
            className="h-8 w-auto brightness-0 invert lg:h-9"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="border border-accent-gold px-5 py-2 font-sans text-[12px] uppercase tracking-[0.1em] text-accent-gold transition-all duration-200 hover:bg-accent-gold hover:text-bg-primary"
          >
            Apply →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-text-secondary md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border-subtle bg-[rgba(8,8,8,0.98)] px-6 pb-8 pt-6 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-[0.1em] text-text-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="inline-block border border-accent-gold px-5 py-3 text-center font-sans text-sm uppercase tracking-[0.1em] text-accent-gold"
              onClick={() => setMenuOpen(false)}
            >
              Apply →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
