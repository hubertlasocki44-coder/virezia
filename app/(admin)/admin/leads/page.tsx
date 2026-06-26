import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LeadsTable, { type PipelineRow } from "./LeadsTable";
import IncompleteCaptureTable, { type IncompleteRow } from "./IncompleteTable";
import ExportButton from "./ExportButton";
import {
  campaignFromApplication,
  campaignFromLead,
  campaignLabel,
  type CampaignSlug,
} from "@/lib/campaigns";

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "qualified", label: "Qualified" },
  { value: "matched", label: "Matched" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
  { value: "archived", label: "Archived" },
];

const CAMPAIGNS = [
  { value: "", label: "All campaigns" },
  { value: "las_orcas", label: "Las Orcas" },
  { value: "apply", label: "Private Access" },
  { value: "other", label: "Other" },
];

function lc(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

function buildHref(base: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const merged = { ...base, ...patch };
  const qs = Object.entries(merged)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return qs ? `/admin/leads?${qs}` : "/admin/leads";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; campaign?: string; view?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "incomplete" ? "incomplete" : "pipeline";
  const supabase = await createClient();

  // Map each user to a campaign via their applications (used for both views).
  const { data: appsForMap } = await supabase.from("applications").select("user_id, type, step_data");
  const appCampaign = new Map<string, CampaignSlug>();
  for (const a of appsForMap ?? []) {
    if (!a.user_id) continue;
    const c = campaignFromApplication(a.type, a.step_data as Record<string, unknown>);
    const prev = appCampaign.get(a.user_id);
    if (!prev || prev === "circle") appCampaign.set(a.user_id, c);
  }

  const baseParams = { campaign: params.campaign, status: params.status, view: params.view };

  const header = (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[28px] font-light text-text-primary">Leads Pipeline</h1>
          <p className="mt-1 font-sans text-sm text-text-muted">
            {view === "pipeline"
              ? "Qualified demand across all Selections."
              : "Founding interest that has not qualified yet — almost-leads."}
          </p>
        </div>
        <ExportButton campaign="las_orcas" />
      </div>

      {/* View tabs */}
      <div className="mt-6 flex gap-1 border-b border-border">
        {[
          { key: "pipeline", label: "Pipeline" },
          { key: "incomplete", label: "Incomplete" },
        ].map((t) => {
          const active = view === t.key;
          return (
            <Link
              key={t.key}
              href={buildHref(baseParams, { view: t.key === "pipeline" ? undefined : t.key })}
              className={`border-b-2 px-4 py-2 font-sans text-sm transition-colors ${
                active ? "border-accent-gold text-accent-gold" : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Campaign filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CAMPAIGNS.map((c) => {
          const active = (params.campaign ?? "") === c.value;
          return (
            <Link
              key={c.value}
              href={buildHref(baseParams, { campaign: c.value || undefined })}
              className={`border px-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] transition-colors ${
                active ? "border-accent-gold bg-accent-gold/10 text-accent-gold" : "border-border text-text-muted hover:border-text-muted"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>
    </div>
  );

  if (view === "incomplete") {
    const { data: leadRows } = await supabase
      .from("leads")
      .select("client:profiles!leads_client_id_fkey(email)");
    const leadEmails = new Set(
      (leadRows ?? []).map((l) => lc((l.client as { email?: string } | null)?.email)).filter(Boolean)
    );

    const { data: apps } = await supabase
      .from("applications")
      .select("type, status, step_data, created_at, updated_at, user_id, user:profiles!applications_user_id_fkey(full_name, email, phone)")
      .eq("type", "las_orcas_campaign")
      .not("status", "in", "(archived,rejected,approved)")
      .order("updated_at", { ascending: false });

    const rows: IncompleteRow[] = (apps ?? [])
      .map((a) => {
        const sd = (a.step_data ?? {}) as Record<string, unknown>;
        const user = a.user as { full_name?: string; email?: string; phone?: string } | null;
        const email = lc(user?.email || (sd.email as string));
        const campaign = (a.user_id ? appCampaign.get(a.user_id) : null) || campaignFromApplication(a.type, sd);
        return {
          email,
          name: (user?.full_name as string) || (sd.full_name as string) || "",
          phone: (sd.phone as string) || (user?.phone as string) || "",
          campaign: campaignLabel(campaign),
          campaignSlug: campaign,
          budget: (sd.investment_range as string) || "",
          timeline: (sd.timeline as string) || "",
          founding: sd.las_orcas_founding_interest === true,
          lastActivity: a.updated_at || a.created_at,
        };
      })
      .filter((r) => r.email && r.founding && !leadEmails.has(r.email))
      .filter((r) => !params.campaign || r.campaignSlug === params.campaign)
      .sort((a, b) => (b.lastActivity ?? "").localeCompare(a.lastActivity ?? ""))
      .map((r) => ({
        email: r.email,
        name: r.name,
        phone: r.phone,
        campaign: r.campaign,
        budget: r.budget,
        timeline: r.timeline,
        lastActivity: r.lastActivity ? new Date(r.lastActivity).toLocaleString() : "—",
      }));

    return (
      <div>
        {header}
        <IncompleteCaptureTable rows={rows} />
      </div>
    );
  }

  // --- Pipeline view ---
  let query = supabase
    .from("leads")
    .select(
      "*, client:profiles!leads_client_id_fkey(full_name, email), employee:profiles!leads_assigned_employee_fkey(full_name), lead_assignments(id)"
    )
    .order("created_at", { ascending: false });
  if (params.status) query = query.eq("status", params.status);
  const { data: leadsRaw } = await query;

  let leads = (leadsRaw ?? []).map((l) => ({
    ...l,
    campaign: campaignFromLead(l.source, appCampaign.get(l.client_id)),
  }));
  if (params.campaign) leads = leads.filter((l) => l.campaign === params.campaign);

  const rows: PipelineRow[] = leads.map((lead) => ({
    id: lead.id,
    client: lead.client?.full_name || lead.client?.email || "Unknown",
    campaign: campaignLabel(lead.campaign),
    status: lead.status,
    priority: lead.priority,
    score: lead.score,
    employee: lead.employee?.full_name || "—",
    partners: lead.lead_assignments?.length || 0,
    created: new Date(lead.created_at).toLocaleDateString(),
  }));

  return (
    <div>
      {header}

      {/* Status filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = (params.status ?? "") === s.value;
          return (
            <Link
              key={s.value}
              href={buildHref(baseParams, { status: s.value || undefined })}
              className={`border px-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] transition-colors ${
                active ? "border-accent-gold bg-accent-gold/10 text-accent-gold" : "border-border text-text-muted hover:border-text-muted"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      <p className="mt-4 font-sans text-sm text-text-muted">{rows.length} leads</p>
      <LeadsTable rows={rows} />
    </div>
  );
}
