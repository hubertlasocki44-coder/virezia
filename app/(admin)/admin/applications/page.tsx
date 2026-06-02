import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ApplicationActions from "./ApplicationActions";
import { campaignFromApplication, campaignLabel } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "All" },
  { value: "apply", label: "Private Access" },
  { value: "partner", label: "Partner / Owner" },
  { value: "las_orcas", label: "Las Orcas" },
  { value: "circle", label: "Circle" },
];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, user:profiles!applications_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  const withCampaign = (applications ?? []).map((app) => ({
    ...app,
    campaign: campaignFromApplication(app.type, app.step_data as Record<string, unknown>),
  }));
  const filtered = params.campaign
    ? withCampaign.filter((a) => a.campaign === params.campaign)
    : withCampaign;

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Applications</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        {filtered.length} {params.campaign ? campaignLabel(params.campaign) : "total"} applications
      </p>

      {/* Campaign / type filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (params.campaign ?? "") === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/admin/applications?campaign=${f.value}` : "/admin/applications"}
              className={`border px-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] transition-colors ${
                active
                  ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                  : "border-border text-text-muted hover:border-text-muted"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Applicant</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Campaign</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Type</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Date</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm text-text-primary">
                  <Link href={`/admin/applications/${app.id}`} className="text-accent-gold hover:text-accent-gold-light">
                    {app.user?.full_name || app.user?.email || (app.step_data as Record<string, unknown>)?.full_name as string || "Anonymous"}
                  </Link>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{campaignLabel(app.campaign)}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">{app.type}</td>
                <td className="px-4 py-3"><AdminStatusBadge status={app.status} /></td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <ApplicationActions id={app.id} status={app.status} hasUser={!!app.user_id} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-sans text-sm text-text-muted">
                  No applications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
