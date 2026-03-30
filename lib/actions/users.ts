"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee, requireSuperAdmin } from "@/lib/auth-guard";
import type { UserRole, EmployeeModule } from "@/lib/types";

export async function getUsers() {
  await requireEmployee();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, employee_permissions(modules)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserRole) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/admin/users");
}

export async function updateUserStatus(userId: string, status: string) {
  await requireSuperAdmin();
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
  await requireSuperAdmin();
  const supabase = await createClient();

  // Upsert employee_permissions
  const { error } = await supabase.from("employee_permissions").upsert(
    { user_id: userId, modules },
    { onConflict: "user_id" }
  );

  if (error) throw error;
  revalidatePath("/admin/users");
}
