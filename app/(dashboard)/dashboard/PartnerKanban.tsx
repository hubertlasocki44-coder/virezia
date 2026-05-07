"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { updateLeadStatus } from "@/lib/actions/partner-actions";

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

const KANBAN_COLUMNS = [
  { status: "new", label: "New", color: "#c9a96e" },
  { status: "screening", label: "Screening", color: "#8b7355" },
  { status: "qualified", label: "Qualified", color: "#5a9e6f" },
  { status: "matched", label: "Matched", color: "#c084fc" },
  { status: "in_progress", label: "In Progress", color: "#5a8ac9" },
  { status: "closed_won", label: "Won", color: "#4ade80" },
  { status: "closed_lost", label: "Lost", color: "#6b7280" },
  { status: "archived", label: "Archived", color: "#4b5563" },
];

function LeadCard({ assignment }: { assignment: LeadAssignment }) {
  const lead = assignment.lead;
  const client = lead.client;
  const initials = (client?.full_name || client?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/leads/${lead.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#141414] border border-white/[0.06] rounded-lg p-4 hover:border-white/[0.12] transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
            <span className="font-sans text-[10px] font-medium text-white/50">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[13px] text-white/90 truncate group-hover:text-white transition-colors">
              {client?.full_name || client?.email || "Anonymous"}
            </p>
            {lead.notes ? (
              <p className="mt-1 font-sans text-[11px] text-white/30 line-clamp-2 leading-relaxed">
                {lead.notes}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {lead.priority === "high" || lead.priority === "urgent" ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400">
              {lead.priority}
            </span>
          ) : null}
          {lead.score > 0 ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-[#c9a96e]/10 text-[#c9a96e]">
              {lead.score}pts
            </span>
          ) : null}
          <span className="ml-auto font-sans text-[10px] text-white/20">
            {new Date(assignment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

function KanbanColumn({
  status,
  label,
  color,
  assignments,
  onDrop,
}: {
  status: string;
  label: string;
  color: string;
  assignments: LeadAssignment[];
  onDrop: (leadId: string, newStatus: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex-1 min-w-[240px] rounded-xl transition-all ${
        dragOver ? "bg-white/[0.04] ring-1 ring-white/[0.08]" : ""
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const leadId = e.dataTransfer.getData("leadId");
        if (leadId) onDrop(leadId, status);
      }}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-1 py-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-sans text-[12px] font-medium text-white/60">{label}</h3>
        <span className="ml-auto font-sans text-[11px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">
          {assignments.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2 min-h-[120px] px-1 pb-2">
        <AnimatePresence>
          {assignments.map((a) => (
            <div
              key={a.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("leadId", a.lead.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <LeadCard assignment={a} />
            </div>
          ))}
        </AnimatePresence>
        {assignments.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] border border-dashed border-white/[0.06] rounded-lg">
            <p className="font-sans text-[11px] text-white/15">Drop here</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PartnerKanban({ assignments }: { assignments: LeadAssignment[] }) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleDrop = async (leadId: string, newStatus: string) => {
    setUpdating(leadId);
    await updateLeadStatus(leadId, newStatus);
    setUpdating(null);
  };

  const groupedByStatus = KANBAN_COLUMNS.map((col) => ({
    ...col,
    assignments: assignments.filter((a) => a.lead.status === col.status),
  }));

  // Show all columns — no filtering
  const activeColumns = groupedByStatus;

  return (
    <div>
      {updating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 font-sans text-[11px] text-[#c9a96e]"
        >
          Updating...
        </motion.div>
      ) : null}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1">
        {activeColumns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            color={col.color}
            assignments={col.assignments}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
