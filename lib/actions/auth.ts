"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: {
  email: string;
  password: string;
  redirectTo?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Honour the redirect param from the middleware (e.g. /admin/leads/abc)
  // but validate it to prevent open redirects.
  const next = formData.redirectTo;
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }

  // Default: route by role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profile?.role === "super_admin" ||
      profile?.role === "employee"
    ) {
      redirect("/admin");
    }
  }

  redirect("/dashboard");
}

export async function signUp(formData: {
  email: string;
  password: string;
  full_name: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/dashboard`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a password reset link." };
}
