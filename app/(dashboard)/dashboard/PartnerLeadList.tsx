"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadAssignment {
  id: string;
  visibility_level: string;
  created_at: string;
  lead: {
    id: string;
    status: string;
    priority: string;
    notes: string | null;
    score: number;
    client: {
      full_name: string | null;
      email: string;
    };
  };
}

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

export default function PartnerLeadList({ assignments }: { assignments: LeadAssignment[] }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? assignments
    : assignments.filter((a) => a.lead.status === filter);

  // Count per status for tab badges
  const counts: Record<string, number> = { all: assignments.length };
  assignments.forEach((a) => {
    counts[a.lead.status] = (counts[a.lead.status] || 0) + 1;
  });

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
              onClick={() => setFilter(tab.value)}
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

      {/* Lead list */}
      <div className="mt-4 border border-white/[0.06] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-sans text-[13px] text-white/25">No leads with this status.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-wider text-white/25">Name</th>
                <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-wider text-white/25 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-wider text-white/25">Status</th>
                <th className="px-4 py-3 text-right font-sans text-[10px] uppercase tracking-wider text-white/25 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
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
                        {lead.notes ? (
                          <p className="font-sans text-[11px] text-white/20 mt-0.5 line-clamp-1">{lead.notes}</p>
                        ) : null}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-sans text-[12px] text-white/30">
                        {client?.email || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[lead.status] || "bg-white/[0.04] text-white/30"}`}>
                        {lead.status}
                      </span>
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
        )}
      </div>
    </div>
  );
}
