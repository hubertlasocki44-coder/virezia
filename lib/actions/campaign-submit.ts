"use server";

import { createServiceClient } from "@/lib/supabase/server";
import {
  sendNotification,
  sendCircleWelcome,
  sendFoundingMemberWelcome,
  addToResendContacts,
  scheduleLasOrcasSequence,
} from "@/lib/email";
import { sendMetaEvent } from "@/lib/meta-capi";

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
  campaign?: string; // 'circle' (membership) or 'las_orcas' (Selection founding interest)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

function isMatch(investmentRange: string): boolean {
  const qualifyingBudgets = ["500k_1m", "1m_2m", "2m_plus"];
  return qualifyingBudgets.includes(investmentRange);
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
  let isNewUser = false;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    userId = existingProfile.id;
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
    isNewUser = true;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ full_name: data.fullName, phone: data.phone })
        .eq("id", userId);
    }
  }

  // 3. Build application data
  const matched = isStage2 ? isMatch(data.investmentRange) : false;

  // Campaign attribution: completing Stage 2 = Las Orcas founding interest.
  // A plain Circle signup (Stage 1, generic entry) stays 'circle' membership.
  const campaign = isStage2 ? "las_orcas" : (data.campaign || "circle");

  const stepData: Record<string, unknown> = {
    source: "las_orcas_campaign",
    campaign,
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
  } else if (userId) {
    // Stage 1 — upsert (update existing or create new)
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
        .update({ step_data: stepData })
        .eq("id", existing.id);
    } else {
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

  // 6. Create lead for matched Stage 2 submissions + auto-assign to campaign partner
  if (isStage2 && matched && userId) {
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("client_id", userId)
      .maybeSingle();

    if (!existingLead) {
      const { data: newLead } = await supabase.from("leads").insert({
        client_id: userId,
        status: "new",
        source: "circle",
        priority: data.investmentRange === "2m_plus" ? "high" : "medium",
        notes: `Las Orcas founding member interest. Budget: ${data.investmentRange}, Timeline: ${data.timeline}, Intent: ${data.intent}`,
      }).select("id").single();

      // Auto-assign to all Las Orcas campaign partners
      if (newLead) {
        // Find all developers with company_name containing "Las Orcas"
        const { data: partners } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "developer")
          .ilike("company_name", "%Las Orcas%");

        // Find an employee to set as assigned_by
        const { data: employee } = await supabase
          .from("profiles")
          .select("id")
          .in("role", ["employee", "super_admin"])
          .limit(1)
          .single();

        if (partners && partners.length > 0 && employee) {
          const assignments = partners.map((partner) => ({
            lead_id: newLead.id,
            partner_id: partner.id,
            visibility_level: "full" as const,
            status: "active" as const,
            assigned_by: employee.id,
            notes: "Auto-assigned from Las Orcas campaign",
          }));

          await supabase.from("lead_assignments").insert(assignments);

          // Notify partners about new lead
          const { data: partnerProfiles } = await supabase
            .from("profiles")
            .select("email")
            .eq("role", "developer")
            .ilike("company_name", "%Las Orcas%");

          if (partnerProfiles) {
            const { sendPartnerLeadNotification } = await import("@/lib/email");
            for (const p of partnerProfiles) {
              try {
                await sendPartnerLeadNotification(
                  p.email,
                  `New Las Orcas Lead: ${data.fullName}`,
                  `<h2>New Lead in Your Pipeline</h2>
                  <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
                  <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                  <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
                  <p><strong>Budget:</strong> ${escapeHtml(data.investmentRange)}</p>
                  <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
                  <p><strong>Intent:</strong> ${escapeHtml(data.intent)}</p>
                  <p>View in your dashboard: <a href="https://virezia.com/dashboard">virezia.com/dashboard</a></p>`
                );
              } catch (err) {
                console.error("[Las Orcas] Partner notification failed:", err);
              }
            }
          }
        }
      }
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

  // 8. Send confirmation email + add to Resend (ONLY on first submit, not updates)
  const firstName = data.fullName.split(" ")[0];
  const lastName = data.fullName.split(" ").slice(1).join(" ");
  if (isNewUser) {
    try {
      await addToResendContacts(data.email, firstName, lastName, {
        source: "las_orcas_campaign",
        circle_member: "true",
        founding_interest: isStage2 ? "true" : "false",
        matched: isStage2 ? String(matched) : "false",
      });
      await sendCircleWelcome(data.email, firstName);
    } catch (err) {
      console.error("[Las Orcas] Lead email/contact failed:", err);
    }
  }

  // 9. Log email activity on lead (if lead exists)
  if (userId) {
    const { data: leadRecord } = await supabase
      .from("leads")
      .select("id")
      .eq("client_id", userId)
      .maybeSingle();

    if (leadRecord) {
      const emailType = isStage2
        ? (matched ? "Founding Member welcome + video link" : "Circle welcome (unmatched)")
        : "Circle welcome email";

      // Find system user for created_by
      const { data: sysUser } = await supabase
        .from("profiles")
        .select("id")
        .in("role", ["employee", "super_admin"])
        .limit(1)
        .maybeSingle();

      if (sysUser) {
        await supabase.from("interactions").insert({
          lead_id: leadRecord.id,
          type: "email",
          content: `Sent: ${emailType}. Drip sequence scheduled (Day 2, 5, 9, 14).`,
          created_by: sysUser.id,
          visible_to_partner: true,
        });
      }
    }
  }

  // 10. Meta Conversions API (server-side)
  try {
    await sendMetaEvent({
      eventName: isStage2 ? "Lead" : "CompleteRegistration",
      email: data.email,
      phone: data.phone || undefined,
      firstName: data.fullName.split(" ")[0],
      lastName: data.fullName.split(" ").slice(1).join(" ") || undefined,
      sourceUrl: "https://virezia.com/las-orcas",
      customData: {
        content_name: "Las Orcas",
        content_category: isStage2 ? "founding_member" : "circle_join",
        value: isStage2 ? (matched ? 1 : 0.5) : 0.25,
        currency: "USD",
        ...(isStage2 ? {
          investment_range: data.investmentRange,
          timeline: data.timeline,
          intent: data.intent,
          matched: matched,
        } : {}),
      },
    });
  } catch (err) {
    console.error("[Las Orcas] Meta CAPI failed:", err);
  }

  return { success: true, matched: isStage2 ? matched : undefined };
}
