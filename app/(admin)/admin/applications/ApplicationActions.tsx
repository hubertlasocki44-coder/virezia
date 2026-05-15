"use client";

import { updateApplicationStatus, convertToLead } from "@/lib/actions/applications";
import { useState } from "react";

interface Props {
  id: string;
  status: string;
  hasUser: boolean;
}

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "screening", label: "Screening" },
  { value: "qualified", label: "Qualified" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export default function ApplicationActions({ id, status, hasUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await updateApplicationStatus(id, newStatus);
    setCurrentStatus(newStatus);
    setLoading(false);
  };

  const handleConvert = async () => {
    setLoading(true);
    try {
      await convertToLead(id);
    } catch {
      alert("Failed to convert. User account may be required.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
        className="bg-bg-card border border-border px-2 py-1 font-sans text-[12px] text-text-primary focus:border-accent-gold focus:outline-none disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {hasUser && !["rejected", "archived"].includes(currentStatus) && (
        <button
          onClick={handleConvert}
          disabled={loading}
          className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
        >
          {loading ? "..." : "→ Lead"}
        </button>
      )}
    </div>
  );
}
