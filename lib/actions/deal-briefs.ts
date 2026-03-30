"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployeeWithModule } from "@/lib/auth-guard";

export async function getDealBriefs() {
  await requireEmployeeWithModule("briefs");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("deal_briefs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createDealBrief(brief: {
  template_type: string;
  content: string;
  metrics: Record<string, unknown>;
  published?: boolean;
}) {
  await requireEmployeeWithModule("briefs");
  const supabase = await createClient();
  const { error } = await supabase.from("deal_briefs").insert(brief);
  if (error) throw error;
  revalidatePath("/admin/briefs");
}

export async function updateDealBrief(
  id: string,
  updates: Partial<{
    content: string;
    metrics: Record<string, unknown>;
    published: boolean;
  }>
) {
  await requireEmployeeWithModule("briefs");
  const supabase = await createClient();
  const { error } = await supabase
    .from("deal_briefs")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/briefs");
}

export async function deleteDealBrief(id: string) {
  await requireEmployeeWithModule("briefs");
  const supabase = await createClient();
  const { error } = await supabase.from("deal_briefs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/briefs");
}
