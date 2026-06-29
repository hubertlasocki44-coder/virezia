import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import DashboardSidebar from "./DashboardSidebar";
import { LangProvider } from "@/lib/lang";

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
    .select("full_name, email, role, company_name")
    .eq("id", user.id)
    .single();

  if (profile?.role === "employee" || profile?.role === "super_admin") {
    redirect("/admin");
  }

  const isPartner = ["developer", "agent", "broker", "asset_owner", "service_partner"].includes(profile?.role || "");

  // Per-client module access. Add company_name patterns here to grant/restrict
  // specific nav items without a DB schema change.
  const company = (profile?.company_name || "").toLowerCase();
  const partnerModules = resolvePartnerModules(company);

  return (
  <LangProvider>
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col border-r border-white/[0.06] bg-[#0d0d0d]">
        {/* Logo */}
        <div className="px-6 py-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="VIREZIA"
              width={100}
              height={26}
              className="h-6 w-auto brightness-0 invert opacity-70"
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-2">
          <DashboardSidebar isPartner={isPartner} modules={partnerModules} />
        </nav>

        {/* User */}
        <div className="border-t border-white/[0.06] px-4 py-4">
          <p className="font-sans text-[13px] text-white/80 truncate">
            {profile?.full_name || profile?.email}
          </p>
          {profile?.company_name ? (
            <p className="font-sans text-[11px] text-white/30 mt-0.5 truncate">
              {profile.company_name}
            </p>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 font-sans text-[11px] text-white/30 hover:text-white/60 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/">
            <Image src="/logo.png" alt="VIREZIA" width={80} height={20} className="h-5 w-auto brightness-0 invert opacity-70" />
          </Link>
          <span className="font-sans text-[12px] text-white/40">{profile?.full_name}</span>
        </div>
      </div>

      <main className="dashboard-scope flex-1 min-h-screen md:pt-0 pt-14">
        <div className="p-6 md:p-10 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  </LangProvider>
  );
}

// ---------------------------------------------------------------------------
// Per-client module access control
// Add entries here to grant or restrict nav items per company.
// Modules: "pipeline" | "offer" | "settings"
// ---------------------------------------------------------------------------
type PartnerModule = "pipeline" | "offer" | "settings";

function resolvePartnerModules(companyLower: string): PartnerModule[] {
  // Las Orcas: pipeline only — offer page is hidden
  if (companyLower.includes("las orcas")) {
    return ["pipeline", "settings"];
  }

  // Default for all other partners: full access
  return ["pipeline", "offer", "settings"];
}
