"use client";

import { useState, useEffect } from "react";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminModal from "@/components/admin/AdminModal";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import FormInput from "@/components/forms/FormInput";
import { createClient } from "@/lib/supabase/client";

const TEMPLATES = [
  { value: "asset_repositioned", label: "Asset Repositioned" },
  { value: "buyer_protected", label: "Buyer Protected" },
  { value: "matched_fast", label: "Matched Fast" },
  { value: "developer_unblocked", label: "Developer Unblocked" },
];

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Record<string, unknown>[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBriefs = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("deal_briefs")
      .select("*")
      .order("created_at", { ascending: false });
    setBriefs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBriefs(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] font-light text-text-primary">Deal Briefs</h1>
          <p className="mt-1 font-sans text-sm text-text-muted">Anonymized proof architecture</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-accent-gold px-5 py-2 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
        >
          New Brief
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading && <p className="font-sans text-sm text-text-muted">Loading...</p>}
        {!loading && briefs.length === 0 && (
          <div className="border border-border bg-bg-card p-8 text-center">
            <p className="font-sans text-sm text-text-muted">No deal briefs yet.</p>
          </div>
        )}
        {briefs.map((b) => (
          <div key={b.id as string} className="border border-border bg-bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.05em] text-accent-gold">
                {(b.template_type as string).replace(/_/g, " ")}
              </span>
              <AdminStatusBadge status={b.published ? "active" : "pending"} />
            </div>
            <p className="mt-3 font-sans text-sm text-text-secondary">{b.content as string}</p>
            {b.metrics ? (
              <div className="mt-3 flex gap-4">
                {Object.entries(b.metrics as Record<string, unknown>).map(([k, v]) => (
                  <span key={k} className="font-sans text-[12px] text-text-muted">
                    {k}: <span className="text-text-secondary">{String(v)}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <NewBriefModal open={showNew} onClose={() => { setShowNew(false); fetchBriefs(); }} />
    </div>
  );
}

function NewBriefModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState("asset_repositioned");
  const [content, setContent] = useState("");
  const [timeMetric, setTimeMetric] = useState("");
  const [outcomeMetric, setOutcomeMetric] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("deal_briefs").insert({
      template_type: type,
      content,
      metrics: { time: timeMetric, outcome: outcomeMetric },
      published,
    });
    setLoading(false);
    setContent("");
    onClose();
  };

  return (
    <AdminModal title="New Deal Brief" open={open} onClose={onClose}>
      <div className="space-y-4">
        <FormSelect label="Template" options={TEMPLATES} value={type} onChange={(e) => setType(e.target.value)} />
        <FormTextarea label="Content (max 5 sentences, anonymized)" value={content} onChange={(e) => setContent(e.target.value)} placeholder="A developer in [region] had been holding [X] units for [Y] months..." />
        <FormInput label="Time Metric" value={timeMetric} onChange={(e) => setTimeMetric(e.target.value)} placeholder="e.g. 14 days from intake to first qualified lead" />
        <FormInput label="Outcome Metric" value={outcomeMetric} onChange={(e) => setOutcomeMetric(e.target.value)} placeholder="e.g. 3 of 8 units placed within 60 days" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          <span className="font-sans text-sm text-text-secondary">Publish immediately</span>
        </label>
        <button
          onClick={handleCreate}
          disabled={!content || loading}
          className="w-full bg-accent-gold px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Brief"}
        </button>
      </div>
    </AdminModal>
  );
}
