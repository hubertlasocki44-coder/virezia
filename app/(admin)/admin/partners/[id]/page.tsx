import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: partner }, { data: assignments }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase
      .from("lead_assignments")
      .select("*, lead:leads(*, client:profiles!leads_client_id_fkey(full_name, email))")
      .eq("partner_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!partner) notFound();

  return (
    <div>
      <Link href="/admin/partners" className="font-sans text-[12px] text-text-muted hover:text-text-secondary">
        ← Back to Partners
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <h1 className="font-serif text-[28px] font-light text-text-primary">
          {partner.full_name || partner.email}
        </h1>
        <AdminStatusBadge status={partner.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-bg-card p-6">
          <h3 className="font-serif text-lg text-text-primary">Profile</h3>
          <dl className="mt-4 space-y-3">
            {[
              ["Email", partner.email],
              ["Phone", partner.phone],
              ["Company", partner.company_name],
              ["Role", partner.role.replace(/_/g, " ")],
              ["Partner Type", partner.partner_type],
              ["Verified At", partner.verified_at ? new Date(partner.verified_at).toLocaleDateString() : null],
              ["Joined", new Date(partner.created_at).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{label as string}</dt>
                <dd className="mt-0.5 font-sans text-sm text-text-secondary">{(value as string) || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border border-border bg-bg-card p-6">
          <h3 className="font-serif text-lg text-text-primary">
            Assigned Leads ({assignments?.length ?? 0})
          </h3>
          <div className="mt-4 space-y-3">
            {assignments?.map((a) => {
              const lead = a.lead as Record<string, unknown> | null;
              const client = lead?.client as Record<string, unknown> | null;
              return (
                <div key={a.id} className="border border-border-subtle bg-bg-primary p-3">
                  <p className="font-sans text-sm text-text-primary">
                    {(client?.full_name as string) || (client?.email as string)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <AdminStatusBadge status={a.status} />
                    <span className="font-sans text-[11px] text-text-muted">{a.visibility_level} access</span>
                  </div>
                </div>
              );
            })}
            {(!assignments || assignments.length === 0) && (
              <p className="font-sans text-sm text-text-muted">No assigned leads.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
