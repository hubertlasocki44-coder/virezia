"use client";

import { updateAuditStatus } from "@/lib/actions/audits";

export default function AuditActions({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex gap-2">
      {status === "pending" && (
        <button
          onClick={() => updateAuditStatus(id, "in_progress")}
          className="font-sans text-[12px] text-accent-gold hover:text-accent-gold-light"
        >
          Start
        </button>
      )}
      {status === "in_progress" && (
        <button
          onClick={() => updateAuditStatus(id, "completed")}
          className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300"
        >
          Complete
        </button>
      )}
      {(status === "pending" || status === "in_progress") && (
        <button
          onClick={() => updateAuditStatus(id, "cancelled")}
          className="font-sans text-[12px] text-red-400 hover:text-red-300"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
