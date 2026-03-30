"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth-guard";

export async function getApplications(status?: string) {
  await requireEmployee();
  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select("*, user:profiles!applications_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(id: string, status: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/applications");
}

export async function convertToLead(applicationId: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (!app) throw new Error("Application not found");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create lead
  const { error: leadError } = await supabase.from("leads").insert({
    client_id: app.user_id,
    status: "new",
    source: "apply",
    assigned_employee: user?.id,
  });

  if (leadError) throw leadError;

  // Update application status
  await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  revalidatePath("/admin/applications");
  revalidatePath("/admin/leads");
}
