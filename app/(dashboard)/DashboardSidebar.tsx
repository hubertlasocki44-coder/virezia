"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang";
import { t } from "@/lib/translations";

type PartnerModule = "pipeline" | "offer" | "settings";

const ALL_PARTNER_NAV: { href: string; labelKey: "nav_pipeline" | "nav_proposal" | "nav_settings"; icon: string; module: PartnerModule }[] = [
  { href: "/dashboard", labelKey: "nav_pipeline", icon: "◇", module: "pipeline" },
  { href: "/offer",     labelKey: "nav_proposal", icon: "◈", module: "offer"    },
  { href: "/settings",  labelKey: "nav_settings", icon: "○", module: "settings" },
];

const BUYER_NAV: { href: string; labelKey: "nav_overview" | "nav_settings"; icon: string }[] = [
  { href: "/dashboard", labelKey: "nav_overview", icon: "◇" },
  { href: "/settings",  labelKey: "nav_settings", icon: "○" },
];

export default function DashboardSidebar({
  isPartner,
  modules,
}: {
  isPartner: boolean;
  modules?: PartnerModule[];
}) {
  const pathname = usePathname();
  const { lang, toggle } = useLang();

  const items = isPartner
    ? ALL_PARTNER_NAV.filter((i) => !modules || modules.includes(i.module))
    : BUYER_NAV;

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-sans text-[13px] transition-all ${
              active
                ? "bg-white/[0.06] text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-[10px] opacity-50">{item.icon}</span>
            {t(item.labelKey, lang)}
          </Link>
        );
      })}

      {/* Language toggle */}
      <div className="pt-4 px-3">
        <button
          onClick={toggle}
          className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.15em] text-white/20 hover:text-white/50 transition-colors"
        >
          <span className={lang === "en" ? "text-white/60" : ""}>EN</span>
          <span className="text-white/10">·</span>
          <span className={lang === "es" ? "text-white/60" : ""}>ES</span>
        </button>
      </div>
    </div>
  );
}
