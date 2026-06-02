"use client";

import { useTransition } from "react";
import { archiveLead, deleteLead } from "@/lib/actions/leads";

export default function LeadRowActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-3">
      {status !== "archived" && (
        <button
          onClick={() => start(() => archiveLead(id))}
          disabled={pending}
          className="font-sans text-[12px] text-text-muted transition-colors hover:text-text-secondary disabled:opacity-50"
        >
          Archive
        </button>
      )}
      <button
        onClick={() => {
          if (
            confirm(
              "Delete this lead permanently? Its interactions and partner assignments will also be removed. This cannot be undone."
            )
          ) {
            start(() => deleteLead(id));
          }
        }}
        disabled={pending}
        className="font-sans text-[12px] text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
