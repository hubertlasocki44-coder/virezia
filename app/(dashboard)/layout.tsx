import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export default async function DashboardLayout({
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
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  // Employees go to admin
  if (profile?.role === "employee" || profile?.role === "super_admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="VIREZIA"
              width={120}
              height={30}
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-sans text-sm text-text-secondary">
              {profile?.full_name || profile?.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:text-text-secondary"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-content px-6 py-8">{children}</main>
    </div>
  );
}
