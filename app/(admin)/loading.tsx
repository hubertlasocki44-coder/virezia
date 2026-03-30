export default function AdminLoading() {
  return (
    <div className="ml-[240px] p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-bg-card" />
        <div className="h-4 w-32 rounded bg-bg-card" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded border border-border bg-bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
