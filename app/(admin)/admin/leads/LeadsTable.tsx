"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import LeadRowActions from "./LeadRowActions";
import { bulkArchiveLeads, bulkDeleteLeads, addLeadsToCampaign } from "@/lib/actions/leads";

export interface PipelineRow {
  id: string;
  client: string;
  campaign: string;
  status: string;
  priority: string;
  score: number;
  employee: string;
  partners: number;
  created: string;
}

const CAMPAIGN_OPTIONS = [{ value: "las_orcas", label: "Las Orcas" }];

export default function LeadsTable({ rows }: { rows: PipelineRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0].value);
  const [pending, start] = useTransition();

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const ids = Array.from(selected);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  const clear = () => setSelected(new Set());

  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); clear(); });

  return (
    <div>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border border-accent-gold/30 bg-accent-gold/5 px-4 py-2.5">
          <span className="font-sans text-sm text-text-secondary">{selected.size} selected</span>
          <button
            onClick={() => run(() => bulkArchiveLeads(ids))}
            disabled={pending}
            className="font-sans text-[12px] text-text-muted hover:text-text-secondary disabled:opacity-50"
          >
            Archive
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${selected.size} leads permanently? Interactions and assignments are removed too.`))
                run(() => bulkDeleteLeads(ids));
            }}
            disabled={pending}
            className="font-sans text-[12px] text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Delete
          </button>
          <span className="ml-auto flex items-center gap-2">
            <select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="border border-border bg-bg-card px-2 py-1 font-sans text-[12px] text-text-secondary"
            >
              {CAMPAIGN_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button
              onClick={() => run(() => addLeadsToCampaign(ids, campaign))}
              disabled={pending}
              className="border border-accent-gold/40 bg-accent-gold/10 px-3 py-1 font-sans text-[12px] text-accent-gold hover:bg-accent-gold/20 disabled:opacity-50"
            >
              Add to campaign
            </button>
          </span>
        </div>
      )}

      <div className="mt-3 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-accent-gold" />
              </th>
              {["Client", "Campaign", "Status", "Priority", "Score", "Employee", "Partners", "Created", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={`border-b border-border-subtle transition-colors hover:bg-bg-secondary ${selected.has(r.id) ? "bg-accent-gold/5" : "bg-bg-card"}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 accent-accent-gold" />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${r.id}`} className="font-sans text-sm text-text-primary hover:text-accent-gold">{r.client}</Link>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.campaign}</td>
                <td className="px-4 py-3"><AdminStatusBadge status={r.status} /></td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.priority}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.score}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.employee}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.partners}</td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">{r.created}</td>
                <td className="px-4 py-3"><LeadRowActions id={r.id} status={r.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center font-sans text-sm text-text-muted">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
