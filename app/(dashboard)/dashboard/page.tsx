import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import PartnerLeadList from "./PartnerLeadList";
import { computeLeadHealth, summarizeHealth, type LeadHealth } from "@/lib/leads-health";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const isBuyer = profile.role === "buyer";
  const isPartner = ["developer", "agent", "broker", "asset_owner", "service_partner"].includes(profile.role);

  if (isBuyer) return <BuyerDashboard userId={user.id} profile={profile} />;
  if (isPartner) return <PartnerDashboard userId={user.id} profile={profile} />;

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Dashboard</h1>
      <p className="mt-4 font-sans text-sm text-text-muted">Your account is being reviewed.</p>
    </div>
  );
}

async function BuyerDashboard({ userId, profile }: { userId: string; profile: Record<string, unknown> }) {
  const supabase = await createClient();

  const { data: buyerProfile } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: application } = await supabase
    .from("applications")
    .select("status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stages = [
    { label: "Application", active: true },
    { label: "Profile Review", active: application?.status !== "pending" },
    { label: "VIREZIA Selections", active: application?.status === "approved" },
    { label: "Acquisition", active: false },
  ];

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">
        Welcome, {(profile.full_name as string)?.split(" ")[0] || "there"}.
      </h1>

      {/* Application status */}
      <div className="mt-8 border border-border bg-bg-card p-6">
        <h2 className="font-serif text-lg text-text-primary">Application Status</h2>
        <div className="mt-4 flex gap-2">
          {stages.map((s, i) => (
            <div key={s.label} className="flex flex-1 flex-col items-center">
              <div className={`h-1 w-full ${s.active ? "bg-accent-gold" : "bg-border"}`} />
              <p className={`mt-2 text-center font-sans text-[11px] ${s.active ? "text-accent-gold" : "text-text-muted"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bespoke Property Profile */}
      {buyerProfile ? (
        <div className="mt-6 border border-border bg-bg-card p-6">
          <h2 className="font-serif text-lg text-text-primary">Your Bespoke Property Profile</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Investment Type", buyerProfile.investment_type],
              ["Budget Range", buyerProfile.budget_range],
              ["Timeline", buyerProfile.timeline],
              ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
              ["Purpose", buyerProfile.purpose],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{label as string}</dt>
                <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(value as string) || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="mt-6 border border-border bg-bg-card p-6">
          <h2 className="font-serif text-lg text-text-primary">Your Bespoke Property Profile</h2>
          <p className="mt-2 font-sans text-sm text-text-muted">
            Your profile will be built during your onboarding call.
          </p>
        </div>
      )}

      {/* VIREZIA Selections */}
      <div className="mt-6 border border-border bg-bg-card p-6">
        <h2 className="font-serif text-lg text-text-primary">Your VIREZIA Selections</h2>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Your curated selections will appear here once your profile is active.
        </p>
      </div>

      {/* Concierge */}
      <div className="mt-6 border border-border bg-bg-card p-6">
        <h2 className="font-serif text-lg text-text-primary">Your Concierge</h2>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Speak to your VIREZIA Concierge. Communication channel coming soon.
        </p>
      </div>
    </div>
  );
}

async function PartnerDashboard({ userId, profile }: { userId: string; profile: Record<string, unknown> }) {
  const supabase = await createServiceClient();

  const { data: assignments } = await supabase
    .from("lead_assignments")
    .select("*, lead:leads(*, client:profiles!leads_client_id_fkey(full_name, email, phone))")
    .eq("partner_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { count: totalAssigned } = await supabase
    .from("lead_assignments")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", userId);

  // Count by status
  const statusCounts: Record<string, number> = {};
  (assignments || []).forEach((a) => {
    const lead = a.lead as Record<string, unknown> | null;
    const status = (lead?.status as string) || "new";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // --- Response health: pull this partner's touches across assigned leads ---
  const leadIds = (assignments || [])
    .map((a) => (a.lead as Record<string, unknown> | null)?.id as string)
    .filter(Boolean);

  const { data: partnerInteractions } = leadIds.length
    ? await supabase
        .from("interactions")
        .select("lead_id, created_by, created_at, type")
        .in("lead_id", leadIds)
        .eq("created_by", userId)
    : { data: [] as { lead_id: string; created_by: string | null; created_at: string; type: string }[] };

  const byLead = new Map<string, { created_by: string | null; created_at: string; type: string }[]>();
  for (const i of partnerInteractions || []) {
    const arr = byLead.get(i.lead_id) || [];
    arr.push({ created_by: i.created_by, created_at: i.created_at, type: i.type });
    byLead.set(i.lead_id, arr);
  }

  const healthByAssignment = new Map<string, LeadHealth>();
  for (const a of assignments || []) {
    const lead = a.lead as Record<string, unknown> | null;
    const leadId = lead?.id as string;
    healthByAssignment.set(
      a.id as string,
      computeLeadHealth({
        assignedAt: a.created_at as string,
        partnerId: userId,
        status: (lead?.status as string) || "new",
        interactions: byLead.get(leadId) || [],
      })
    );
  }
  const summary = summarizeHealth(Array.from(healthByAssignment.values()));

  const assignmentsWithHealth = (assignments || []).map((a) => {
    const h = healthByAssignment.get(a.id as string);
    return { ...a, health: h ? { state: h.state, label: h.label } : null };
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-sans text-[24px] font-medium text-white/90 tracking-tight">
            Pipeline
          </h1>
          <p className="mt-1 font-sans text-[13px] text-white/30">
            {profile.company_name ? `${profile.company_name as string} — ` : ""}
            {totalAssigned ?? 0} total leads
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: totalAssigned ?? 0, color: "white/90" },
          { label: "New", value: statusCounts["new"] || 0, color: "[#c9a96e]" },
          { label: "In Progress", value: (statusCounts["screening"] || 0) + (statusCounts["qualified"] || 0) + (statusCounts["in_progress"] || 0), color: "[#5a8ac9]" },
          { label: "Won", value: statusCounts["closed_won"] || 0, color: "[#4ade80]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="font-sans text-[11px] text-white/30 uppercase tracking-wider">{stat.label}</p>
            <p className={`mt-2 font-sans text-[28px] font-light text-${stat.color} tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Response health row */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[
          { label: "Not contacted", value: summary.notContacted, color: "red-400" },
          { label: "At risk", value: summary.atRisk, color: "amber-400" },
          { label: "Avg response", value: summary.avgResponseLabel, color: "white/90" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="font-sans text-[11px] text-white/30 uppercase tracking-wider">{stat.label}</p>
            <p className={`mt-2 font-sans text-[28px] font-light text-${stat.color} tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="mt-10">
        {assignments && assignments.length > 0 ? (
          <PartnerLeadList assignments={assignmentsWithHealth as unknown as Parameters<typeof PartnerLeadList>[0]["assignments"]} />
        ) : (
          <div className="flex items-center justify-center h-[300px] border border-dashed border-white/[0.06] rounded-xl">
            <div className="text-center">
              <p className="font-sans text-[15px] text-white/30">No leads assigned yet</p>
              <p className="mt-1 font-sans text-[12px] text-white/15">Leads from your campaign will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
