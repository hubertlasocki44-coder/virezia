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
    description: "Early-stage market attracting remote-worker demand with lower entry points. Limited comparable data — deeper due diligence required.",
    metrics: {
      pricePerSqm: "$1,100–$2,000 USD",
      avgStrYield: "10–15%",
      demandTrend: "rising" as const,
    },
    highlights: ["Lower entry prices", "Digital nomad demand", "Cultural authenticity", "Early-stage upside"],
    riskFactors: ["Limited infrastructure", "Fewer comparable sales", "Remote logistics"],
    image: "/images/jungle.webp",
  },
  {
    id: "buenos_aires",
    name: "Buenos Aires",
    state: "Argentina",
    description: "Stabilizing market with strong rental yields and growing foreign buyer interest. Early-stage intelligence gathering underway.",
    metrics: {
      pricePerSqm: "$1,800–$2,600 USD",
      avgStrYield: "5–7%",
      demandTrend: "rising" as const,
    },
    highlights: ["Strong rental yields in USD terms", "Growing foreign buyer interest", "Cultural and economic capital", "Undervalued relative to comparable cities"],
    riskFactors: ["Currency volatility", "Regulatory unpredictability", "Limited on-the-ground network"],
    image: "/images/luxury-villa.webp",
    status: "monitoring" as const,
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
