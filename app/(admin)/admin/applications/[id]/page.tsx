import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ApplicationActions from "../ApplicationActions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("applications")
    .select("*, user:profiles!applications_user_id_fkey(full_name, email, phone, role, status)")
    .eq("id", id)
    .single();

  if (!app) return notFound();

  const stepData = (app.step_data || {}) as Record<string, unknown>;

  return (
    <div>
      <Link
        href="/admin/applications"
        className="font-sans text-[12px] text-text-muted hover:text-text-secondary"
      >
        &larr; All Applications
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[28px] font-light text-text-primary">
            {app.user?.full_name || (stepData.full_name as string) || "Anonymous"}
          </h1>
          <p className="mt-1 font-sans text-sm text-text-muted">
            {app.user?.email || (stepData.email as string) || "No email"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AdminStatusBadge status={app.status} />
          <ApplicationActions id={app.id} status={app.status} hasUser={!!app.user_id} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Left: Application Info */}
        <div className="border border-border bg-bg-card p-6">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">
            Application
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Type</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">{app.type}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">{app.status}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Submitted</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">
                {new Date(app.created_at).toLocaleString()}
              </dd>
            </div>
            {app.notes && (
              <div>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Notes</dt>
                <dd className="font-sans text-sm text-text-secondary mt-1">{app.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Right: Contact Info */}
        <div className="border border-border bg-bg-card p-6">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">
            Contact
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">
                {app.user?.full_name || (stepData.full_name as string) || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Email</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">
                <a href={`mailto:${app.user?.email || stepData.email}`} className="text-accent-gold hover:text-accent-gold-light">
                  {app.user?.email || (stepData.email as string) || "N/A"}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Phone</dt>
              <dd className="font-sans text-sm text-text-primary mt-1">
                {app.user?.phone || (stepData.phone as string) || "N/A"}
              </dd>
            </div>
            {stepData.source ? (
              <div>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Source</dt>
                <dd className="font-sans text-sm text-text-primary mt-1">{String(stepData.source)}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      {/* Form Data */}
      <div className="mt-6 border border-border bg-bg-card p-6">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">
          Form Data
        </h3>
        <dl className="grid gap-4 md:grid-cols-2">
          {Object.entries(stepData)
            .filter(([key]) => !["full_name", "email", "phone", "source", "submitted_at"].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
                  {key.replace(/_/g, " ")}
                </dt>
                <dd className="font-sans text-sm text-text-primary mt-1">
                  {typeof value === "boolean"
                    ? value ? "Yes" : "No"
                    : Array.isArray(value)
                    ? value.join(", ")
                    : String(value ?? "N/A")}
                </dd>
              </div>
            ))}
        </dl>
      </div>

      {/* UTM Tracking */}
      {(stepData.utm_source || stepData.utm_medium || stepData.utm_campaign) ? (
        <div className="mt-6 border border-border bg-bg-card p-6">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-accent-gold mb-4">
            Attribution
          </h3>
          <div className="flex flex-wrap gap-4">
            {stepData.utm_source ? (
              <span className="font-sans text-[12px] text-text-secondary">
                Source: <span className="text-text-primary">{String(stepData.utm_source)}</span>
              </span>
            ) : null}
            {stepData.utm_medium ? (
              <span className="font-sans text-[12px] text-text-secondary">
                Medium: <span className="text-text-primary">{String(stepData.utm_medium)}</span>
              </span>
            ) : null}
            {stepData.utm_campaign ? (
              <span className="font-sans text-[12px] text-text-secondary">
                Campaign: <span className="text-text-primary">{String(stepData.utm_campaign)}</span>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
