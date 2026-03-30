"use client";

interface FormRadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function FormRadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: FormRadioGroupProps) {
  return (
    <div className="space-y-3">
      <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${
              value === opt.value
                ? "border-accent-gold bg-accent-gold/5"
                : "border-border bg-bg-card hover:border-border-subtle"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                value === opt.value
                  ? "border-accent-gold"
                  : "border-text-muted"
              }`}
            >
              {value === opt.value && (
                <span className="h-2 w-2 rounded-full bg-accent-gold" />
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
