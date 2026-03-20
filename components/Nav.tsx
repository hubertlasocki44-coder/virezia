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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(8,8,8,0.95)] backdrop-blur-md"
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
              className="font-sans text-xs uppercase tracking-label text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="border border-accent-gold px-5 py-2 font-sans text-xs uppercase tracking-label text-accent-gold transition-all duration-300 hover:bg-accent-gold hover:text-bg-primary"
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
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-bg-primary px-6 pb-8 pt-4 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-label text-text-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="inline-block border border-accent-gold px-5 py-3 text-center font-sans text-sm uppercase tracking-label text-accent-gold"
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
