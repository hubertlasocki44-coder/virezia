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
