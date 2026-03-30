"use client";

import { approvePartner, suspendPartner, rejectPartner } from "@/lib/actions/partners";

export default function PartnerActions({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex gap-2">
      {status === "pending_verification" && (
        <>
          <button
            onClick={() => approvePartner(id)}
            className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300"
          >
            Approve
          </button>
          <button
            onClick={() => rejectPartner(id)}
            className="font-sans text-[12px] text-red-400 hover:text-red-300"
          >
            Reject
          </button>
        </>
      )}
      {status === "active" && (
        <button
          onClick={() => suspendPartner(id)}
          className="font-sans text-[12px] text-yellow-400 hover:text-yellow-300"
        >
          Suspend
        </button>
      )}
      {status === "suspended" && (
        <button
          onClick={() => approvePartner(id)}
          className="font-sans text-[12px] text-emerald-400 hover:text-emerald-300"
        >
          Reactivate
        </button>
      )}
    </div>
  );
}
