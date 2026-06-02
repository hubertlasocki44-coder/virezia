import { createClient } from "@/lib/supabase/server";
import IncompleteActions from "../incomplete/IncompleteActions";
import { campaignLabel } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

function lc(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

type Row = {
  email: string;
  name: string | null;
  source: string;
  status: "Lead" | "Founding interest" | "Member";
  submits: number;
  joined: string;
};

export default async function CirclePage() {
  const supabase = await createClient();

  // Audience = everyone who left an email via the Circle / Selection funnel.
  // Rejected rows are the soft-archive marker — hidden here.
  const { data: circle } = await supabase
    .from("circle_requests")
    .select("email, status, created_at")
    .order("created_at", { ascending: false });

  // Names + which emails belong to a lead (converted).
  const { data: profiles } = await supabase.from("profiles").select("id, email, full_name");
  const profByEmail = new Map<string, { id: string; full_name: string | null }>();
  for (const p of profiles ?? []) profByEmail.set(lc(p.email), { id: p.id, full_name: p.full_name });

  const { data: leadRows } = await supabase.from("leads").select("client_id");
  const leadClientIds = new Set((leadRows ?? []).map((l) => l.client_id).filter(Boolean));

  // Campaign attribution + founding interest from applications.
  const { data: apps } = await supabase
    .from("applications")
    .select("step_data, user:profiles!applications_user_id_fkey(email)")
    .eq("type", "las_orcas_campaign");
  const appByEmail = new Map<string, { campaign: string; founding: boolean }>();
  for (const a of apps ?? []) {
    const sd = (a.step_data ?? {}) as Record<string, unknown>;
    const email = lc((a.user as { email?: string } | null)?.email || (sd.email as string));
    if (!email) continue;
    appByEmail.set(email, {
      campaign: (sd.campaign as string) || "circle",
      founding: sd.las_orcas_founding_interest === true,
    });
  }

  // Aggregate by email.
  const rows = new Map<string, Row>();
  for (const c of circle ?? []) {
    if (c.status === "rejected") continue;
    const email = lc(c.email);
    if (!email) continue;
    const existing = rows.get(email);
    if (existing) {
      existing.submits += 1;
      if (c.created_at < existing.joined) existing.joined = c.created_at;
      continue;
    }
    const prof = profByEmail.get(email);
    const app = appByEmail.get(email);
    const isLead = prof ? leadClientIds.has(prof.id) : false;
    rows.set(email, {
      email,
      name: prof?.full_name ?? null,
      source: campaignLabel(app?.campaign || "circle"),
      status: isLead ? "Lead" : app?.founding ? "Founding interest" : "Member",
      submits: 1,
      joined: c.created_at,
    });
  }

  const list = Array.from(rows.values()).sort((a, b) => b.joined.localeCompare(a.joined));
  const leads = list.filter((r) => r.status === "Lead").length;
  const founding = list.filter((r) => r.status === "Founding interest").length;

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Circle</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        {list.length} members · {leads} converted to leads · {founding} with founding interest.
        The membership audience across all Selections — not the leads pipeline.
      </p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Email</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Source</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Submits</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Joined</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.email} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm">
                  <a href={`mailto:${r.email}`} className="text-accent-gold hover:text-accent-gold-light">{r.email}</a>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-primary">{r.name || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">{r.source}</td>
                <td className="px-4 py-3 font-sans text-sm">
                  <span
                    className={
                      r.status === "Lead"
                        ? "text-emerald-400"
                        : r.status === "Founding interest"
                        ? "text-accent-gold"
                        : "text-text-secondary"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.submits}</td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">
                  {new Date(r.joined).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <IncompleteActions email={r.email} />
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-sans text-sm text-text-muted">
                  No Circle members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
