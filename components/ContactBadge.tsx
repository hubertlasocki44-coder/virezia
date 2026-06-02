import type { ContactState } from "@/lib/leads-health";

const STYLES: Record<ContactState, string> = {
  not_contacted: "bg-red-500/15 text-red-400",
  at_risk: "bg-amber-500/15 text-amber-400",
  contacted: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-white/[0.06] text-white/40",
};

export default function ContactBadge({ state, label }: { state: ContactState; label: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STYLES[state]}`}
    >
      {label}
    </span>
  );
}
