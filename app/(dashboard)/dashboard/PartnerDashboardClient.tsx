"use client";

import { useLang } from "@/lib/lang";
import { t } from "@/lib/translations";
import PartnerLeadList from "./PartnerLeadList";
import type { LeadHealth } from "@/lib/leads-health";

interface Assignment {
  id: string;
  created_at: string;
  health?: { state: LeadHealth["state"]; label: string } | null;
  lead: {
    id: string;
    status: string;
    priority: string;
    notes: string | null;
    score: number;
    client: { full_name: string | null; email: string; phone: string | null };
  };
}

interface Props {
  companyName: string | null;
  totalAssigned: number;
  statusCounts: Record<string, number>;
  summary: { notContacted: number; atRisk: number; avgResponseLabel: string };
  assignments: Assignment[];
}

export default function PartnerDashboardClient({
  companyName,
  totalAssigned,
  statusCounts,
  summary,
  assignments,
}: Props) {
  const { lang } = useLang();

  const statCards = [
    { key: "dash_total",       value: totalAssigned, color: "white/90" },
    { key: "dash_new",         value: statusCounts["new"] || 0, color: "[#c9a96e]" },
    { key: "dash_in_progress", value: (statusCounts["screening"] || 0) + (statusCounts["qualified"] || 0) + (statusCounts["in_progress"] || 0), color: "[#5a8ac9]" },
    { key: "dash_won",         value: statusCounts["closed_won"] || 0, color: "[#4ade80]" },
  ] as const;

  const healthCards = [
    { key: "dash_not_contacted", value: summary.notContacted, color: "red-400" },
    { key: "dash_at_risk",       value: summary.atRisk, color: "amber-400" },
    { key: "dash_avg_response",  value: summary.avgResponseLabel, color: "white/90" },
  ] as const;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-sans text-[24px] font-medium text-white/90 tracking-tight">
            {t("dash_title", lang)}
          </h1>
          <p className="mt-1 font-sans text-[13px] text-white/30">
            {companyName ? `${companyName} — ` : ""}
            {totalAssigned} {t("dash_total_leads", lang)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="font-sans text-[11px] text-white/30 uppercase tracking-wider">{t(s.key, lang)}</p>
            <p className={`mt-2 font-sans text-[28px] font-light text-${s.color} tracking-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {healthCards.map((s) => (
          <div key={s.key} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="font-sans text-[11px] text-white/30 uppercase tracking-wider">{t(s.key, lang)}</p>
            <p className={`mt-2 font-sans text-[28px] font-light text-${s.color} tracking-tight`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {assignments.length > 0 ? (
          <PartnerLeadList assignments={assignments as unknown as Parameters<typeof PartnerLeadList>[0]["assignments"]} />
        ) : (
          <div className="flex items-center justify-center h-[300px] border border-dashed border-white/[0.06] rounded-xl">
            <div className="text-center">
              <p className="font-sans text-[15px] text-white/30">{t("dash_no_leads", lang)}</p>
              <p className="mt-1 font-sans text-[12px] text-white/15">{t("dash_no_leads_sub", lang)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
