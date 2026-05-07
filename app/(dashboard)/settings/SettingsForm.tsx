"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "@/lib/actions/profile-actions";

interface Props {
  email: string;
  fullName: string;
  phone: string;
  companyName: string;
  role: string;
  status: string;
  memberSince: string;
}

export default function SettingsForm({ email, fullName, phone, companyName, role, status, memberSince }: Props) {
  const [name, setName] = useState(fullName);
  const [ph, setPh] = useState(phone);
  const [company, setCompany] = useState(companyName);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState("");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    const result = await updateProfile({ full_name: name, phone: ph, company_name: company });
    setProfileMsg(result.error || "Profile updated.");
    setProfileSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) { setPassMsg("Minimum 8 characters."); return; }
    if (newPass !== confirmPass) { setPassMsg("Passwords do not match."); return; }
    setPassSaving(true);
    setPassMsg("");
    const result = await changePassword(newPass);
    setPassMsg(result.error || "Password updated.");
    if (result.success) { setNewPass(""); setConfirmPass(""); }
    setPassSaving(false);
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 font-sans text-[13px] text-white/80 placeholder:text-white/20 focus:border-white/[0.15] focus:outline-none";
  const labelClass = "block font-sans text-[10px] uppercase tracking-[0.1em] text-white/30 mb-2";
  const btnClass = "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg px-6 py-2.5 font-sans text-[11px] uppercase tracking-wider text-white/50 hover:text-white/70 transition-all disabled:opacity-30";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {/* Profile */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-[#c9a96e]">Profile</h2>
        <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} disabled className={`${inputClass} opacity-40 cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="+1 555 000 0000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={profileSaving} className={btnClass}>
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
            {profileMsg ? (
              <span className={`font-sans text-[11px] ${profileMsg.includes("error") || profileMsg.includes("Error") ? "text-red-400" : "text-[#c9a96e]"}`}>
                {profileMsg}
              </span>
            ) : null}
          </div>
        </form>
      </div>

      {/* Password + Account info */}
      <div className="space-y-6">
        {/* Change password */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-[#c9a96e]">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Minimum 8 characters" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirm" className={inputClass} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={passSaving} className={btnClass}>
                {passSaving ? "Updating..." : "Update Password"}
              </button>
              {passMsg ? (
                <span className={`font-sans text-[11px] ${passMsg.includes("error") || passMsg.includes("Error") || passMsg.includes("match") || passMsg.includes("Minimum") ? "text-red-400" : "text-[#c9a96e]"}`}>
                  {passMsg}
                </span>
              ) : null}
            </div>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h2 className="text-[#c9a96e]">Account</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-sans text-[11px] text-white/30">Role</span>
              <span className="font-sans text-[12px] text-white/60 capitalize">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[11px] text-white/30">Status</span>
              <span className={`font-sans text-[12px] capitalize ${status === "active" ? "text-green-400" : "text-white/40"}`}>{status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[11px] text-white/30">Member since</span>
              <span className="font-sans text-[12px] text-white/40">
                {new Date(memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
