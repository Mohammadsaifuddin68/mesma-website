"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logAuditAction } from "@/lib/audit";
import { AdminCard } from "@/components/admin/AdminCard";
import { User, Shield, Bell, CheckCircle2, Loader2, Palette, Edit3, Save } from "lucide-react";

export default function SettingsPage() {
  const { adminProfile, user } = useAdmin();
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(adminProfile?.name || "");
  const [savingName, setSavingName] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "password_reset_requested" });
      }
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (e) { console.error(e); }
    finally { setResetLoading(false); }
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;
    setSavingName(true);
    try {
      await updateDoc(doc(db, "admins", user.uid), { name: newName.trim() });
      setEditingName(false);
    } catch (e) { console.error(e); }
    finally { setSavingName(false); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <AdminCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Display Name</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 h-11 px-4 bg-slate-950/60 border border-blue-500/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white text-sm"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="px-4 h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50">
                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                  <button onClick={() => setEditingName(false)} className="px-3 h-11 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm transition-colors">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-11 px-4 flex items-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 text-sm">
                    {adminProfile?.name}
                  </div>
                  <button onClick={() => setEditingName(true)} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Email Address</label>
              <div className="h-11 px-4 flex items-center bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-500 text-sm cursor-not-allowed select-none">
                {user?.email}
              </div>
              <p className="text-xs text-slate-700">Email cannot be changed here.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Role</label>
              <div className="h-11 px-4 flex items-center gap-2 bg-slate-900/30 border border-slate-800/50 rounded-xl text-sm cursor-not-allowed select-none">
                <span className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {adminProfile?.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">Account Status</label>
              <div className="h-11 px-4 flex items-center gap-2 bg-slate-900/30 border border-slate-800/50 rounded-xl text-sm cursor-not-allowed select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Security */}
        <AdminCard>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <p className="text-sm font-medium text-slate-200 mb-1">Password Reset</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">A secure password reset link will be sent to your email address. The link expires after 1 hour.</p>
              <button
                onClick={handlePasswordReset}
                disabled={resetLoading || resetSent}
                className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : resetSent ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Email Sent!</> : "Send Reset Link"}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
              <p className="text-sm font-medium text-slate-400">Session Security</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✓ Auto-logout after 30 minutes of inactivity</p>
                <p>✓ Secure Firebase Authentication</p>
                <p>✓ Role-based access control enforced</p>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Preferences */}
        <AdminCard>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Palette className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Email Notifications", desc: "Receive an email when a new lead is submitted.", defaultOn: true },
              { label: "Neon Glow Theme", desc: "Enable intense neon blue glow effects.", defaultOn: true },
              { label: "Compact Table View", desc: "Show more rows with reduced padding.", defaultOn: false },
            ].map(({ label, desc, defaultOn }) => (
              <div key={label} className="flex items-start justify-between p-3.5 rounded-xl border border-slate-800/60 bg-slate-900/30 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-300">{label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only peer" defaultChecked={defaultOn} />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:shadow-[0_0_10px_rgba(59,130,246,0.4)] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 transition-all" />
                </label>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
