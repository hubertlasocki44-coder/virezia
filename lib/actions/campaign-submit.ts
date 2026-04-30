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
  const isStage2 = Boolean(data.investmentRange && data.timeline && data.intent);

  // 1. Store in circle_requests (Circle membership — every submit)
  // Use upsert-like behavior: ignore duplicate emails
  const { error: circleError } = await supabase.from("circle_requests").insert({
    email: data.email,
    status: "pending",
  });
  // Ignore duplicate email errors silently (Stage 2 re-submit)
  if (circleError && !circleError.message.includes("duplicate")) {
    console.error("[Las Orcas] Circle insert error:", circleError);
  }

  // 2. Find or create user profile
  let userId: string | null = null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    userId = existingProfile.id;
    // Update phone/name if missing
    await supabase
      .from("profiles")
      .update({ full_name: data.fullName, phone: data.phone })
      .eq("id", userId);
  } else {
    const { data: authData } = await supabase.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    userId = authData.user?.id ?? null;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ full_name: data.fullName, phone: data.phone })
        .eq("id", userId);
    }
  }

  // 3. Build application data
  const matched = isStage2 ? isMatch(data.investmentRange, data.intent) : false;

  const stepData: Record<string, unknown> = {
    source: "las_orcas_campaign",
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    circle_member: true,
    las_orcas_founding_interest: isStage2,
    utm_source: data.utmSource || null,
    utm_medium: data.utmMedium || null,
    utm_campaign: data.utmCampaign || null,
    utm_content: data.utmContent || null,
    utm_term: data.utmTerm || null,
    submitted_at: new Date().toISOString(),
  };

  if (isStage2) {
    stepData.investment_range = data.investmentRange;
    stepData.timeline = data.timeline;
    stepData.intent = data.intent;
    stepData.matched = matched;
  }

  // 4. Upsert application (update if Stage 2 follows Stage 1)
  if (isStage2 && userId) {
    // Try to update existing Stage 1 application
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "las_orcas_campaign")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("applications")
        .update({
          step_data: stepData,
          status: matched ? "screening" : "pending",
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("applications").insert({
        user_id: userId,
        type: "las_orcas_campaign",
        step_data: stepData,
        status: matched ? "screening" : "pending",
      });
    }
  } else {
    // Stage 1 only — create new application
    const { error: insertError } = await supabase.from("applications").insert({
      user_id: userId,
      type: "las_orcas_campaign",
      step_data: stepData,
      status: "pending",
    });

    if (insertError) {
      return { error: "Something went wrong. Please try again or email hello@virezia.com." };
    }
  }

  // 5. Create/update buyer profile
  if (userId) {
    const buyerData: Record<string, unknown> = {
      user_id: userId,
      investment_type: "residential",
      regions_interest: ["oaxaca"],
    };
    if (isStage2) {
      buyerData.budget_range = data.investmentRange;
      buyerData.timeline = data.timeline;
      buyerData.purpose = data.intent;
    }
    await supabase.from("buyer_profiles").upsert(buyerData, { onConflict: "user_id" });
  }

  // 6. Create lead for matched Stage 2 submissions
  if (isStage2 && matched && userId) {
    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("client_id", userId)
      .maybeSingle();

    if (!existingLead) {
      await supabase.from("leads").insert({
        client_id: userId,
        status: "new",
        source: "circle",
        priority: data.investmentRange === "2m_plus" ? "high" : "medium",
        notes: `Las Orcas founding member interest. Budget: ${data.investmentRange}, Timeline: ${data.timeline}, Intent: ${data.intent}`,
      });
    }
  }

  // 7. Notify team
  const safeName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const stage = isStage2 ? "Founding Member" : "Circle Join";
  try {
    await sendNotification(
      `Las Orcas ${isStage2 ? (matched ? "MATCH" : "No match") : "Circle"}: ${safeName}`,
      `<h2>Las Orcas — ${stage}</h2>
      ${isStage2 ? `<p><strong>Match:</strong> ${matched ? "Yes" : "No — Circle pool"}</p>` : "<p><strong>Stage:</strong> Circle member (Stage 1 only)</p>"}
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      ${isStage2 ? `<p><strong>Budget:</strong> ${escapeHtml(data.investmentRange)}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
      <p><strong>Intent:</strong> ${escapeHtml(data.intent)}</p>` : ""}
      ${data.utmSource ? `<p><strong>UTM:</strong> ${escapeHtml(data.utmSource)} / ${escapeHtml(data.utmMedium || "")} / ${escapeHtml(data.utmCampaign || "")}</p>` : ""}
      <p>Review in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/applications">admin panel</a>.</p>`
    );
  } catch (err) {
    console.error("[Las Orcas] Email notification failed:", err);
  }

  return { success: true, matched: isStage2 ? matched : undefined };
}
