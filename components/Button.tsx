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
  const base =
    "inline-block font-sans text-[11px] tracking-[0.18em] uppercase transition-all duration-500";

  const variants = {
    primary:
      "border border-text-primary/80 text-text-primary px-10 py-4 hover:bg-text-primary hover:text-bg-primary",
    secondary:
      "text-text-secondary hover:text-text-primary relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-500 hover:after:w-full",
    ghost:
      "text-accent hover:text-text-primary",
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
