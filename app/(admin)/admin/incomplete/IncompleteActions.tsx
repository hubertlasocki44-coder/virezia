"use client";

import { useTransition } from "react";
import { archiveIncompleteCapture, deleteIncompleteCapture } from "@/lib/actions/leads";

export default function IncompleteActions({ email }: { email: string }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => start(() => archiveIncompleteCapture(email))}
        disabled={pending}
        className="font-sans text-[12px] text-text-muted transition-colors hover:text-text-secondary disabled:opacity-50"
      >
        Archive
      </button>
      <button
        onClick={() => {
          if (
            confirm(
              `Delete the capture for ${email} permanently? This purges their Circle signup and campaign application. This cannot be undone.`
            )
          ) {
            start(() => deleteIncompleteCapture(email));
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
