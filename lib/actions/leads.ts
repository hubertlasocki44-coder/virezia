"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployeeWithModule } from "@/lib/auth-guard";
import type { LeadStatus, LeadPriority } from "@/lib/types";

export async function getLeads(filters?: {
  status?: string;
  priority?: string;
  source?: string;
}) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*, client:profiles!leads_client_id_fkey(*), employee:profiles!leads_assigned_employee_fkey(full_name)")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.priority) query = query.eq("priority", filters.priority);
  if (filters?.source) query = query.eq("source", filters.source);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getLead(id: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, client:profiles!leads_client_id_fkey(*), employee:profiles!leads_assigned_employee_fkey(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadPriority(id: string, priority: LeadPriority) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ priority })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/leads");
}

export async function updateLeadScore(id: string, score: number) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ score })
    .eq("id", id);
  if (error) throw error;
  revalidatePath(`/admin/leads/${id}`);
}

export async function assignEmployee(leadId: string, employeeId: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ assigned_employee: employeeId })
    .eq("id", leadId);
  if (error) throw error;
  revalidatePath("/admin/leads");
}

// Soft action: hide from the active pipeline but keep the record + history.
export async function archiveLead(id: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

// Hard delete: irreversible. interactions + lead_assignments cascade automatically.
export async function deleteLead(id: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/leads");
}

// --- Incomplete captures (Circle / Las Orcas funnel, not yet leads) ---------
// circle_requests has no UPDATE/DELETE RLS policy, so these use the service
// client. The requireEmployeeWithModule guard above enforces access.

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// Soft: mark the capture rejected/archived so it drops off the incomplete view.
export async function archiveIncompleteCapture(email: string) {
  await requireEmployeeWithModule("leads");
  const svc = await createServiceClient();
  const lower = normalizeEmail(email);

  await svc.from("circle_requests").update({ status: "rejected" }).ilike("email", lower);

  const { data: profile } = await svc
    .from("profiles")
    .select("id")
    .ilike("email", lower)
    .maybeSingle();
  if (profile) {
    await svc
      .from("applications")
      .update({ status: "archived" })
      .eq("user_id", profile.id)
      .eq("type", "las_orcas_campaign");
  }
  revalidatePath("/admin/circle");
  revalidatePath("/admin/leads");
}

// Hard: purge the raw Circle signups + the campaign application for this email.
// Leaves the auth user/profile intact (avoids cascading account deletion).
export async function deleteIncompleteCapture(email: string) {
  await requireEmployeeWithModule("leads");
  const svc = await createServiceClient();
  const lower = normalizeEmail(email);

  await svc.from("circle_requests").delete().ilike("email", lower);

  const { data: profile } = await svc
    .from("profiles")
    .select("id")
    .ilike("email", lower)
    .maybeSingle();
  if (profile) {
    await svc
      .from("applications")
      .delete()
      .eq("user_id", profile.id)
      .eq("type", "las_orcas_campaign");
  }
  revalidatePath("/admin/circle");
  revalidatePath("/admin/leads");
}

// --- Bulk actions -----------------------------------------------------------

export async function bulkArchiveLeads(ids: string[]) {
  await requireEmployeeWithModule("leads");
  if (!ids.length) return;
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status: "archived" }).in("id", ids);
  if (error) throw error;
  revalidatePath("/admin/leads");
}

export async function bulkDeleteLeads(ids: string[]) {
  await requireEmployeeWithModule("leads");
  if (!ids.length) return;
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().in("id", ids);
  if (error) throw error;
  revalidatePath("/admin/leads");
}

export async function bulkArchiveCaptures(emails: string[]) {
  await requireEmployeeWithModule("leads");
  if (!emails.length) return;
  const svc = await createServiceClient();
  const lowers = emails.map(normalizeEmail);
  await svc.from("circle_requests").update({ status: "rejected" }).in("email", lowers);
  const { data: profs } = await svc.from("profiles").select("id").in("email", lowers);
  for (const p of profs ?? []) {
    await svc.from("applications").update({ status: "archived" }).eq("user_id", p.id).eq("type", "las_orcas_campaign");
  }
  revalidatePath("/admin/circle");
  revalidatePath("/admin/leads");
}

