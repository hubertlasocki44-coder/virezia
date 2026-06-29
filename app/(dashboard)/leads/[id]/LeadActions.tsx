"use client";

import { useState } from "react";
import { updateLeadStatus, addLeadNote, logContact } from "@/lib/actions/partner-actions";
import { useLang } from "@/lib/lang";
import { t } from "@/lib/translations";

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
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 font-sans text-[12px] text-white/70 focus:border-[#c9a96e]/50 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value} className="bg-[#141414]">{s.label}</option>
        ))}
      </select>
      {loading ? <span className="font-sans text-[10px] text-[#c9a96e] animate-pulse">Saving...</span> : null}
    </div>
  );
}

const CHANNELS = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "meeting", label: "Meeting" },
] as const;

export function LogContact({ leadId }: { leadId: string }) {
  const { lang } = useLang();
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["value"]>("call");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async () => {
    setLoading(true);
    await logContact(leadId, channel);
    setLoading(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value as (typeof CHANNELS)[number]["value"])}
        disabled={loading}
        className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 font-sans text-[12px] text-white/70 focus:border-[#c9a96e]/50 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
      >
        {CHANNELS.map((c) => (
          <option key={c.value} value={c.value} className="bg-[#141414]">{c.label}</option>
        ))}
      </select>
      <button
        onClick={handle}
        disabled={loading}
        className="bg-[#c9a96e]/15 hover:bg-[#c9a96e]/25 border border-[#c9a96e]/30 rounded-lg px-4 py-2 font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] transition-all disabled:opacity-40"
      >
        {loading ? t("lead_logging", lang) : done ? t("lead_logged", lang) : t("lead_log_btn", lang)}
      </button>
    </div>
  );
}

export function AddNote({ leadId }: { leadId: string }) {
  const { lang } = useLang();
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
    <form onSubmit={handleSubmit}>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("lead_note_placeholder", lang)}
        rows={3}
        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 font-sans text-[13px] text-white/70 placeholder:text-white/15 focus:border-white/[0.12] focus:outline-none resize-none"
      />
      <button
        type="submit"
        disabled={loading || !note.trim()}
        className="mt-2 w-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg px-4 py-2.5 font-sans text-[11px] uppercase tracking-wider text-white/50 hover:text-white/70 transition-all disabled:opacity-30"
      >
        {loading ? t("lead_saving", lang) : t("lead_add_note_btn", lang)}
      </button>
    </form>
  );
}
