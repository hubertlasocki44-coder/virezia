import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LeadDetailClient from "./LeadDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: lead },
    { data: buyerProfile },
    { data: interactions },
    { data: assignments },
    { data: application },
    { data: partners },
    { data: employees },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*, client:profiles!leads_client_id_fkey(*), employee:profiles!leads_assigned_employee_fkey(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", (await supabase.from("leads").select("client_id").eq("id", id).single()).data?.client_id ?? "")
      .maybeSingle(),
    supabase
      .from("interactions")
      .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_assignments")
      .select("*, partner:profiles!lead_assignments_partner_id_fkey(*)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("*")
      .eq("user_id", (await supabase.from("leads").select("client_id").eq("id", id).single()).data?.client_id ?? "")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, partner_type, company_name")
      .in("role", ["developer", "agent", "broker", "asset_owner", "service_partner"])
      .eq("status", "active"),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("role", ["employee", "super_admin"]),
  ]);

  if (!lead) notFound();

  return (
    <LeadDetailClient
      lead={lead}
      buyerProfile={buyerProfile}
      interactions={interactions ?? []}
      assignments={assignments ?? []}
      application={application}
      partners={partners ?? []}
      employees={employees ?? []}
    />
  );
}
