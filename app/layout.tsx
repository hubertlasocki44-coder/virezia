import type { Metadata } from "next";
import { cormorant, dmSans } from "@/lib/fonts";
import "@/styles/globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virezia.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VIREZIA — Private Real Estate Intelligence · Emerging Markets",
    template: "%s — VIREZIA",
  },
  description:
    "Private real estate intelligence for expats and foreign investors. Verified opportunities matched to your profile — no noise, no hidden fees.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "VIREZIA — Private Real Estate Intelligence · Emerging Markets",
    description:
      "Private real estate intelligence for expats and foreign investors. Verified opportunities matched to your profile — no noise, no hidden fees.",
    type: "website",
    locale: "en_US",
    siteName: "VIREZIA",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VIREZIA — Private Real Estate Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIREZIA — Private Real Estate Intelligence",
    description:
      "Verified opportunities in emerging markets. Matched to your profile. No noise, no hidden fees.",
    images: ["/images/og-image.jpg"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VIREZIA",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              description:
                "Private real estate intelligence for expats and foreign investors in emerging markets.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@virezia.com",
                contactType: "customer service",
              },
              sameAs: [],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
