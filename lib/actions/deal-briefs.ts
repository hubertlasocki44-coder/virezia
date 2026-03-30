"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDealBriefs() {
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("deal_briefs")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/briefs");
}
