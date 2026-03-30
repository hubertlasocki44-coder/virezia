import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import PartnerActions from "./PartnerActions";

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: partners } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["developer", "agent", "broker", "asset_owner", "service_partner"])
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Partners</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        {partners?.length ?? 0} total partners
      </p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Role</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Type</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Company</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners?.map((p) => (
              <tr key={p.id} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3">
                  <Link href={`/admin/partners/${p.id}`} className="font-sans text-sm text-text-primary hover:text-accent-gold">
                    {p.full_name || p.email}
                  </Link>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{p.role.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">{p.partner_type || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{p.company_name || "—"}</td>
                <td className="px-4 py-3"><AdminStatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <PartnerActions id={p.id} status={p.status} />
                </td>
              </tr>
            ))}
            {(!partners || partners.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center font-sans text-sm text-text-muted">No partners yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
