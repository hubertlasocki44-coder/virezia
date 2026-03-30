"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Handshake,
  Shield,
  PenTool,
  BookOpen,
  Settings,
  BarChart3,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { EmployeeModule } from "@/lib/types";

interface AdminSidebarProps {
  modules: EmployeeModule[];
  isSuperAdmin: boolean;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, module: null },
  { href: "/admin/leads", label: "Leads Pipeline", icon: Users, module: "leads" as const },
  { href: "/admin/applications", label: "Applications", icon: FileText, module: "applications" as const },
  { href: "/admin/partners", label: "Partners", icon: Handshake, module: "partners" as const },
  { href: "/admin/audits", label: "Audits", icon: Shield, module: "audits" as const },
  { href: "/admin/blog", label: "Blog", icon: PenTool, module: "blog" as const },
  { href: "/admin/briefs", label: "Deal Briefs", icon: Briefcase, module: "briefs" as const },
  { href: "/admin/users", label: "Users", icon: BookOpen, module: "users" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, module: "settings" as const },
];

export default function AdminSidebar({ modules, isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const hasAccess = (module: string | null) => {
    if (module === null) return true;
    if (isSuperAdmin) return true;
    if (module === "users" || module === "settings") return isSuperAdmin;
    return modules.includes(module as EmployeeModule);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-bg-secondary transition-all duration-200 ${
        collapsed ? "w-[60px]" : "w-[240px]"
      }`}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <span className="font-serif text-lg text-text-primary">VIREZIA</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-muted transition-colors hover:text-text-secondary"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.filter((item) => hasAccess(item.module)).map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded px-3 py-2 font-sans text-sm transition-colors ${
                    isActive
                      ? "bg-accent-gold/10 text-accent-gold"
                      : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
