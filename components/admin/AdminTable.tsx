"use client";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data found.",
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="border border-border bg-bg-card p-8 text-center">
        <p className="font-sans text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-bg-secondary">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-border-subtle bg-bg-card transition-colors hover:bg-bg-secondary ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 font-sans text-sm text-text-secondary"
                >
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
