"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee, requireSuperAdmin } from "@/lib/auth-guard";

export async function getPartners(status?: string) {
  await requireEmployee();
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .in("role", ["developer", "agent", "broker", "asset_owner", "service_partner"])
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function approvePartner(id: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "active", verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/partners");
}

export async function suspendPartner(id: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "suspended" })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/partners");
}

export async function rejectPartner(id: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/partners");
}
