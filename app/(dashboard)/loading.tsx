export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-bg-card" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded border border-border bg-bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
