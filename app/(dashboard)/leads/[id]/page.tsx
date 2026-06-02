import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StatusChanger, AddNote, LogContact } from "./LeadActions";
import ContactBadge from "@/components/ContactBadge";
import { computeLeadHealth } from "@/lib/leads-health";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PartnerLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const serviceSupabase = await createServiceClient();

  const { data: assignment } = await serviceSupabase
    .from("lead_assignments")
    .select("*, lead:leads(*, client:profiles!leads_client_id_fkey(*))")
    .eq("lead_id", id)
    .eq("partner_id", user.id)
    .eq("status", "active")
    .single();

  if (!assignment) notFound();

  const lead = assignment.lead as Record<string, unknown>;
  const client = lead?.client as Record<string, unknown>;
  const isFullAccess = assignment.visibility_level === "full";

  let buyerProfile: Record<string, unknown> | null = null;
  if (isFullAccess && client?.id) {
    const { data } = await serviceSupabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", client.id as string)
      .maybeSingle();
    buyerProfile = data;
  }

  let applicationData: Record<string, unknown> | null = null;
  if (isFullAccess && client?.id) {
    const { data } = await serviceSupabase
      .from("applications")
      .select("step_data, type, status, created_at")
      .eq("user_id", client.id as string)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    applicationData = data;
  }

  const stepData = (applicationData?.step_data || {}) as Record<string, unknown>;

  const { data: interactions } = await serviceSupabase
    .from("interactions")
    .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
    .eq("lead_id", id)
    .eq("visible_to_partner", true)
    .order("created_at", { ascending: false });

  const health = computeLeadHealth({
    assignedAt: assignment.created_at as string,
    partnerId: user.id,
    status: lead?.status as string,
    interactions: (interactions || []).map((i) => ({
      created_by: i.created_by,
      created_at: i.created_at,
      type: i.type,
    })),
  });

  const formatValue = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const initials = ((client?.full_name as string) || (client?.email as string) || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1 font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors">
        &larr; Pipeline
      </Link>

      {/* Header */}
      <div className="mt-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <span className="font-sans text-[14px] font-medium text-white/50">{initials}</span>
        </div>
        <div className="flex-1">
          <h1 className="font-sans text-[22px] font-medium text-white/90 tracking-tight">
            {(client?.full_name as string) || "Client"}
          </h1>
          {isFullAccess ? (
            <p className="mt-0.5 font-sans text-[13px] text-white/30">
              {client?.email as string}
              {client?.phone ? ` · ${client.phone as string}` : ""}
            </p>
          ) : null}
        </div>
      </div>

      {/* Status + score bar */}
      <div className="mt-6 flex flex-wrap items-center gap-4 pb-6 border-b border-white/[0.06]">
        <StatusChanger leadId={id} currentStatus={lead?.status as string} />
        <ContactBadge state={health.state} label={health.label} />
        {lead?.priority && (lead.priority as string) !== "medium" ? (
          <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
            lead.priority === "high" || lead.priority === "urgent"
              ? "bg-red-500/10 text-red-400"
              : "bg-white/[0.04] text-white/40"
          }`}>
            {lead.priority as string}
          </span>
        ) : null}
        {(lead?.score as number) > 0 ? (
          <span className="px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider bg-[#c9a96e]/10 text-[#c9a96e]">
            Score: {lead.score as number}/100
          </span>
        ) : null}
      </div>

      {/* Content grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column: Profile + Application data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer profile */}
          {isFullAccess && buyerProfile ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">Buyer Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Budget", buyerProfile.budget_range],
                  ["Timeline", buyerProfile.timeline],
                  ["Investment Type", buyerProfile.investment_type],
                  ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
                  ["Purpose", buyerProfile.purpose],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label as string}>
                      <p className="font-sans text-[10px] uppercase tracking-wider text-white/25">{label as string}</p>
                      <p className="mt-1 font-sans text-[13px] text-white/70">{formatValue(value)}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {/* Application responses */}
          {isFullAccess && Object.keys(stepData).length > 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">Application Data</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stepData)
                  .filter(([key]) => !["submitted_at", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "full_name", "email", "phone"].includes(key))
                  .filter(([, v]) => v !== null && v !== undefined && v !== "")
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="font-sans text-[10px] uppercase tracking-wider text-white/25">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="mt-1 font-sans text-[13px] text-white/70">{formatValue(value)}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {/* Notes from lead */}
          {lead?.notes ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">Lead Notes</h2>
              <p className="font-sans text-[13px] text-white/50 leading-relaxed">{lead.notes as string}</p>
            </div>
          ) : null}

          {!isFullAccess ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <p className="font-sans text-[13px] text-white/30">
                Full profile details are restricted for this assignment.
              </p>
            </div>
          ) : null}
        </div>

        {/* Right column: Activity + Notes */}
        <div className="space-y-6">
          {/* Log contact */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">Log Contact</h2>
            <LogContact leadId={id} />
            <p className="mt-2 font-sans text-[11px] text-white/20">
              Records your outreach so response time is tracked.
            </p>
          </div>

          {/* Add note */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">Add Note</h2>
            <AddNote leadId={id} />
          </div>

          {/* Activity */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">Activity</h2>
            <div className="space-y-4">
              {interactions?.map((i) => {
                const creator = i.creator as Record<string, unknown> | null;
                const typeColors: Record<string, string> = {
                  email: "text-blue-400 bg-blue-400/10",
                  note: "text-white/50 bg-white/[0.04]",
                  status_change: "text-[#c9a96e] bg-[#c9a96e]/10",
                  call: "text-green-400 bg-green-400/10",
                  meeting: "text-purple-400 bg-purple-400/10",
                };
                return (
                  <div key={i.id} className="relative pl-4 border-l border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${typeColors[i.type] || "text-white/40 bg-white/[0.04]"}`}>
                        {i.type}
                      </span>
                      <span className="font-sans text-[10px] text-white/20">
                        {new Date(i.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-white/50 leading-relaxed">{i.content}</p>
                    {creator?.full_name ? (
                      <p className="mt-1 font-sans text-[10px] text-white/15">{creator.full_name as string}</p>
                    ) : null}
                  </div>
                );
              })}
              {(!interactions || interactions.length === 0) ? (
                <p className="font-sans text-[12px] text-white/20">No activity yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
