import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { computeLeadHealth, summarizeHealth, type LeadHealth } from "@/lib/leads-health";
import {
  campaignFromApplication,
  campaignFromLead,
  campaignLabel,
  type CampaignSlug,
} from "@/lib/campaigns";

export const dynamic = "force-dynamic";

const CAMPAIGNS = [
  { value: "", label: "All campaigns" },
  { value: "las_orcas", label: "Las Orcas" },
  { value: "apply", label: "Private Access" },
  { value: "other", label: "Other" },
];

function lc(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

export default async function PartnerResponsePage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("lead_assignments")
    .select("id, partner_id, created_at, lead:leads(id, status, client_id, source)")
    .eq("status", "active");

  const leadIds = (assignments ?? []).map((a) => (a.lead as { id?: string } | null)?.id).filter(Boolean) as string[];
  const partnerIds = Array.from(new Set((assignments ?? []).map((a) => a.partner_id).filter(Boolean)));

  // Interactions across all assigned leads.
  const { data: interactions } = leadIds.length
    ? await supabase.from("interactions").select("lead_id, created_by, created_at, type").in("lead_id", leadIds)
    : { data: [] as { lead_id: string; created_by: string | null; created_at: string; type: string }[] };
  const byLead = new Map<string, { created_by: string | null; created_at: string; type: string }[]>();
  for (const i of interactions ?? []) {
    const arr = byLead.get(i.lead_id) || [];
    arr.push({ created_by: i.created_by, created_at: i.created_at, type: i.type });
    byLead.set(i.lead_id, arr);
  }

  // Partner display info.
  const { data: partners } = partnerIds.length
    ? await supabase.from("profiles").select("id, full_name, email, company_name").in("id", partnerIds)
    : { data: [] as { id: string; full_name: string | null; email: string; company_name: string | null }[] };
  const partnerById = new Map((partners ?? []).map((p) => [p.id, p]));

  // Campaign per user (from applications) for lead attribution.
  const { data: apps } = await supabase.from("applications").select("user_id, type, step_data");
  const appCampaign = new Map<string, CampaignSlug>();
  for (const a of apps ?? []) {
    if (!a.user_id) continue;
    const c = campaignFromApplication(a.type, a.step_data as Record<string, unknown>);
    const prev = appCampaign.get(a.user_id);
    if (!prev || prev === "circle") appCampaign.set(a.user_id, c);
  }

  // Group per partner, computing health for each assignment.
  type Group = { partnerId: string; healths: LeadHealth[]; campaigns: Set<string> };
  const groups = new Map<string, Group>();
  for (const a of assignments ?? []) {
    const lead = a.lead as { id?: string; status?: string; client_id?: string; source?: string } | null;
    if (!lead?.id) continue;
    const campaign = campaignFromLead(lead.source, lead.client_id ? appCampaign.get(lead.client_id) : null);
    if (params.campaign && campaign !== params.campaign) continue;

    const health = computeLeadHealth({
      assignedAt: a.created_at as string,
      partnerId: a.partner_id as string,
      status: lead.status || "new",
      interactions: byLead.get(lead.id) || [],
    });

    const g: Group = groups.get(a.partner_id) || { partnerId: a.partner_id, healths: [], campaigns: new Set<string>() };
    g.healths.push(health);
    g.campaigns.add(campaign);
    groups.set(a.partner_id, g);
  }

  const rows = Array.from(groups.values())
    .map((g) => {
      const p = partnerById.get(g.partnerId);
      const s = summarizeHealth(g.healths);
      return {
        name: p?.company_name || p?.full_name || p?.email || "Unknown partner",
        campaigns: Array.from(g.campaigns).map(campaignLabel).join(", "),
        ...s,
      };
    })
    // Worst offenders first: most not-contacted, then at-risk.
    .sort((a, b) => b.notContacted - a.notContacted || b.atRisk - a.atRisk);

  const totals = summarizeHealth(Array.from(groups.values()).flatMap((g) => g.healths));

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Partner Response</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        How fast partners respond to assigned leads. {totals.notContacted} not contacted ·{" "}
        {totals.atRisk} at risk · avg response {totals.avgResponseLabel}. SLA: 48h to first contact, 14d stale.
      </p>

      {/* Campaign filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CAMPAIGNS.map((c) => {
          const active = (params.campaign ?? "") === c.value;
          return (
            <Link
              key={c.value}
              href={c.value ? `/admin/response?campaign=${c.value}` : "/admin/response"}
              className={`border px-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] transition-colors ${
                active
                  ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                  : "border-border text-text-muted hover:border-text-muted"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              {["Partner", "Campaign", "Leads", "Not contacted", "At risk", "Contacted", "Avg response"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm text-text-primary">{r.name}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">{r.campaigns || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.total}</td>
                <td className="px-4 py-3 font-sans text-sm">
                  <span className={r.notContacted > 0 ? "text-red-400" : "text-text-secondary"}>{r.notContacted}</span>
                </td>
                <td className="px-4 py-3 font-sans text-sm">
                  <span className={r.atRisk > 0 ? "text-amber-400" : "text-text-secondary"}>{r.atRisk}</span>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {r.contacted}/{r.total}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.avgResponseLabel}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-sans text-sm text-text-muted">
                  No active partner assignments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
