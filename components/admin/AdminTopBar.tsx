"use client";

import { signOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import type { Profile } from "@/lib/types";

interface AdminTopBarProps {
  user: Pick<Profile, "full_name" | "email" | "role">;
}

export default function AdminTopBar({ user }: AdminTopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-bg-primary px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-sans text-sm text-text-primary">
            {user.full_name || user.email}
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.05em] text-text-muted">
            {user.role.replace("_", " ")}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-bg-card hover:text-text-secondary"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
