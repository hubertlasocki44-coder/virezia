import { createClient } from "@/lib/supabase/server";

export async function requireEmployee() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["employee", "super_admin"].includes(profile.role)) {
    throw new Error("Forbidden");
  }

  return { user, role: profile.role };
}

export async function requireSuperAdmin() {
  const { user, role } = await requireEmployee();

  if (role !== "super_admin") {
    throw new Error("Forbidden: super_admin required");
  }

  return { user, role };
}
