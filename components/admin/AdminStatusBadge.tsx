const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  screening: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  matched: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  in_progress: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
  closed_won: "bg-green-500/10 text-green-400 border-green-500/20",
  closed_lost: "bg-red-500/10 text-red-400 border-red-500/20",
  archived: "bg-text-muted/10 text-text-muted border-text-muted/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  pending_verification: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-text-muted/10 text-text-muted border-text-muted/20",
  revoked: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface AdminStatusBadgeProps {
  status: string;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const colors = STATUS_COLORS[status] || "bg-bg-card text-text-muted border-border";

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-sans text-[11px] uppercase tracking-[0.05em] ${colors}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
