import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ApplicationActions from "./ApplicationActions";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, user:profiles!applications_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">
        Applications
      </h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        {applications?.length ?? 0} total applications
      </p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Applicant</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Type</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Date</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app) => (
              <tr key={app.id} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm text-text-primary">
                  {app.user?.full_name || app.user?.email || (app.step_data as Record<string, unknown>)?.full_name as string || "Anonymous"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{app.type}</td>
                <td className="px-4 py-3"><AdminStatusBadge status={app.status} /></td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <ApplicationActions id={app.id} status={app.status} hasUser={!!app.user_id} />
                </td>
              </tr>
            ))}
            {(!applications || applications.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-sans text-sm text-text-muted">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
