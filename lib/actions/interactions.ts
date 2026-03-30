"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth-guard";
import type { InteractionType } from "@/lib/types";

export async function getInteractions(leadId: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interactions")
    .select("*, creator:profiles!interactions_created_by_fkey(full_name)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addInteraction(
  leadId: string,
  type: InteractionType,
  content: string,
  visibleToPartner: boolean = false
) {
  await requireEmployee();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("interactions").insert({
    lead_id: leadId,
    type,
    content,
    created_by: user.id,
    visible_to_partner: visibleToPartner,
  });

  if (error) throw error;
  revalidatePath(`/admin/leads/${leadId}`);
}
