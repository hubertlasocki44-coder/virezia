import Image from "next/image";
import Link from "next/link";

export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-content px-6 py-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="VIREZIA"
            width={140}
            height={36}
            className="h-8 w-auto brightness-0 invert"
            priority
          />
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}
