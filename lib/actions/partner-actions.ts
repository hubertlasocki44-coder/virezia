"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const serviceSupabase = await createServiceClient();

  // Verify partner has assignment to this lead
  const { data: assignment } = await serviceSupabase
    .from("lead_assignments")
    .select("id")
    .eq("lead_id", leadId)
    .eq("partner_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!assignment) return { error: "Not authorized" };

  await serviceSupabase.from("leads").update({ status }).eq("id", leadId);

  // Log status change as interaction
  await serviceSupabase.from("interactions").insert({
    lead_id: leadId,
    type: "status_change",
    content: `Status changed to ${status}`,
    created_by: user.id,
    visible_to_partner: true,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}

export async function logContact(leadId: string, channel: "call" | "email" | "whatsapp" | "meeting" = "call", note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const serviceSupabase = await createServiceClient();
  const { data: assignment } = await serviceSupabase
    .from("lead_assignments")
    .select("id")
    .eq("lead_id", leadId)
    .eq("partner_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!assignment) return { error: "Not authorized" };

  const label = { call: "Call", email: "Email", whatsapp: "WhatsApp", meeting: "Meeting" }[channel];
  await serviceSupabase.from("interactions").insert({
    lead_id: leadId,
    type: channel,
    content: note?.trim() ? `${label}: ${note.trim()}` : `${label} logged`,
    created_by: user.id,
    visible_to_partner: true,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}

export async function addLeadNote(leadId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const serviceSupabase = await createServiceClient();

  // Verify partner has assignment
  const { data: assignment } = await serviceSupabase
    .from("lead_assignments")
    .select("id")
    .eq("lead_id", leadId)
    .eq("partner_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!assignment) return { error: "Not authorized" };

  await serviceSupabase.from("interactions").insert({
    lead_id: leadId,
    type: "note",
    content,
    created_by: user.id,
    visible_to_partner: true,
  });

  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}
