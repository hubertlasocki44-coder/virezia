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

/**
 * Checks that the current user is an employee/super_admin AND has the
 * required module in their employee_permissions row.  Super admins bypass
 * the module check (mirrors the DB-level employee_has_module function).
 *
 * Use this instead of bare requireEmployee() in server actions that touch
 * module-gated tables (leads, applications, blog, briefs, interactions)
 * so that permission failures surface as clear errors rather than silent
 * empty result sets from RLS.
 */
export async function requireEmployeeWithModule(requiredModule: string) {
  const { user, role } = await requireEmployee();

  // Super admins bypass module checks (matches DB function behavior)
  if (role === "super_admin") {
    return { user, role };
  }

  const supabase = await createClient();
  const { data: perms } = await supabase
    .from("employee_permissions")
    .select("modules")
    .eq("user_id", user.id)
    .single();

  if (!perms || !perms.modules?.includes(requiredModule)) {
    throw new Error(
      `Forbidden: missing "${requiredModule}" module permission. Ask a super_admin to grant access.`
    );
  }

  return { user, role };
}

export async function requireSuperAdmin() {
  const { user, role } = await requireEmployee();

  if (role !== "super_admin") {
    throw new Error("Forbidden: super_admin required");
  }

  return { user, role };
}
