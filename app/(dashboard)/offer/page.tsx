import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PARTNER_ROLES = new Set([
  "developer", "agent", "broker", "asset_owner", "service_partner",
]);

export default async function OfferPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, company_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "";
  const allowed = PARTNER_ROLES.has(role) || role === "super_admin" || role === "employee";
  if (!allowed) redirect("/dashboard");

  // Las Orcas partners don't have access to the offer page.
  const company = (profile?.company_name || "").toLowerCase();
  if (company.includes("las orcas")) redirect("/dashboard");

  return (
    <div className="min-h-screen -m-6 md:-m-10">
      <iframe
        src="/api/partner-offer"
        className="w-full border-0"
        style={{ height: "100vh", minHeight: "900px" }}
        title="Virezia Partner Offer"
      />
    </div>
  );
}
