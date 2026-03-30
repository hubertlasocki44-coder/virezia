import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

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
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("lead_assignments")
    .select("*, lead:leads(*, client:profiles!leads_client_id_fkey(full_name, email))")
    .eq("partner_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { count: totalAssigned } = await supabase
    .from("lead_assignments")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", userId);

  const { count: activeCount } = await supabase
    .from("lead_assignments")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", userId)
    .eq("status", "active");

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">
        Welcome, {(profile.full_name as string)?.split(" ")[0] || "there"}.
      </h1>
      {profile.company_name ? (
        <p className="mt-1 font-sans text-sm text-text-muted">{profile.company_name as string}</p>
      ) : null}

      {/* Verification status */}
      <div className="mt-6">
        <AdminStatusBadge status={profile.status as string} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-bg-card p-6">
          <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Total Leads</p>
          <p className="mt-2 font-serif text-[32px] font-light text-text-primary">{totalAssigned ?? 0}</p>
        </div>
        <div className="border border-border bg-bg-card p-6">
          <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Active</p>
          <p className="mt-2 font-serif text-[32px] font-light text-text-primary">{activeCount ?? 0}</p>
        </div>
      </div>

      {/* Assigned leads */}
      <div className="mt-8">
        <h2 className="font-serif text-lg text-text-primary">Assigned Leads</h2>
        <div className="mt-4 space-y-3">
          {assignments?.map((a) => {
            const lead = a.lead as Record<string, unknown> | null;
            const client = lead?.client as Record<string, unknown> | null;

            return (
              <Link
                key={a.id}
                href={`/leads/${lead?.id}`}
                className="block border border-border bg-bg-card p-4 transition-colors hover:border-accent-gold/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm text-text-primary">
                      {(client?.full_name as string) || (client?.email as string)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <AdminStatusBadge status={lead?.status as string} />
                      <span className="font-sans text-[11px] text-text-muted">
                        {a.visibility_level} access
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-[12px] text-text-muted">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            );
          })}
          {(!assignments || assignments.length === 0) && (
            <p className="font-sans text-sm text-text-muted">No assigned leads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
