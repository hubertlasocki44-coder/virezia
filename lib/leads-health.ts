// Lead-response health: derived from lead_assignments + interactions.
// No schema change — "contacted" / "response time" / "at risk" are computed.
//
// SLA (confirmed with founder): a lead not contacted within 48h is at risk;
// a contacted lead with no activity for 14 days goes stale (also at risk).

export const SLA_HOURS = 48;
export const STALE_DAYS = 14;

const HOUR = 3_600_000;
const DAY = 86_400_000;

// Interaction types that count as a partner "touching" the lead.
const RESPONSE_TYPES = new Set(["call", "note", "email", "meeting", "whatsapp", "status_change"]);
const CLOSED_STATUSES = new Set(["closed_won", "closed_lost", "archived"]);

export type ContactState = "not_contacted" | "at_risk" | "contacted" | "closed";

export interface LeadInteraction {
  created_by: string | null;
  created_at: string;
  type: string;
}

export interface LeadHealth {
  state: ContactState;
  contacted: boolean;
  /** ms between assignment and first partner response (null if never contacted) */
  firstResponseMs: number | null;
  lastActivityAt: string | null;
  ageMs: number; // since assignment
  msSinceActivity: number | null;
  label: string; // human-readable badge text
}

export function humanizeDuration(ms: number): string {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / 60000))}m`;
  if (ms < 2 * DAY) return `${Math.round(ms / HOUR)}h`;
  return `${Math.round(ms / DAY)}d`;
}

export function computeLeadHealth(args: {
  assignedAt: string;
  partnerId: string;
  status: string;
  interactions: LeadInteraction[];
  now?: number;
}): LeadHealth {
  const now = args.now ?? Date.now();
  const assigned = new Date(args.assignedAt).getTime();
  const ageMs = Math.max(0, now - assigned);

  const partnerTouches = args.interactions
    .filter((i) => i.created_by === args.partnerId && RESPONSE_TYPES.has(i.type))
    .map((i) => new Date(i.created_at).getTime())
    .sort((a, b) => a - b);

  const contacted = partnerTouches.length > 0;
  const firstResponseMs = contacted ? Math.max(0, partnerTouches[0] - assigned) : null;
  const lastActivity = contacted ? partnerTouches[partnerTouches.length - 1] : null;
  const msSinceActivity = lastActivity ? now - lastActivity : null;

  // Closed leads are out of the active SLA window.
  if (CLOSED_STATUSES.has(args.status)) {
    return {
      state: "closed",
      contacted,
      firstResponseMs,
      lastActivityAt: lastActivity ? new Date(lastActivity).toISOString() : null,
      ageMs,
      msSinceActivity,
      label: "Closed",
    };
  }

  if (!contacted) {
    const atRisk = ageMs > SLA_HOURS * HOUR;
    return {
      state: atRisk ? "at_risk" : "not_contacted",
      contacted: false,
      firstResponseMs: null,
      lastActivityAt: null,
      ageMs,
      msSinceActivity: null,
      label: `Not contacted · ${humanizeDuration(ageMs)}`,
    };
  }

  const stale = (msSinceActivity ?? 0) > STALE_DAYS * DAY;
  return {
    state: stale ? "at_risk" : "contacted",
    contacted: true,
    firstResponseMs,
    lastActivityAt: new Date(lastActivity as number).toISOString(),
    ageMs,
    msSinceActivity,
    label: stale
      ? `At risk · no activity ${humanizeDuration(msSinceActivity as number)}`
      : `Contacted · ${humanizeDuration(msSinceActivity as number)} ago`,
  };
}

export interface HealthSummary {
  total: number;
  notContacted: number;
  atRisk: number;
  contacted: number;
  avgResponseMs: number | null;
  avgResponseLabel: string;
}

export function summarizeHealth(items: LeadHealth[]): HealthSummary {
  const open = items.filter((h) => h.state !== "closed");
  const notContacted = open.filter((h) => h.state === "not_contacted").length;
  const atRisk = open.filter((h) => h.state === "at_risk").length;
  const contacted = items.filter((h) => h.contacted).length;
  const responses = items.map((h) => h.firstResponseMs).filter((v): v is number => v != null);
  const avgResponseMs = responses.length ? responses.reduce((a, b) => a + b, 0) / responses.length : null;
  return {
    total: items.length,
    notContacted,
    atRisk,
    contacted,
    avgResponseMs,
    avgResponseLabel: avgResponseMs == null ? "—" : humanizeDuration(avgResponseMs),
  };
}
