import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select(
      "*, client:profiles!leads_client_id_fkey(full_name, email), employee:profiles!leads_assigned_employee_fkey(full_name), lead_assignments(id)"
    )
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: leads } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] font-light text-text-primary">
            Leads Pipeline
          </h1>
          <p className="mt-1 font-sans text-sm text-text-muted">
            {leads?.length ?? 0} total leads
          </p>
        </div>
      </div>

      {/* Status filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={s.value ? `/admin/leads?status=${s.value}` : "/admin/leads"}
            className={`border px-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] transition-colors ${
              params.status === s.value || (!params.status && !s.value)
                ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                : "border-border text-text-muted hover:border-text-muted"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Leads table */}
      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Client
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Priority
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Score
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Source
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Employee
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Partners
              </th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-border-subtle bg-bg-card transition-colors hover:bg-bg-secondary"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-sans text-sm text-text-primary hover:text-accent-gold"
                  >
                    {lead.client?.full_name || lead.client?.email || "Unknown"}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {lead.priority}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {lead.score}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">
                  {lead.source}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {lead.employee?.full_name || "—"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {lead.lead_assignments?.length || 0}
                </td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center font-sans text-sm text-text-muted"
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
