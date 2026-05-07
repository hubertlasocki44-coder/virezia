"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { full_name: string; phone: string; company_name: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      company_name: data.company_name,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };
  return { success: true };
}
