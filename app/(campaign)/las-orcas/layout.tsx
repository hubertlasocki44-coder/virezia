import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Las Orcas — Robert Couturier Residences, Oaxacan Coast",
  description:
    "Six beachfront villas designed by Robert Couturier in Puerto Escondido, Oaxaca. A VIREZIA Selection.",
  openGraph: {
    title: "Las Orcas — Robert Couturier Residences",
    description:
      "Forty years after Cuixmala, he returns to the Pacific. Six villas on the Oaxacan Coast.",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Las Orcas — Robert Couturier Residences",
      },
    ],
  },
};

export default function LasOrcasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
