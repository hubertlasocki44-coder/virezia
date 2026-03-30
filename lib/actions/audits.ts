"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth-guard";

export async function getAuditRequests(status?: string) {
  await requireEmployee();
  const supabase = await createClient();
  let query = supabase
    .from("audit_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateAuditStatus(id: string, status: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { error } = await supabase
    .from("audit_requests")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/audits");
}

export async function assignAudit(id: string, employeeId: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { error } = await supabase
    .from("audit_requests")
    .update({ assigned_to: employeeId, status: "in_progress" })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/audits");
}
