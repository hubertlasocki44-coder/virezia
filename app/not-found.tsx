import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="VIREZIA"
          width={140}
          height={36}
          className="h-8 w-auto brightness-0 invert"
        />
      </Link>
      <h1 className="mt-12 font-serif text-[clamp(36px,5vw,56px)] font-light text-text-primary">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-center font-sans text-base font-light text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-6">
        <Link
          href="/"
          className="bg-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
        <Link
          href="/apply"
          className="border border-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all hover:bg-accent-gold hover:text-bg-primary"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
