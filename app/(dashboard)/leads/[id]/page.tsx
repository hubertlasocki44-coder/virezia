import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Link from "next/link";

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

  // Get assignment for this partner + lead
  const { data: assignment } = await supabase
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

  // Get buyer profile if full access
  let buyerProfile: Record<string, unknown> | null = null;
  if (isFullAccess) {
    const { data } = await supabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", client?.id as string)
      .maybeSingle();
    buyerProfile = data;
  }

  // Get visible interactions
  const { data: interactions } = await supabase
    .from("interactions")
    .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
    .eq("lead_id", id)
    .eq("visible_to_partner", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/dashboard" className="font-sans text-[12px] text-text-muted hover:text-text-secondary">
        ← Back to Dashboard
      </Link>

      <h1 className="mt-4 font-serif text-[28px] font-light text-text-primary">
        {(client?.full_name as string) || "Client"}
      </h1>
      <div className="mt-2 flex items-center gap-3">
        <AdminStatusBadge status={lead?.status as string} />
        <span className="font-sans text-[11px] text-text-muted">
          {assignment.visibility_level} access
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Client info */}
        <div className="border border-border bg-bg-card p-6">
          <h2 className="font-serif text-lg text-text-primary">Client Profile</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</dt>
              <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(client?.full_name as string) || "—"}</dd>
            </div>
            {isFullAccess && (
              <>
                <div>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Email</dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(client?.email as string) || "—"}</dd>
                </div>
                <div>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Phone</dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(client?.phone as string) || "—"}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Buyer profile (full access only) */}
        {isFullAccess && buyerProfile && (
          <div className="border border-border bg-bg-card p-6">
            <h2 className="font-serif text-lg text-text-primary">Buyer Profile</h2>
            <dl className="mt-4 space-y-3">
              {[
                ["Budget", buyerProfile.budget_range],
                ["Timeline", buyerProfile.timeline],
                ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
                ["Investment Type", buyerProfile.investment_type],
                ["Purpose", buyerProfile.purpose],
                ["Preferences", buyerProfile.lifestyle_preferences],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{label as string}</dt>
                  <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(value as string) || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {!isFullAccess && (
          <div className="border border-border bg-bg-card p-6">
            <h2 className="font-serif text-lg text-text-primary">Limited Access</h2>
            <p className="mt-2 font-sans text-sm text-text-muted">
              Full buyer profile details are restricted for this assignment.
              Contact your VIREZIA representative for more information.
            </p>
          </div>
        )}
      </div>

      {/* Interaction history */}
      <div className="mt-8">
        <h2 className="font-serif text-lg text-text-primary">Activity</h2>
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
          {(!interactions || interactions.length === 0) && (
            <p className="font-sans text-sm text-text-muted">No visible activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
