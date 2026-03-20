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
  const base = "inline-block font-sans text-sm tracking-label uppercase transition-all duration-300";

  const variants = {
    primary:
      "border border-accent-gold text-accent-gold px-8 py-3 hover:bg-accent-gold hover:text-bg-primary",
    secondary:
      "text-text-secondary hover:text-text-primary relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-text-primary after:transition-all after:duration-300 hover:after:w-full",
    ghost:
      "border border-border-subtle text-text-secondary px-6 py-2 hover:border-text-muted hover:text-text-primary",
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
