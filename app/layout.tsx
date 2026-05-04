import type { Metadata } from "next";
import { cormorant, dmSans } from "@/lib/fonts";
import "@/styles/globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virezia.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VIREZIA — Curated Real Estate, Selected — Not Listed",
    template: "%s — VIREZIA",
  },
  description:
    "A curated real estate network. Properties selected for architecture, design, location, and story — presented inside VIREZIA Circle. By invitation.",
  icons: {
    icon: "/favicon.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "VIREZIA — Curated Real Estate, Selected — Not Listed",
    description:
      "A curated real estate network. Properties selected for architecture, design, location, and story — presented by invitation.",
    type: "website",
    locale: "en_US",
    siteName: "VIREZIA",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VIREZIA — Curated Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIREZIA — Curated Real Estate, Selected — Not Listed",
    description:
      "A curated real estate network. Properties selected for architecture, design, location, and story — by invitation.",
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
                "A curated real estate network. Properties selected for architecture, design, location, and story — presented by invitation.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@virezia.com",
                contactType: "customer service",
              },

            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
