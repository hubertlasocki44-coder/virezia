import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StatusChanger, AddNote, LogContact } from "./LeadActions";
import ContactBadge from "@/components/ContactBadge";
import { computeLeadHealth } from "@/lib/leads-health";
import LeadDetailLang from "./LeadDetailLang";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PartnerLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const serviceSupabase = await createServiceClient();

  const { data: assignment } = await serviceSupabase
    .from("lead_assignments")
    .select("*, lead:leads(*, client:profiles!leads_client_id_fkey(*))")
    .eq("lead_id", id)
    .eq("partner_id", user.id)
    .eq("status", "active")
    .single();

  if (!assignment) notFound();

  const lead = assignment.lead as Record<string, unknown>;
  const client = lead?.client as Record<string, unknown>;
  const isFullAccess = assignment.visibility_level === "full";

  let buyerProfile: Record<string, unknown> | null = null;
  if (isFullAccess && client?.id) {
    const { data } = await serviceSupabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", client.id as string)
      .maybeSingle();
    buyerProfile = data;
  }

  let applicationData: Record<string, unknown> | null = null;
  if (isFullAccess && client?.id) {
    const { data } = await serviceSupabase
      .from("applications")
      .select("step_data, type, status, created_at")
      .eq("user_id", client.id as string)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    applicationData = data;
  }

  const stepData = (applicationData?.step_data || {}) as Record<string, unknown>;

  const { data: interactions } = await serviceSupabase
    .from("interactions")
    .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
    .eq("lead_id", id)
    .eq("visible_to_partner", true)
    .order("created_at", { ascending: false });

  const health = computeLeadHealth({
    assignedAt: assignment.created_at as string,
    partnerId: user.id,
    status: lead?.status as string,
    interactions: (interactions || []).map((i) => ({
      created_by: i.created_by,
      created_at: i.created_at,
      type: i.type,
    })),
  });

  const formatValue = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const initials = ((client?.full_name as string) || (client?.email as string) || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <LeadDetailLang
      leadId={id}
      currentStatus={lead?.status as string}
      health={{ state: health.state, label: health.label }}
      isFullAccess={isFullAccess}
      clientEmail={client?.email as string | undefined}
      clientPhone={client?.phone as string | undefined}
      buyerProfile={buyerProfile}
      stepData={stepData}
      leadNotes={lead?.notes as string | null}
      interactions={(interactions || []).map((i) => ({
        id: i.id,
        type: i.type,
        created_at: i.created_at,
        content: i.content,
        creator: i.creator as { full_name?: string } | null,
      }))}
      formatValue={formatValue}
      initials={initials}
      clientName={(client?.full_name as string) || "Client"}
      score={(lead?.score as number) || 0}
      priority={(lead?.priority as string) || "medium"}
    />
  );
}
