import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Link from "next/link";
import { StatusChanger, AddNote } from "./LeadActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PartnerLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const serviceSupabase = await createServiceClient();

  // Get assignment + lead + client
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

  // Get buyer profile
  let buyerProfile: Record<string, unknown> | null = null;
  if (isFullAccess && client?.id) {
    const { data } = await serviceSupabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", client.id as string)
      .maybeSingle();
    buyerProfile = data;
  }

  // Get application step_data (form responses)
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

  // Get visible interactions
  const { data: interactions } = await serviceSupabase
    .from("interactions")
    .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
    .eq("lead_id", id)
    .eq("visible_to_partner", true)
    .order("created_at", { ascending: false });

  // Format label
  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatValue = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "—";
    return String(value);
  };

  return (
    <div>
      <Link href="/dashboard" className="font-sans text-[12px] text-text-muted hover:text-text-secondary">
        &larr; Back to Dashboard
      </Link>

      <h1 className="mt-4 font-serif text-[28px] font-light text-text-primary">
        {(client?.full_name as string) || "Client"}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <StatusChanger leadId={id} currentStatus={lead?.status as string} />
        {lead?.priority ? (
          <span className="font-sans text-[11px] text-text-muted">
            Priority: {lead.priority as string}
          </span>
        ) : null}
        {lead?.score ? (
          <span className="font-sans text-[11px] text-accent-gold">
            Score: {lead.score as number}/100
          </span>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Client contact */}
        <div className="border border-border bg-bg-card p-6">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">Contact</h2>
          <dl className="space-y-3">
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</dt>
              <dd className="mt-0.5 font-sans text-sm text-text-primary">{(client?.full_name as string) || "—"}</dd>
            </div>
            {isFullAccess ? (
              <>
                <div>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Email</dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-primary">
                    <a href={`mailto:${client?.email}`} className="text-accent-gold hover:text-accent-gold-light">
                      {(client?.email as string) || "—"}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Phone</dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-primary">{(client?.phone as string) || "—"}</dd>
                </div>
              </>
            ) : null}
          </dl>
        </div>

        {/* Buyer profile */}
        {isFullAccess && buyerProfile ? (
          <div className="border border-border bg-bg-card p-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">Buyer Profile</h2>
            <dl className="space-y-3">
              {[
                ["Budget Range", buyerProfile.budget_range],
                ["Timeline", buyerProfile.timeline],
                ["Investment Type", buyerProfile.investment_type],
                ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
                ["Purpose", buyerProfile.purpose],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{label as string}</dt>
                    <dd className="mt-0.5 font-sans text-sm text-text-primary">{formatValue(value)}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ) : null}

        {!isFullAccess ? (
          <div className="border border-border bg-bg-card p-6">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">Limited Access</h2>
            <p className="mt-2 font-sans text-sm text-text-muted">
              Full buyer profile details are restricted for this assignment.
            </p>
          </div>
        ) : null}
      </div>

      {/* Application form data */}
      {isFullAccess && Object.keys(stepData).length > 0 ? (
        <div className="mt-6 border border-border bg-bg-card p-6">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">
            Application Responses
          </h2>
          <dl className="grid gap-4 md:grid-cols-2">
            {Object.entries(stepData)
              .filter(([key]) => !["submitted_at", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                    {formatLabel(key)}
                  </dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-primary">
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      ) : null}

      {/* Lead notes */}
      {lead?.notes ? (
        <div className="mt-6 border border-border bg-bg-card p-6">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">Notes</h2>
          <p className="font-sans text-sm text-text-secondary">{lead.notes as string}</p>
        </div>
      ) : null}

      {/* Add note */}
      <div className="mt-8">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-2">Add Note</h2>
        <AddNote leadId={id} />
      </div>

      {/* Interaction history */}
      <div className="mt-8">
        <h2 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">Activity</h2>
        <div className="mt-4 space-y-3">
          {interactions?.map((i) => (
            <div key={i.id} className="border border-border-subtle bg-bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-accent-gold">{i.type}</span>
                <span className="font-sans text-[11px] text-text-muted">
                  {new Date(i.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 font-sans text-sm text-text-secondary">{i.content}</p>
            </div>
          ))}
          {(!interactions || interactions.length === 0) ? (
            <p className="font-sans text-sm text-text-muted">No visible activity yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
