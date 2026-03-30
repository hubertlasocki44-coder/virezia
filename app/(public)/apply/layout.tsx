import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Private Access — VIREZIA",
  description:
    "Apply for access to verified real estate opportunities in emerging markets. Individual, institutional, and partner applications.",
  alternates: {
    canonical: "https://virezia.com/apply",
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
