"use server";

import { createClient } from "@/lib/supabase/server";
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
