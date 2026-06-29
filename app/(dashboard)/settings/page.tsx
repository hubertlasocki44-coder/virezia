import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";
import SettingsTitle from "./SettingsTitle";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, company_name, role, status, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div>
      <SettingsTitle />

      <SettingsForm
        email={profile.email}
        fullName={profile.full_name || ""}
        phone={profile.phone || ""}
        companyName={profile.company_name || ""}
        role={profile.role}
        status={profile.status}
        memberSince={profile.created_at}
      />
    </div>
  );
}
