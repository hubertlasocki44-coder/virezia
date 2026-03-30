"use client";

import { forwardRef, useId } from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    const autoId = useId();
    return (
      <div className="space-y-2">
        <label htmlFor={autoId} className="block font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary">
          {label}
        </label>
        <select
          id={autoId}
          ref={ref}
          className={`w-full border bg-bg-card px-4 py-3 font-sans text-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors appearance-none ${
            error ? "border-red-500/50" : "border-border"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-text-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="font-sans text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