export async function bulkDeleteCaptures(emails: string[]) {
  await requireEmployeeWithModule("leads");
  if (!emails.length) return;
  const svc = await createServiceClient();
  const lowers = emails.map(normalizeEmail);
  await svc.from("circle_requests").delete().in("email", lowers);
  const { data: profs } = await svc.from("profiles").select("id").in("email", lowers);
  for (const p of profs ?? []) {
    await svc.from("applications").delete().eq("user_id", p.id).eq("type", "las_orcas_campaign");
  }
  revalidatePath("/admin/circle");
  revalidatePath("/admin/leads");
}

// --- Add to campaign (assign to a campaign's partners) ----------------------

// Campaigns that have partners to assign to. Las Orcas = developers whose
// company_name matches; extend here as new Selections onboard partners.
async function getCampaignPartnerIds(
  svc: Awaited<ReturnType<typeof createServiceClient>>,
  campaign: string
): Promise<string[]> {
  if (campaign === "las_orcas") {
    const { data } = await svc
      .from("profiles")
      .select("id")
      .eq("role", "developer")
      .ilike("company_name", "%Las Orcas%");
    return (data ?? []).map((p) => p.id);
  }
  return [];
}

async function assignLeadToPartners(
  svc: Awaited<ReturnType<typeof createServiceClient>>,
  leadId: string,
  partnerIds: string[],
  assignedBy: string,
  note: string
) {
  for (const pid of partnerIds) {
    const { data: existing } = await svc
      .from("lead_assignments")
      .select("id")
      .eq("lead_id", leadId)
      .eq("partner_id", pid)
      .maybeSingle();
    if (existing) continue;
    await svc.from("lead_assignments").insert({
      lead_id: leadId,
      partner_id: pid,
      visibility_level: "full",
      status: "active",
      assigned_by: assignedBy,
      notes: note,
    });
  }
}

// Existing leads → assign to a campaign's partners (full visibility).
export async function addLeadsToCampaign(leadIds: string[], campaign: string) {
  await requireEmployeeWithModule("leads");
  if (!leadIds.length) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const svc = await createServiceClient();
  const partnerIds = await getCampaignPartnerIds(svc, campaign);
  for (const leadId of leadIds) {
    await assignLeadToPartners(svc, leadId, partnerIds, user.id, `Added to ${campaign} campaign`);
  }
  revalidatePath("/admin/leads");
}

// Incomplete captures (email + consent) → promote to a low-priority lead, then
// assign to the campaign's partners (preview). One click from the Incomplete tab.
export async function addCapturesToCampaign(emails: string[], campaign: string) {
  await requireEmployeeWithModule("leads");
  if (!emails.length) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const svc = await createServiceClient();
  const partnerIds = await getCampaignPartnerIds(svc, campaign);

  for (const emailRaw of emails) {
    const email = normalizeEmail(emailRaw);
    const { data: profile } = await svc.from("profiles").select("id").ilike("email", email).maybeSingle();
    if (!profile) continue;

    // Find or create a low-priority lead for this person.
    const { data: existingLead } = await svc.from("leads").select("id").eq("client_id", profile.id).maybeSingle();
    let leadId = existingLead?.id as string | undefined;
    if (!leadId) {
      const { data: created } = await svc
        .from("leads")
        .insert({
          client_id: profile.id,
          status: "new",
          source: campaign === "las_orcas" ? "circle" : "manual",
          priority: "low",
          notes: `Promoted from ${campaign} capture (email + consent).`,
        })
        .select("id")
        .single();
      leadId = created?.id;
    }
    if (!leadId) continue;

    await assignLeadToPartners(svc, leadId, partnerIds, user.id, `Added to ${campaign} campaign (preview)`);
  }
  revalidatePath("/admin/leads");
  revalidatePath("/admin/circle");
}
