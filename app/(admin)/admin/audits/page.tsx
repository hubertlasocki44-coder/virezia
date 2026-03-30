import { createClient } from "@/lib/supabase/server";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AuditActions from "./AuditActions";

export default async function AuditsPage() {
  const supabase = await createClient();
  const { data: audits } = await supabase
    .from("audit_requests")
    .select("*, assigned:profiles!audit_requests_assigned_to_fkey(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Paid Audits</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">{audits?.length ?? 0} requests</p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Contact</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Tier</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Property</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Assigned</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Date</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits?.map((a) => (
              <tr key={a.id} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3">
                  <p className="font-sans text-sm text-text-primary">{a.contact_name}</p>
                  <p className="font-sans text-[11px] text-text-muted">{a.contact_email}</p>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-accent-gold">{a.tier.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{a.property_address}</td>
                <td className="px-4 py-3"><AdminStatusBadge status={a.status} /></td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{a.assigned?.full_name || "—"}</td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <AuditActions id={a.id} status={a.status} />
                </td>
              </tr>
            ))}
            {(!audits || audits.length === 0) && (
              <tr><td colSpan={7} className="px-4 py-8 text-center font-sans text-sm text-text-muted">No audit requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
