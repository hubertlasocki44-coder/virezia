interface AdminCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function AdminCard({ label, value, sub }: AdminCardProps) {
  return (
    <div className="border border-border bg-bg-card p-6">
      <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-[32px] font-light text-text-primary">
        {value}
      </p>
      {sub && (
        <p className="mt-1 font-sans text-[12px] text-text-secondary">{sub}</p>
      )}
    </div>
  );
}
