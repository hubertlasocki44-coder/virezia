"use client";

import { useLang } from "@/lib/lang";
import { t } from "@/lib/translations";
import Link from "next/link";
import { StatusChanger, AddNote, LogContact } from "./LeadActions";
import ContactBadge from "@/components/ContactBadge";
import type { LeadHealth } from "@/lib/leads-health";

interface Props {
  leadId: string;
  currentStatus: string;
  health: { state: LeadHealth["state"]; label: string };
  isFullAccess: boolean;
  clientEmail?: string;
  clientPhone?: string;
  buyerProfile: Record<string, unknown> | null;
  stepData: Record<string, unknown>;
  leadNotes: string | null;
  interactions: { id: string; type: string; created_at: string; content: string; creator: { full_name?: string } | null }[];
  formatValue: (v: unknown) => string;
  initials: string;
  clientName: string;
  score: number;
  priority: string;
}

export default function LeadDetailLang({
  leadId, currentStatus, health, isFullAccess,
  clientEmail, clientPhone, buyerProfile, stepData, leadNotes,
  interactions, formatValue, initials, clientName, score, priority,
}: Props) {
  const { lang } = useLang();

  const typeColors: Record<string, string> = {
    email: "text-blue-400 bg-blue-400/10",
    note: "text-white/50 bg-white/[0.04]",
    status_change: "text-[#c9a96e] bg-[#c9a96e]/10",
    call: "text-green-400 bg-green-400/10",
    meeting: "text-purple-400 bg-purple-400/10",
  };

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1 font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors">
        {t("lead_back", lang)}
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <span className="font-sans text-[14px] font-medium text-white/50">{initials}</span>
        </div>
        <div className="flex-1">
          <h1 className="font-sans text-[22px] font-medium text-white/90 tracking-tight">{clientName}</h1>
          {isFullAccess ? (
            <p className="mt-0.5 font-sans text-[13px] text-white/30">
              {clientEmail}{clientPhone ? ` · ${clientPhone}` : ""}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 pb-6 border-b border-white/[0.06]">
        <StatusChanger leadId={leadId} currentStatus={currentStatus} />
        <ContactBadge state={health.state} label={health.label} />
        {priority !== "medium" ? (
          <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
            priority === "high" || priority === "urgent" ? "bg-red-500/10 text-red-400" : "bg-white/[0.04] text-white/40"
          }`}>{priority}</span>
        ) : null}
        {score > 0 ? (
          <span className="px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider bg-[#c9a96e]/10 text-[#c9a96e]">
            Score: {score}/100
          </span>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {isFullAccess && buyerProfile ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">{t("lead_buyer_profile", lang)}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Budget", buyerProfile.budget_range],
                  ["Timeline", buyerProfile.timeline],
                  ["Investment Type", buyerProfile.investment_type],
                  ["Regions", (buyerProfile.regions_interest as string[])?.join(", ")],
                  ["Purpose", buyerProfile.purpose],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string}>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-white/25">{label as string}</p>
                    <p className="mt-1 font-sans text-[13px] text-white/70">{formatValue(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {isFullAccess && Object.keys(stepData).length > 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">{t("lead_app_data", lang)}</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stepData)
                  .filter(([key]) => !["submitted_at","utm_source","utm_medium","utm_campaign","utm_content","utm_term","full_name","email","phone"].includes(key))
                  .filter(([, v]) => v !== null && v !== undefined && v !== "")
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="font-sans text-[10px] uppercase tracking-wider text-white/25">{key.replace(/_/g, " ")}</p>
                      <p className="mt-1 font-sans text-[13px] text-white/70">{formatValue(value)}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {leadNotes ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">{t("lead_notes", lang)}</h2>
              <p className="font-sans text-[13px] text-white/50 leading-relaxed">{leadNotes}</p>
            </div>
          ) : null}

          {!isFullAccess ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
              <p className="font-sans text-[13px] text-white/30">{t("lead_restricted", lang)}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">{t("lead_log_contact", lang)}</h2>
            <LogContact leadId={leadId} />
            <p className="mt-2 font-sans text-[11px] text-white/20">{t("lead_log_desc", lang)}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-3">{t("lead_add_note", lang)}</h2>
            <AddNote leadId={leadId} />
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-sans text-[11px] uppercase tracking-wider text-[#c9a96e] mb-4">{t("lead_activity", lang)}</h2>
            <div className="space-y-4">
              {interactions.map((i) => (
                <div key={i.id} className="relative pl-4 border-l border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${typeColors[i.type] || "text-white/40 bg-white/[0.04]"}`}>
                      {i.type}
                    </span>
                    <span className="font-sans text-[10px] text-white/20">
                      {new Date(i.created_at).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="font-sans text-[12px] text-white/50 leading-relaxed">{i.content}</p>
                  {i.creator?.full_name ? (
                    <p className="mt-1 font-sans text-[10px] text-white/15">{i.creator.full_name}</p>
                  ) : null}
                </div>
              ))}
              {interactions.length === 0 ? (
                <p className="font-sans text-[12px] text-white/20">{t("lead_no_activity", lang)}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
