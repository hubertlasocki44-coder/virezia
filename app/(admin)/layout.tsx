import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import type { EmployeeModule } from "@/lib/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "super_admin" && profile.role !== "employee")) {
    redirect("/dashboard");
  }

  const isSuperAdmin = profile.role === "super_admin";

  let modules: EmployeeModule[] = [];
  if (!isSuperAdmin) {
    const { data: permissions } = await supabase
      .from("employee_permissions")
      .select("modules")
      .eq("user_id", user.id)
      .single();
    modules = (permissions?.modules ?? []) as EmployeeModule[];
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <AdminSidebar modules={modules} isSuperAdmin={isSuperAdmin} />
      <div className="ml-[240px]">
        <AdminTopBar
          user={{
            full_name: profile.full_name,
            email: profile.email,
            role: profile.role,
          }}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
