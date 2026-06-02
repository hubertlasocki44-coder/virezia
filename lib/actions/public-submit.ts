"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewApplication, notifyCircleRequest, notifyPartnerSubmission, sendApplicationConfirmation } from "@/lib/email";

export async function submitApplication(stepData: Record<string, unknown>) {
  const supabase = await createServiceClient();

  const fullName = stepData.full_name as string | undefined;
  const email = stepData.email as string | undefined;
  const accountType = (stepData.account_type as string) || "individual";

  // Try to find or create user
  let userId: string | null = null;

  if (email) {
    // Check if user already exists via profiles table (not listUsers which loads ALL users)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create account with temporary password
      const { data: authData } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      userId = authData.user?.id ?? null;
    }
  }

  // Campaign attribution for the admin funnel.
  stepData.campaign =
    accountType === "developer" || accountType === "asset_owner" || accountType === "agent"
      ? "partner"
      : "apply";

  // Insert application (service role bypasses RLS)
  const { error: insertError } = await supabase.from("applications").insert({
    user_id: userId,
    type: accountType,
    step_data: stepData,
    status: "pending",
  });

  if (insertError) {
    return { error: "Failed to submit application. Please try again or email hello@virezia.com." };
  }

  // Create buyer profile if applicable
  const isBuyer = accountType === "individual" || accountType === "institutional";
  if (isBuyer && userId && stepData.investment_type) {
    await supabase.from("buyer_profiles").upsert({
      user_id: userId,
      investment_type: stepData.investment_type as string,
      buyer_type: accountType,
      budget_range: (stepData.budget_range as string) || null,
      timeline: (stepData.timeline as string) || null,
      regions_interest: (stepData.regions_interest as string[]) || [],
      purpose: (stepData.context as string) || null,
    }, { onConflict: "user_id" });
  }

  // Auto-create lead for buyer/investor applicants
  if (isBuyer && userId) {
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("client_id", userId)
      .maybeSingle();

    if (!existingLead) {
      await supabase.from("leads").insert({
        client_id: userId,
        status: "new",
        source: "apply",
        priority: "medium",
        notes: `Application: ${accountType}. ${stepData.context || ""}`.trim(),
      });
    }
  }

  // Send email notifications
  try {
    if (fullName && email) {
      await notifyNewApplication(fullName, email, accountType);
      await sendApplicationConfirmation(email, fullName.split(" ")[0], "apply");
    }
  } catch (error) {
    console.error("[submitApplication] Email notification failed:", error);
  }

  return { success: true };
}

export async function submitCircleRequest(email: string) {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("circle_requests")
    .insert({ email });

  if (error) {
    return { error: "Something went wrong. Try again or email hello@virezia.com." };
  }

  try {
    await notifyCircleRequest(email);
    await sendApplicationConfirmation(email, "", "circle");
  } catch (err) {
    console.error("[submitCircleRequest] Email notification failed:", err);
  }

  return { success: true };
}

export async function submitPartnerApplication(data: Record<string, unknown>) {
  const supabase = await createServiceClient();

  data.campaign = "partner";
  const { error } = await supabase.from("applications").insert({
    type: "developer",
    step_data: data,
    status: "pending",
  });

  if (error) {
    return { error: "Something went wrong. Try again or email hello@virezia.com." };
  }

  try {
    const fullName = data.full_name as string;
    const email = data.email as string;
    const company = data.company_name as string;
    if (fullName && company) {
      await notifyPartnerSubmission(fullName, company);
    }
    if (email) {
      await sendApplicationConfirmation(email, fullName?.split(" ")[0] || "", "for-owners");
    }
  } catch (err) {
    console.error("[submitPartnerApplication] Email notification failed:", err);
  }

  return { success: true };
}
