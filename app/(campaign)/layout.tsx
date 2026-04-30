import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-10">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="VIREZIA"
            width={100}
            height={26}
            className="h-5 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
            priority
          />
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}
