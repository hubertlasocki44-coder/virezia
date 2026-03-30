import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With VIREZIA",
  description:
    "Place your assets with qualified capital. VIREZIA connects verified developers and asset owners with serious investors through private distribution.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://virezia.com/partners",
  },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
