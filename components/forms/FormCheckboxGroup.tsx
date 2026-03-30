"use client";

interface FormCheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export default function FormCheckboxGroup({
  label,
  options,
  values,
  onChange,
  error,
}: FormCheckboxGroupProps) {
  const toggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary">
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${
              values.includes(opt.value)
                ? "border-accent-gold bg-accent-gold/5"
                : "border-border bg-bg-card hover:border-border-subtle"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 items-center justify-center border ${
                values.includes(opt.value)
                  ? "border-accent-gold bg-accent-gold"
                  : "border-text-muted"
              }`}
            >
              {values.includes(opt.value) && (
                <svg
                  className="h-3 w-3 text-bg-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span className="font-sans text-sm text-text-primary">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="font-sans text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
