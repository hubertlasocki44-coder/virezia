import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PARTNER_ROLES = new Set([
  "developer", "agent", "broker", "asset_owner", "service_partner",
]);

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "";
  const allowed = PARTNER_ROLES.has(role) || role === "super_admin" || role === "employee";

  if (!allowed) {
    return new NextResponse("Access denied.", { status: 403 });
  }

  // Las Orcas partners: offer page is not part of their package.
  const company = ((profile as { company_name?: string } | null)?.company_name || "").toLowerCase();
  if (company.includes("las orcas")) {
    return new NextResponse("Access denied.", { status: 403 });
  }

  let html = readFileSync(
    join(process.cwd(), "app/(dashboard)/offer/calculator.html"),
    "utf8"
  );

  // Inject lang initializer so the page opens in the language chosen in the dashboard.
  const lang = req.nextUrl.searchParams.get("lang") === "es" ? "es" : "en";
  const initScript = `<script>
(function(){
  var l = "${lang}";
  document.documentElement.addEventListener("DOMContentLoaded", function(){}, false);
  window.addEventListener("load", function(){
    if(typeof setLang === "function") setLang(l);
    else {
      document.body.className = document.body.className.replace(/lang-\w+/g, "") + " lang-" + l;
      var en = document.getElementById("btn-en"), es = document.getElementById("btn-es");
      if(en) en.classList.toggle("active", l === "en");
      if(es) es.classList.toggle("active", l === "es");
    }
  });
})();
</script>`;
  html = html.replace("</body>", initScript + "\n</body>");

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
