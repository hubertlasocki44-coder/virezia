"use client";

import { useState } from "react";
import { updateLeadStatus, addLeadNote } from "@/lib/actions/partner-actions";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "screening", label: "Screening" },
  { value: "qualified", label: "Qualified" },
  { value: "matched", label: "Matched" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

export function StatusChanger({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    await updateLeadStatus(leadId, newStatus);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status:</span>
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-bg-card border border-border px-3 py-1.5 font-sans text-sm text-text-primary focus:border-accent-gold focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {loading ? <span className="font-sans text-[11px] text-accent-gold">Saving...</span> : null}
    </div>
  );
}

export function AddNote({ leadId }: { leadId: string }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    await addLeadNote(leadId, note);
    setNote("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note or comment..."
        rows={3}
        className="w-full border border-border bg-bg-card px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-none"
      />
      <button
        type="submit"
        disabled={loading || !note.trim()}
        className="mt-2 bg-accent-gold px-6 py-2 font-sans text-[12px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Note"}
      </button>
    </form>
  );
}
