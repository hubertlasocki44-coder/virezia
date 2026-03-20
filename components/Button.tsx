import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const base = "inline-block font-sans text-[13px] tracking-[0.1em] uppercase transition-all duration-200";

  const variants = {
    primary:
      "bg-accent-gold text-bg-primary px-8 py-[14px] hover:opacity-90",
    secondary:
      "text-text-secondary border-b border-text-secondary pb-px hover:text-text-primary hover:border-text-primary",
    ghost:
      "border border-border text-text-secondary px-6 py-2 hover:border-text-muted hover:text-text-primary",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
