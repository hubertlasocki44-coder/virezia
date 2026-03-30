import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIREZIA Circle",
  description: "By invitation only.",
  robots: { index: false, follow: false },
};

export default function CircleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
