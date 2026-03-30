"use client";

import { useState, useEffect } from "react";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import FormCheckboxGroup from "@/components/forms/FormCheckboxGroup";
import { createClient } from "@/lib/supabase/client";
import type { EmployeeModule, UserRole } from "@/lib/types";

const ROLES: UserRole[] = [
  "super_admin", "employee", "buyer", "developer", "agent", "broker", "asset_owner", "service_partner",
];

const ALL_MODULES: { value: string; label: string }[] = [
  { value: "leads", label: "Leads" },
  { value: "applications", label: "Applications" },
  { value: "partners", label: "Partners" },
  { value: "audits", label: "Audits" },
  { value: "blog", label: "Blog" },
  { value: "briefs", label: "Deal Briefs" },
  { value: "users", label: "Users" },
  { value: "analytics", label: "Analytics" },
  { value: "settings", label: "Settings" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<Record<string, unknown> | null>(null);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*, employee_permissions(modules)")
      .order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ role }).eq("id", userId);
    fetchUsers();
  };

  const handleStatusChange = async (userId: string, status: string) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ status }).eq("id", userId);
    fetchUsers();
  };

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">Users</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">{users.length} total users</p>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Name</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Email</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Role</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id as string} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm text-text-primary">{(u.full_name as string) || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{u.email as string}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role as string}
                    onChange={(e) => handleRoleChange(u.id as string, e.target.value)}
                    className="border border-border bg-bg-primary px-2 py-1 font-sans text-[12px] text-text-secondary"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3"><AdminStatusBadge status={u.status as string} /></td>
                <td className="px-4 py-3 flex gap-2">
                  {u.status === "active" && (
                    <button onClick={() => handleStatusChange(u.id as string, "suspended")} className="font-sans text-[12px] text-yellow-400 hover:text-yellow-300">
                      Suspend
                    </button>
                  )}
                  {u.status === "suspended" && (
                    <button onClick={() => handleStatusChange(u.id as string, "active")} className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300">
                      Activate
                    </button>
                  )}
                  {((u.role as string) === "employee") && (
                    <button onClick={() => setEditUser(u)} className="font-sans text-[12px] text-accent-gold hover:text-accent-gold-light">
                      Permissions
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <PermissionsModal
          user={editUser}
          onClose={() => { setEditUser(null); fetchUsers(); }}
        />
      )}
    </div>
  );
}

function PermissionsModal({ user, onClose }: { user: Record<string, unknown>; onClose: () => void }) {
  const perms = user.employee_permissions as Record<string, unknown>[] | null;
  const currentModules = (perms?.[0]?.modules as string[]) ?? [];
  const [modules, setModules] = useState<string[]>(currentModules);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("employee_permissions").upsert(
      { user_id: user.id as string, modules },
      { onConflict: "user_id" }
    );
    setLoading(false);
    onClose();
  };

  return (
    <AdminModal title={`Permissions — ${(user.full_name as string) || (user.email as string)}`} open={true} onClose={onClose}>
      <div className="space-y-4">
        <FormCheckboxGroup
          label="Modules"
          options={ALL_MODULES}
          values={modules}
          onChange={setModules}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-accent-gold px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </AdminModal>
  );
}
