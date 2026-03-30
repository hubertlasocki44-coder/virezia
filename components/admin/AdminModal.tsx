"use client";

import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AdminModal({
  title,
  open,
  onClose,
  children,
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg border border-border bg-bg-secondary p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-muted transition-colors hover:text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
