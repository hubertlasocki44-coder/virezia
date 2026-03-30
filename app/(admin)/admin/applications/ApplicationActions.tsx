"use client";

import { updateApplicationStatus, convertToLead } from "@/lib/actions/applications";
import { useState } from "react";

interface Props {
  id: string;
  status: string;
  hasUser: boolean;
}

export default function ApplicationActions({ id, status, hasUser }: Props) {
  const [loading, setLoading] = useState(false);

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
    <div className="flex gap-2">
      {status === "pending" && (
        <>
          <button
            onClick={() => updateApplicationStatus(id, "screening")}
            className="font-sans text-[12px] text-accent-gold hover:text-accent-gold-light"
          >
            Screen
          </button>
          <button
            onClick={() => updateApplicationStatus(id, "rejected")}
            className="font-sans text-[12px] text-red-400 hover:text-red-300"
          >
            Reject
          </button>
        </>
      )}
      {(status === "screening" || status === "qualified") && hasUser && (
        <button
          onClick={handleConvert}
          disabled={loading}
          className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert to Lead"}
        </button>
      )}
    </div>
  );
}
