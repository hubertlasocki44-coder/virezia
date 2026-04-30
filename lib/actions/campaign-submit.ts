"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendNotification } from "@/lib/email";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface LasOrcasSubmission {
  fullName: string;
  email: string;
  phone: string;
  investmentRange: string;
  timeline: string;
  intent: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

function isMatch(investmentRange: string, intent: string): boolean {
  const qualifyingBudgets = ["500k_1m", "1m_2m", "2m_plus"];
  return qualifyingBudgets.includes(investmentRange) && intent !== "investment_yield";
}

export async function submitLasOrcasForm(data: LasOrcasSubmission) {
  const supabase = await createServiceClient();

  // 1. Store in circle_requests (Circle membership — every submit)
  await supabase.from("circle_requests").insert({
    email: data.email,
    status: "pending",
  });

  // 2. Find or create user profile
  let userId: string | null = null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    userId = authData.user?.id ?? null;

    // Update profile with phone if new user
    if (userId) {
      await supabase
        .from("profiles")
        .update({ full_name: data.fullName, phone: data.phone })
        .eq("id", userId);
    }
  }

  // 3. Store application with campaign data
  const matched = isMatch(data.investmentRange, data.intent);

  const stepData = {
    source: "las_orcas_campaign",
    investment_range: data.investmentRange,
    timeline: data.timeline,
    intent: data.intent,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    matched,
    utm_source: data.utmSource || null,
    utm_medium: data.utmMedium || null,
    utm_campaign: data.utmCampaign || null,
    utm_content: data.utmContent || null,
    utm_term: data.utmTerm || null,
    submitted_at: new Date().toISOString(),
  };

  const { error: insertError } = await supabase.from("applications").insert({
    user_id: userId,
    type: "las_orcas_campaign",
    step_data: stepData,
    status: matched ? "screening" : "pending",
  });

  if (insertError) {
    return { error: "Something went wrong. Please try again or email hello@virezia.com." };
  }

  // 4. Create buyer profile
  if (userId) {
    await supabase.from("buyer_profiles").upsert(
      {
        user_id: userId,
        investment_type: "residential",
        budget_range: data.investmentRange,
        timeline: data.timeline,
        purpose: data.intent,
        regions_interest: ["oaxaca"],
      },
      { onConflict: "user_id" }
    );
  }

  // 5. Create lead for matched submissions
  if (matched && userId) {
    await supabase.from("leads").insert({
      client_id: userId,
      status: "new",
      source: "circle",
      priority: data.investmentRange === "2m_plus" ? "high" : "medium",
      notes: `Las Orcas campaign lead. Budget: ${data.investmentRange}, Timeline: ${data.timeline}, Intent: ${data.intent}`,
    });
  }

  // 6. Notify team
  const safeName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  try {
    await sendNotification(
      `Las Orcas ${matched ? "MATCH" : "Circle"}: ${safeName}`,
      `<h2>Las Orcas Campaign Submission</h2>
      <p><strong>Match:</strong> ${matched ? "Yes" : "No — Circle pool"}</p>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(data.investmentRange)}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
      <p><strong>Intent:</strong> ${escapeHtml(data.intent)}</p>
      ${data.utmSource ? `<p><strong>UTM:</strong> ${escapeHtml(data.utmSource)} / ${escapeHtml(data.utmMedium || "")} / ${escapeHtml(data.utmCampaign || "")}</p>` : ""}
      <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/applications">admin panel</a>.</p>`
    );
  } catch (err) {
    console.error("[Las Orcas] Email notification failed:", err);
  }

  return { success: true, matched };
}
