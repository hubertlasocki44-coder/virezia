import { createClient } from "@/lib/supabase/server";
import AdminCard from "@/components/admin/AdminCard";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch pipeline metrics
  const [
    { count: totalLeads },
    { count: newLeads },
    { count: screeningLeads },
    { count: qualifiedLeads },
    { count: matchedLeads },
    { count: inProgressLeads },
    { count: closedWonLeads },
    { count: pendingApps },
    { count: totalPartners },
    { count: pendingAudits },
    { data: recentInteractions },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "screening"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "qualified"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "matched"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "closed_won"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).in("role", ["developer", "agent", "broker", "asset_owner", "service_partner"]),
    supabase.from("audit_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("interactions").select("id, type, content, created_at, created_by").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">
        Dashboard
      </h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Weekly KPI overview
      </p>

      {/* Buyer side metrics */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Buyer Pipeline
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminCard label="Total Leads" value={totalLeads ?? 0} />
          <AdminCard label="New" value={newLeads ?? 0} sub="Awaiting screening" />
          <AdminCard label="Qualified" value={qualifiedLeads ?? 0} sub="Ready for matching" />
          <AdminCard label="In Progress" value={inProgressLeads ?? 0} sub="Active engagements" />
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Pipeline Status
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <AdminCard label="Screening" value={screeningLeads ?? 0} />
          <AdminCard label="Matched" value={matchedLeads ?? 0} />
          <AdminCard label="Closed Won" value={closedWonLeads ?? 0} />
          <AdminCard label="Pending Apps" value={pendingApps ?? 0} />
          <AdminCard label="Partners" value={totalPartners ?? 0} />
          <AdminCard label="Pending Audits" value={pendingAudits ?? 0} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/leads"
          className="border border-border bg-bg-card px-5 py-2.5 font-sans text-sm text-text-secondary transition-colors hover:border-accent-gold/30 hover:text-text-primary"
        >
          View Pipeline
        </Link>
        <Link
          href="/admin/applications"
          className="border border-border bg-bg-card px-5 py-2.5 font-sans text-sm text-text-secondary transition-colors hover:border-accent-gold/30 hover:text-text-primary"
        >
          Screen Applications
        </Link>
        <Link
          href="/admin/partners"
          className="border border-border bg-bg-card px-5 py-2.5 font-sans text-sm text-text-secondary transition-colors hover:border-accent-gold/30 hover:text-text-primary"
        >
          Manage Partners
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Recent Activity
        </p>
        <div className="mt-4 border border-border bg-bg-card">
          {recentInteractions && recentInteractions.length > 0 ? (
            <ul className="divide-y divide-border-subtle">
              {recentInteractions.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-accent-gold">
                      {item.type}
                    </span>
                    <span className="font-sans text-sm text-text-secondary line-clamp-1">
                      {item.content}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center font-sans text-sm text-text-muted">
              No recent activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
