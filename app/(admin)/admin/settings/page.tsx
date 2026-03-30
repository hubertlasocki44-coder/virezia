import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    redirect("/admin");
  }

  // Gather platform diagnostics server-side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendConfigured = !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "your-resend-api-key-here";
  const serviceRoleConfigured = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Count platform stats
  const [
    { count: totalUsers },
    { count: totalLeads },
    { count: totalPartners },
    { count: totalAudits },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).in("role", ["developer", "agent", "broker", "asset_owner", "service_partner"]),
    supabase.from("audit_requests").select("*", { count: "exact", head: true }),
  ]);

  // Get current user session info
  const { data: sessionData } = await supabase.auth.getSession();
  const sessionExpiry = sessionData?.session?.expires_at
    ? new Date(sessionData.session.expires_at * 1000).toLocaleString()
    : "Unknown";

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">
        Settings
      </h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Platform configuration and diagnostics
      </p>

      {/* Platform Info */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Platform
        </p>
        <div className="mt-4 border border-border bg-bg-card">
          <dl className="divide-y divide-border-subtle">
            <SettingsRow label="Entity" value="KONAMIYA LLC" />
            <SettingsRow label="Platform" value="VIREZIA" />
            <SettingsRow label="Version" value="0.1.0" />
            <SettingsRow label="Environment" value={process.env.NODE_ENV ?? "development"} />
            <SettingsRow label="Site URL" value={siteUrl} />
            <SettingsRow
              label="Total records"
              value={`${totalUsers ?? 0} users / ${totalLeads ?? 0} leads / ${totalPartners ?? 0} partners / ${totalAudits ?? 0} audits`}
            />
          </dl>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Infrastructure
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="Supabase"
            status={supabaseConfigured ? "connected" : "missing"}
            detail={supabaseConfigured ? supabaseUrl.replace("https://", "").split(".")[0] + "..." : "Not configured"}
          />
          <StatusCard
            label="Email (Resend)"
            status={resendConfigured ? "connected" : "missing"}
            detail={resendConfigured ? "API key configured" : "No API key"}
          />
          <StatusCard
            label="Service Role"
            status={serviceRoleConfigured ? "connected" : "missing"}
            detail={serviceRoleConfigured ? "Key present" : "Not configured"}
          />
          <StatusCard
            label="Auth"
            status="connected"
            detail="Supabase Auth"
          />
        </div>
      </div>

      {/* Email Configuration */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Email Configuration
        </p>
        <div className="mt-4 border border-border bg-bg-card">
          <dl className="divide-y divide-border-subtle">
            <SettingsRow label="Provider" value="Resend" />
            <SettingsRow
              label="Status"
              value={resendConfigured ? "Active" : "Inactive -- add RESEND_API_KEY to .env"}
              highlight={!resendConfigured}
            />
            <SettingsRow label="From address" value="VIREZIA <onboarding@resend.dev>" />
            <SettingsRow label="Notification target" value="hello@virezia.com" />
            <SettingsRow
              label="Triggers"
              value="New applications, circle requests, partner submissions"
            />
          </dl>
        </div>
      </div>

      {/* Commission Settings (client component for interactivity) */}
      <SettingsClient />

      {/* Security */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Security
        </p>
        <div className="mt-4 border border-border bg-bg-card">
          <dl className="divide-y divide-border-subtle">
            <SettingsRow label="Auth provider" value="Supabase Auth (email + magic link)" />
            <SettingsRow label="Session expiry" value={sessionExpiry} />
            <SettingsRow label="Admin access" value="super_admin and employee roles only" />
            <SettingsRow label="RLS" value="Enabled on all tables" />
            <SettingsRow
              label="Signed in as"
              value={user.email ?? "Unknown"}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="font-sans text-sm text-text-muted">{label}</dt>
      <dd
        className={`font-sans text-sm ${
          highlight ? "text-yellow-400" : "text-text-primary"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function StatusCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: "connected" | "missing";
  detail: string;
}) {
  return (
    <div className="border border-border bg-bg-card p-6">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            status === "connected" ? "bg-emerald-400" : "bg-yellow-400"
          }`}
        />
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          {label}
        </p>
      </div>
      <p className="mt-2 font-serif text-[18px] font-light text-text-primary capitalize">
        {status}
      </p>
      <p className="mt-1 font-sans text-[12px] text-text-secondary">{detail}</p>
    </div>
  );
}
