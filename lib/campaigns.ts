// Campaign dimension for the admin demand funnel.
//
// Virezia language: "Circle" is the membership/audience that spans every
// Selection; each Selection (Las Orcas, and future ones) is a campaign with
// its own pipeline. "Master View" = all campaigns at once.
//
// We store the campaign slug in applications.step_data.campaign at write time
// and derive it for legacy rows / leads via the helpers below — no schema
// change required.

export type CampaignSlug = "las_orcas" | "circle" | "apply" | "partner" | "other";

export const CAMPAIGN_LABELS: Record<CampaignSlug, string> = {
  las_orcas: "Las Orcas",
  circle: "Circle",
  apply: "Private Access",
  partner: "Partner / Owner",
  other: "Other",
};

// Campaigns that represent buyer demand and belong in the leads pipeline view.
export const PIPELINE_CAMPAIGNS: CampaignSlug[] = ["las_orcas", "apply", "other"];

const BUYER_APPLY_TYPES = new Set(["individual", "institutional"]);

/**
 * Derive the campaign for an application from its type + step_data.
 * Prefers an explicit step_data.campaign (written by current submit actions),
 * falling back to heuristics for legacy rows.
 */
export function campaignFromApplication(
  type: string | null | undefined,
  stepData: Record<string, unknown> | null | undefined
): CampaignSlug {
  const sd = stepData ?? {};
  const explicit = sd.campaign as string | undefined;
  if (explicit && isCampaignSlug(explicit)) return explicit;

  if (type === "las_orcas_campaign") {
    // Founding interest (completed Stage 2) = engaged with the Las Orcas
    // Selection. Otherwise it is a plain Circle membership signup.
    return sd.las_orcas_founding_interest === true || sd.matched === true
      ? "las_orcas"
      : "circle";
  }
  if (type === "developer" || type === "asset_owner" || type === "agent") return "partner";
  if (type && (BUYER_APPLY_TYPES.has(type) || type === "other")) return "apply";
  return "other";
}

/**
 * Derive the campaign for a lead. Current data: source='circle' leads are
 * always matched Las Orcas founding members; source='apply' come from the
 * Private Access form. An optional application campaign (joined via the
 * client's application) takes precedence so future campaigns resolve cleanly.
 */
export function campaignFromLead(
  source: string | null | undefined,
  applicationCampaign?: CampaignSlug | null
): CampaignSlug {
  if (applicationCampaign && applicationCampaign !== "circle") return applicationCampaign;
  switch (source) {
    case "apply":
      return "apply";
    case "circle":
      return "las_orcas"; // only matched founding members become circle-source leads
    default:
      return "other";
  }
}

export function isCampaignSlug(value: string): value is CampaignSlug {
  return value === "las_orcas" || value === "circle" || value === "apply" || value === "partner" || value === "other";
}

export function campaignLabel(slug: string): string {
  return isCampaignSlug(slug) ? CAMPAIGN_LABELS[slug] : slug;
}
