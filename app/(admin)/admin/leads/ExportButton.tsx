"use client";

import { useState } from "react";

export default function ExportButton({ campaign = "las_orcas" }: { campaign?: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/leads/export?campaign=${campaign}`);
      if (!res.ok) { alert("Export failed."); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `las-orcas-leads-${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="border border-border bg-bg-card px-4 py-1.5 font-sans text-[12px] uppercase tracking-[0.05em] text-text-muted transition-colors hover:border-text-muted hover:text-text-secondary disabled:opacity-50"
    >
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  );
}
