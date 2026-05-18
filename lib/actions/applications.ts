"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployeeWithModule } from "@/lib/auth-guard";

export async function getApplications(status?: string) {
  await requireEmployeeWithModule("applications");
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
  await requireEmployeeWithModule("applications");
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw error;

  // Auto-convert to lead when approved
  if (status === "approved") {
    try {
      await autoConvertToLead(id);
    } catch (err) {
      console.error("[Applications] Auto-convert failed:", err);
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/leads");
}

async function autoConvertToLead(applicationId: string) {
  const supabase = await createServiceClient();

  const { data: app } = await supabase
    .from("applications")
    .select("user_id, type, step_data")
    .eq("id", applicationId)
    .single();

  if (!app?.user_id) return;

  // Check if lead already exists
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("client_id", app.user_id)
    .maybeSingle();

  if (existing) return; // Already a lead

  // Create lead
  const stepData = (app.step_data || {}) as Record<string, unknown>;
  const { data: lead } = await supabase.from("leads").insert({
    client_id: app.user_id,
    status: "new",
    source: app.type === "las_orcas_campaign" ? "circle" : "apply",
    priority: "medium",
    notes: stepData.investment_range
      ? `Budget: ${stepData.investment_range}, Timeline: ${stepData.timeline}, Intent: ${stepData.intent}`
      : "Converted from approved application",
  }).select("id").single();

  if (!lead) return;

  // Auto-assign to campaign partners if Las Orcas
  if (app.type === "las_orcas_campaign") {
    const { data: partners } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("role", "developer")
      .ilike("company_name", "%Las Orcas%");

    const { data: admin } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["employee", "super_admin"])
      .limit(1)
      .single();

    if (partners && partners.length > 0 && admin) {
      const assignments = partners.map((p) => ({
        lead_id: lead.id,
        partner_id: p.id,
        visibility_level: "full" as const,
        status: "active" as const,
        assigned_by: admin.id,
        notes: "Auto-assigned on approval",
      }));
      await supabase.from("lead_assignments").insert(assignments);

      // Notify partners
      const { sendPartnerLeadNotification } = await import("@/lib/email");
      const name = (stepData.full_name as string) || "New lead";
      const email = (stepData.email as string) || "";
      const phone = (stepData.phone as string) || "Not provided";

      for (const p of partners) {
        try {
          await sendPartnerLeadNotification(
            p.email,
            `New Lead Approved: ${name}`,
            `<h2>New Lead in Your Pipeline</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p>View in your dashboard: <a href="https://virezia.com/dashboard">virezia.com/dashboard</a></p>`
          );
        } catch {
          // Non-blocking
        }
      }
    }
  }
}

export async function convertToLead(applicationId: string) {
  await requireEmployeeWithModule("applications");
  await autoConvertToLead(applicationId);

  const supabase = await createClient();
  await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  revalidatePath("/admin/applications");
  revalidatePath("/admin/leads");
}
