"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ContactBadge from "@/components/ContactBadge";
import type { ContactState } from "@/lib/leads-health";

interface LeadAssignment {
  id: string;
  visibility_level: string;
  created_at: string;
  health?: { state: ContactState; label: string } | null;
  lead: {
    id: string;
    status: string;
    priority: string;
    notes: string | null;
    score: number;
    client: {
      full_name: string | null;
      email: string;
      phone: string | null;
    };
  };
}

const CONTACT_FILTERS = [
  { value: "all", label: "All" },
  { value: "not_contacted", label: "Not contacted" },
  { value: "at_risk", label: "At risk" },
] as const;

const TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "qualified", label: "Qualified" },
  { value: "matched", label: "Matched" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[#c9a96e]/15 text-[#c9a96e]",
  screening: "bg-white/[0.06] text-white/50",
  qualified: "bg-green-500/15 text-green-400",
  matched: "bg-purple-500/15 text-purple-400",
  in_progress: "bg-blue-500/15 text-blue-400",
  closed_won: "bg-green-500/15 text-green-400",
  closed_lost: "bg-white/[0.04] text-white/30",
  archived: "bg-white/[0.04] text-white/30",
};

type SortKey = "name" | "email" | "status" | "date";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export default function PartnerLeadList({ assignments }: { assignments: LeadAssignment[] }) {
  const [filter, setFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState<(typeof CONTACT_FILTERS)[number]["value"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = assignments
    .filter((a) => filter === "all" || a.lead.status === filter)
    .filter((a) => contactFilter === "all" || a.health?.state === contactFilter);

  const contactCounts: Record<string, number> = { all: assignments.length };
  assignments.forEach((a) => {
    if (a.health?.state) contactCounts[a.health.state] = (contactCounts[a.health.state] || 0) + 1;
  });

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.lead.client?.full_name || "").localeCompare(b.lead.client?.full_name || "");
          break;
        case "email":
          cmp = (a.lead.client?.email || "").localeCompare(b.lead.client?.email || "");
          break;
        case "status":
          cmp = a.lead.status.localeCompare(b.lead.status);
          break;
        case "date":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
    setPage(0);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setPage(0);
  };

  const counts: Record<string, number> = { all: assignments.length };
  assignments.forEach((a) => {
    counts[a.lead.status] = (counts[a.lead.status] || 0) + 1;
  });

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  };

  const thClass = "px-4 py-3 text-left font-sans text-[10px] uppercase tracking-wider text-white/25 cursor-pointer hover:text-white/50 transition-colors select-none";

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-1">
        {TABS.map((tab) => {
          const count = counts[tab.value] || 0;
          if (tab.value !== "all" && count === 0) return null;
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilter(tab.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-sans text-[12px] transition-all whitespace-nowrap ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                active ? "bg-white/[0.1] text-white/70" : "bg-white/[0.04] text-white/25"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contact health filter */}
      <div className="mt-2 flex gap-1">
        {CONTACT_FILTERS.map((cf) => {
          const count = contactCounts[cf.value] || 0;
          const active = contactFilter === cf.value;
          const tone =
            cf.value === "not_contacted"
              ? "text-red-400"
              : cf.value === "at_risk"
              ? "text-amber-400"
              : "text-white/50";
          return (
            <button
              key={cf.value}
              onClick={() => {
                setContactFilter(cf.value);
                setPage(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-sans text-[12px] transition-all ${
                active ? "bg-white/[0.08] text-white" : `${tone} hover:bg-white/[0.03]`
              }`}
            >
              {cf.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/[0.1] text-white/70" : "bg-white/[0.04] text-white/25"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lead list */}
      <div className="mt-4 border border-white/[0.06] rounded-xl overflow-hidden">
        {sorted.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-sans text-[13px] text-white/25">No leads with this status.</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className={thClass} onClick={() => handleSort("name")}>Name{sortIcon("name")}</th>
                  <th className={`${thClass} hidden sm:table-cell`} onClick={() => handleSort("email")}>Email{sortIcon("email")}</th>
                  <th className={`${thClass} hidden md:table-cell`}>Phone</th>
                  <th className={thClass} onClick={() => handleSort("status")}>Status{sortIcon("status")}</th>
                  <th className={`${thClass} hidden lg:table-cell`}>Contact</th>
                  <th className={`${thClass} text-right hidden sm:table-cell`} onClick={() => handleSort("date")}>Date{sortIcon("date")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a) => {
                  const lead = a.lead;
                  const client = lead.client;
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/leads/${lead.id}`} className="block">
                          <p className="font-sans text-[13px] text-white/80 hover:text-white transition-colors">
                            {client?.full_name || "Anonymous"}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <a href={`mailto:${client?.email}`} className="font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors">
                          {client?.email || "N/A"}
                        </a>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-sans text-[12px] text-white/30">
                          {client?.phone || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[lead.status] || "bg-white/[0.04] text-white/30"}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {a.health ? <ContactBadge state={a.health.state} label={a.health.label} /> : <span className="font-sans text-[11px] text-white/20">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-sans text-[11px] text-white/20">
                          {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
                <p className="font-sans text-[11px] text-white/20">
                  {page * PAGE_SIZE + 1}&#8211;{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 font-sans text-[11px] text-white/40 hover:text-white/70 disabled:text-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 font-sans text-[11px] text-white/40 hover:text-white/70 disabled:text-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
