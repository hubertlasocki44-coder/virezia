"use client";

import { useState } from "react";
import { signOutAllDevices, saveCommissionSettings } from "./actions";

const DEFAULT_COMMISSION = {
  successFee: "5.0",
  auditTier1: "2500",
  auditTier2: "5000",
  auditTier3: "12000",
};

export default function SettingsClient() {
  const [commission, setCommission] = useState(DEFAULT_COMMISSION);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveCommissionSettings(commission);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    if (!confirm("This will invalidate all active sessions. You will be signed out. Continue?")) {
      return;
    }
    setSigningOut(true);
    await signOutAllDevices();
  };

  return (
    <>
      {/* Commission Settings */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Commission Settings
        </p>
        <div className="mt-4 border border-border bg-bg-card p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-[12px] text-text-muted">
                Success Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={commission.successFee}
                onChange={(e) =>
                  setCommission({ ...commission, successFee: e.target.value })
                }
                className="mt-1 w-full border border-border bg-bg-primary px-3 py-2 font-sans text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
              />
              <p className="mt-1 font-sans text-[11px] text-text-muted">
                Applied on closed transactions
              </p>
            </div>

            <div>
              <label className="block font-sans text-[12px] text-text-muted">
                Audit Tier 1 -- Standard (USD)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={commission.auditTier1}
                onChange={(e) =>
                  setCommission({ ...commission, auditTier1: e.target.value })
                }
                className="mt-1 w-full border border-border bg-bg-primary px-3 py-2 font-sans text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
              />
              <p className="mt-1 font-sans text-[11px] text-text-muted">
                Residential under $500K
              </p>
            </div>

            <div>
              <label className="block font-sans text-[12px] text-text-muted">
                Audit Tier 2 -- Premium (USD)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={commission.auditTier2}
                onChange={(e) =>
                  setCommission({ ...commission, auditTier2: e.target.value })
                }
                className="mt-1 w-full border border-border bg-bg-primary px-3 py-2 font-sans text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
              />
              <p className="mt-1 font-sans text-[11px] text-text-muted">
                Residential $500K-2M
              </p>
            </div>

            <div>
              <label className="block font-sans text-[12px] text-text-muted">
                Audit Tier 3 -- Enterprise (USD)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={commission.auditTier3}
                onChange={(e) =>
                  setCommission({ ...commission, auditTier3: e.target.value })
                }
                className="mt-1 w-full border border-border bg-bg-primary px-3 py-2 font-sans text-sm text-text-primary focus:border-accent-gold/50 focus:outline-none"
              />
              <p className="mt-1 font-sans text-[11px] text-text-muted">
                Commercial and developments over $2M
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent-gold px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Commission Settings"}
            </button>
            {saved && (
              <span className="font-sans text-[12px] text-emerald-400">
                Settings saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out All -- placed here as client interactive element */}
      <div className="mt-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">
          Session Management
        </p>
        <div className="mt-4">
          <button
            onClick={handleSignOutAll}
            disabled={signingOut}
            className="border border-border bg-bg-card px-5 py-2.5 font-sans text-sm text-text-secondary transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign Out All Devices"}
          </button>
          <p className="mt-2 font-sans text-[11px] text-text-muted">
            Invalidates all active sessions across devices. You will need to sign in again.
          </p>
        </div>
      </div>
    </>
  );
}
