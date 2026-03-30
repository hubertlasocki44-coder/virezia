export const MARKET_REGIONS = [
  {
    id: "tulum",
    name: "Tulum",
    state: "Quintana Roo",
    description: "Mexico's fastest-growing real estate market. Strong STR demand, rapid infrastructure development, and increasing institutional interest. Saturation in some zones requires careful positioning.",
    metrics: {
      pricePerSqm: "$2,200–$3,800 USD",
      avgStrYield: "8–12%",
      demandTrend: "rising" as const,
    },
    highlights: ["Pre-sale opportunities below market", "STR yield potential", "Tren Maya rail infrastructure", "International buyer demand"],
    riskFactors: ["Ejido land risk", "Permit delays", "Oversupply in entry-level condos"],
    image: "/images/tulum-aerial.webp",
  },
  {
    id: "riviera_maya",
    name: "Riviera Maya",
    state: "Quintana Roo",
    description: "The mature corridor from Cancun to Playa del Carmen. Established infrastructure, proven rental yields, and a deep buyer pool. Less volatility, more predictability.",
    metrics: {
      pricePerSqm: "$1,800–$3,200 USD",
      avgStrYield: "6–9%",
      demandTrend: "stable" as const,
    },
    highlights: ["Established rental market", "Airport proximity", "Proven 5-year appreciation", "Resort-grade amenities"],
    riskFactors: ["Higher entry price", "Competition from resorts", "Tourist dependency"],
    image: "/images/luxury-villa.webp",
  },
  {
    id: "oaxaca",
    name: "Oaxaca & Puerto Escondido",
    state: "Oaxaca",
    description: "Where informed capital is moving. Digital nomad demand, authentic culture, and significantly lower entry points. Early-stage market with high upside for positioned buyers.",
    metrics: {
      pricePerSqm: "$1,100–$2,000 USD",
      avgStrYield: "10–15%",
      demandTrend: "rising" as const,
    },
    highlights: ["Lower entry prices", "Digital nomad demand", "Cultural authenticity", "Early-stage upside"],
    riskFactors: ["Limited infrastructure", "Fewer comparable sales", "Remote logistics"],
    image: "/images/jungle.webp",
  },
];

export const MONITORING_AREAS = [
  "Pricing trends and comparable sales",
  "Permit and zoning compliance",
  "Developer track records and delivery history",
  "Title status and legal encumbrances",
  "Infrastructure development and municipal planning",
  "Short-term rental demand and occupancy rates",
];
