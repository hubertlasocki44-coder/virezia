import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-12">
        <Image
          src="/logo.png"
          alt="VIREZIA"
          width={140}
          height={36}
          className="h-8 w-auto brightness-0 invert"
          priority
        />
      </Link>
      <div className="w-full max-w-[480px]">{children}</div>
    </div>
  );
}
