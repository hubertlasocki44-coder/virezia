"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PartnerModule = "pipeline" | "offer" | "settings";

const ALL_PARTNER_NAV: { href: string; label: string; icon: string; module: PartnerModule }[] = [
  { href: "/dashboard", label: "Pipeline",  icon: "◇", module: "pipeline" },
  { href: "/offer",     label: "Our Offer", icon: "◈", module: "offer"    },
  { href: "/settings",  label: "Settings",  icon: "○", module: "settings" },
];

const BUYER_NAV = [
  { href: "/dashboard", label: "Overview", icon: "◇" },
  { href: "/settings",  label: "Settings", icon: "○" },
];

export default function DashboardSidebar({
  isPartner,
  modules,
}: {
  isPartner: boolean;
  modules?: PartnerModule[];
}) {
  const pathname = usePathname();
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
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
