"use client";

import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full border bg-bg-card px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none transition-colors ${
            error ? "border-red-500/50" : "border-border"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="font-sans text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
