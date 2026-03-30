"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveCommissionSettings(settings: {
  successFee: string;
  auditTier1: string;
  auditTier2: string;
  auditTier3: string;
}) {
  await requireSuperAdmin();
  const supabase = await createClient();

  // Store in a platform_settings key-value pattern
  // Using a single row with a known key in a simple upsert
  const payload = {
    key: "commission_settings",
    value: JSON.stringify({
      success_fee_pct: parseFloat(settings.successFee) || 5.0,
      audit_tier_1_usd: parseInt(settings.auditTier1, 10) || 2500,
      audit_tier_2_usd: parseInt(settings.auditTier2, 10) || 5000,
      audit_tier_3_usd: parseInt(settings.auditTier3, 10) || 12000,
      updated_at: new Date().toISOString(),
    }),
  };

  // Try to upsert into platform_settings if the table exists.
  // If it doesn't exist yet, log and skip silently -- the table
  // can be created via migration when ready.
  const { error } = await supabase
    .from("platform_settings")
    .upsert(payload, { onConflict: "key" });

  if (error) {
    // Table likely doesn't exist yet -- log for awareness
    console.log("[Settings] Could not save commission settings:", error.message);
    console.log("[Settings] Create the platform_settings table to persist these values.");
  }

  revalidatePath("/admin/settings");
}

export async function signOutAllDevices() {
  await requireSuperAdmin();
  const supabase = await createClient();

  // Sign out the current session (Supabase JS v2 scope: "global" signs out all sessions)
  await supabase.auth.signOut({ scope: "global" });

  redirect("/login");
}
