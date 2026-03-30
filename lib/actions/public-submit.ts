"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { notifyNewApplication, notifyCircleRequest, notifyPartnerSubmission } from "@/lib/email";

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

  // Send email notification
  if (fullName && email) {
    await notifyNewApplication(fullName, email, accountType);
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

  await notifyCircleRequest(email);
  return { success: true };
}

export async function submitPartnerApplication(data: Record<string, unknown>) {
  const supabase = await createServiceClient();

  const { error } = await supabase.from("applications").insert({
    type: "developer",
    step_data: data,
    status: "pending",
  });

  if (error) {
    return { error: "Something went wrong. Try again or email hello@virezia.com." };
  }

  const fullName = data.full_name as string;
  const company = data.company_name as string;
  if (fullName && company) {
    await notifyPartnerSubmission(fullName, company);
  }

  return { success: true };
}
