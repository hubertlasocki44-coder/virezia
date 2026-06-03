"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import IncompleteActions from "../incomplete/IncompleteActions";
import { bulkArchiveCaptures, bulkDeleteCaptures, addCapturesToCampaign } from "@/lib/actions/leads";

export interface IncompleteRow {
  email: string;
  name: string;
  phone: string;
  campaign: string;
  budget: string;
  timeline: string;
  lastActivity: string;
}

const CAMPAIGN_OPTIONS = [{ value: "las_orcas", label: "Las Orcas" }];

export default function IncompleteTable({ rows }: { rows: IncompleteRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0].value);
  const [pending, start] = useTransition();

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const emails = Array.from(selected);

  const toggle = (email: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.email)));
  const clear = () => setSelected(new Set());
  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); clear(); });

  return (
    <div>
      <p className="mt-4 font-sans text-sm text-text-muted">
        {rows.length} founding-interest captures not yet qualified. Pure Circle signups live under{" "}
        <Link href="/admin/circle" className="text-accent-gold hover:text-accent-gold-light">Circle</Link>.
        Select rows to add them to a campaign (low-priority lead, partner preview).
      </p>

      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border border-accent-gold/30 bg-accent-gold/5 px-4 py-2.5">
          <span className="font-sans text-sm text-text-secondary">{selected.size} selected</span>
          <button
            onClick={() => run(() => bulkArchiveCaptures(emails))}
            disabled={pending}
            className="font-sans text-[12px] text-text-muted hover:text-text-secondary disabled:opacity-50"
          >
            Archive
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${selected.size} captures permanently (Circle signup + application)?`))
                run(() => bulkDeleteCaptures(emails));
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
              onClick={() => run(() => addCapturesToCampaign(emails, campaign))}
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
              {["Name", "Email", "Phone", "Campaign", "Budget", "Timeline", "Last activity", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email} className={`border-b border-border-subtle hover:bg-bg-secondary ${selected.has(r.email) ? "bg-accent-gold/5" : "bg-bg-card"}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(r.email)} onChange={() => toggle(r.email)} className="h-4 w-4 accent-accent-gold" />
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-primary">{r.name || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm">
                  <a href={`mailto:${r.email}`} className="text-accent-gold hover:text-accent-gold-light">{r.email}</a>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">
                  {r.phone ? <a href={`tel:${r.phone}`} className="hover:text-accent-gold">{r.phone}</a> : "—"}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-muted">{r.campaign}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.budget || "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{r.timeline || "—"}</td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">{r.lastActivity}</td>
                <td className="px-4 py-3"><IncompleteActions email={r.email} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center font-sans text-sm text-text-muted">No incomplete founding-interest captures.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
