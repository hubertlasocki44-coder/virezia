"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployeeWithModule } from "@/lib/auth-guard";
import type { VisibilityLevel } from "@/lib/types";

export async function getAssignments(leadId: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_assignments")
    .select("*, partner:profiles!lead_assignments_partner_id_fkey(*)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function assignPartner(
  leadId: string,
  partnerId: string,
  visibilityLevel: VisibilityLevel,
  notes?: string
) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("lead_assignments").insert({
    lead_id: leadId,
    partner_id: partnerId,
    visibility_level: visibilityLevel,
    notes: notes || null,
    assigned_by: user.id,
  });

  if (error) throw error;

  // Also add an interaction log
  await supabase.from("interactions").insert({
    lead_id: leadId,
    type: "assignment",
    content: `Partner assigned with ${visibilityLevel} visibility`,
    created_by: user.id,
    visible_to_partner: false,
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function revokeAssignment(assignmentId: string, leadId: string) {
  await requireEmployeeWithModule("leads");
  const supabase = await createClient();
  const { error } = await supabase
    .from("lead_assignments")
    .update({ status: "revoked" })
    .eq("id", assignmentId);

  if (error) throw error;
  revalidatePath(`/admin/leads/${leadId}`);
}
