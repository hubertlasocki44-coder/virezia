"use client";

import { forwardRef, useId } from "react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const autoId = useId();
    return (
      <div className="space-y-2">
        <label htmlFor={autoId} className="block font-sans text-[12px] uppercase tracking-[0.1em] text-text-secondary">
          {label}
        </label>
        <textarea
          id={autoId}
          ref={ref}
          className={`w-full border bg-bg-card px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none transition-colors min-h-[120px] resize-y ${
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

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
