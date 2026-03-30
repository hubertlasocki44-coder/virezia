"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserRole, EmployeeModule } from "@/lib/types";

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, employee_permissions(modules)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin/users");
}

export async function updateUserStatus(userId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin/users");
}

export async function updateEmployeeModules(
  userId: string,
  modules: EmployeeModule[]
) {
  const supabase = await createClient();

  // Upsert employee_permissions
  const { error } = await supabase.from("employee_permissions").upsert(
    { user_id: userId, modules },
    { onConflict: "user_id" }
  );

  if (error) throw error;
  revalidatePath("/admin/users");
}
