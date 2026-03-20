"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-bg-primary/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="relative block">
          <Image
            src="/logo.png"
            alt="VIREZIA — Bespoke Living"
            width={140}
            height={36}
            className="h-8 w-auto lg:h-9"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="border border-text-primary/80 px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-500 hover:bg-text-primary hover:text-bg-primary"
          >
            Apply →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-text-primary md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border-subtle bg-bg-primary px-6 pb-10 pt-6 md:hidden">
          <div className="flex flex-col gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-[0.18em] text-text-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="inline-block border border-text-primary px-6 py-3 text-center font-sans text-sm uppercase tracking-[0.18em] text-text-primary"
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
