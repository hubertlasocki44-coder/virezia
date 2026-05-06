"use client";

import { useState } from "react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
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
  { status: "new", label: "New" },
  { status: "screening", label: "Screening" },
  { status: "qualified", label: "Qualified" },
  { status: "in_progress", label: "In Progress" },
  { status: "closed_won", label: "Won" },
  { status: "closed_lost", label: "Lost" },
];

function LeadCard({ assignment }: { assignment: LeadAssignment }) {
  const lead = assignment.lead;
  const client = lead.client;

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="block border border-border bg-bg-primary p-3 transition-colors hover:border-accent-gold/30 mb-2"
    >
      <p className="font-sans text-sm text-text-primary truncate">
        {client?.full_name || client?.email || "Anonymous"}
      </p>
      {lead.priority && lead.priority !== "medium" ? (
        <span className={`inline-block mt-1 font-sans text-[10px] uppercase tracking-[0.1em] ${
          lead.priority === "high" || lead.priority === "urgent" ? "text-red-400" : "text-text-muted"
        }`}>
          {lead.priority}
        </span>
      ) : null}
      {lead.score > 0 ? (
        <span className="inline-block mt-1 ml-2 font-sans text-[10px] text-accent-gold">
          Score: {lead.score}
        </span>
      ) : null}
      {lead.notes ? (
        <p className="mt-1 font-sans text-[11px] text-text-muted line-clamp-2">{lead.notes}</p>
      ) : null}
    </Link>
  );
}

function KanbanColumn({
  status,
  label,
  assignments,
  onDrop,
}: {
  status: string;
  label: string;
  assignments: LeadAssignment[];
  onDrop: (leadId: string, newStatus: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex-1 min-w-[200px] border border-border bg-bg-card p-3 transition-colors ${
        dragOver ? "border-accent-gold/50 bg-bg-secondary" : ""
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">{label}</h3>
        <span className="font-sans text-[11px] text-text-muted">{assignments.length}</span>
      </div>
      <div className="space-y-0">
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

  // Only show columns that have leads or are key stages
  const activeColumns = groupedByStatus.filter(
    (col) => col.assignments.length > 0 || ["new", "screening", "in_progress", "closed_won"].includes(col.status)
  );

  return (
    <div>
      {updating ? (
        <p className="font-sans text-[11px] text-accent-gold mb-2">Updating status...</p>
      ) : null}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {activeColumns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            assignments={col.assignments}
            onDrop={handleDrop}
          />
        ))}
      </div>
      <p className="mt-2 font-sans text-[11px] text-text-muted">
        Drag leads between columns to update status.
      </p>
    </div>
  );
}
