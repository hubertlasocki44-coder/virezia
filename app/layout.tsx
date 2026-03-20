import type { Metadata } from "next";
import { cormorant, dmSans } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "VIREZIA — Private Real Estate Intelligence · Mexico",
  description:
    "Private real estate intelligence for expats and foreign investors in Mexico. Curated, verified, and matched to your profile — Tulum, Riviera Maya, Oaxaca.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "VIREZIA — Private Real Estate Intelligence · Mexico",
    description:
      "Private real estate intelligence for expats and foreign investors in Mexico. Curated, verified, and matched to your profile — Tulum, Riviera Maya, Oaxaca.",
    type: "website",
    locale: "en_US",
    siteName: "VIREZIA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-bg-primary font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
