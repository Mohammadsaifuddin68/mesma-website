"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db, app } from "@/lib/firebase";
import { AdminCard } from "@/components/admin/AdminCard";
import { useAdmin, AdminPermissions } from "@/lib/admin-context";
import { logAuditAction } from "@/lib/audit";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  UserPlus, MoreVertical, X, Loader2, ShieldCheck, CheckCircle2,
  ToggleLeft, ToggleRight, Trash2, KeyRound, ChevronDown
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addDoc } from "firebase/firestore";

const PERMISSION_LABELS: { key: keyof AdminPermissions; label: string; description: string }[] = [
  { key: "dashboard", label: "Dashboard Access", description: "View the main dashboard and KPIs" },
  { key: "viewLeads", label: "View Leads", description: "View all lead submissions" },
  { key: "editLeadStatus", label: "Edit Lead Status", description: "Update the pipeline status of leads" },
  { key: "exportLeads", label: "Export Leads", description: "Export leads as a CSV file" },
  { key: "manageAdmins", label: "Admin Management", description: "View and manage admin users" },
  { key: "createAdmins", label: "Create Admins", description: "Invite new admin users" },
  { key: "disableAdmins", label: "Disable Admins", description: "Enable or disable admin accounts" },
  { key: "deleteAdmins", label: "Delete Admins", description: "Permanently delete admin accounts" },
  { key: "auditLogs", label: "Audit Logs", description: "Access the full audit trail" },
  { key: "settings", label: "Settings Access", description: "Access the settings page" },
  { key: "analytics", label: "Analytics", description: "View analytics and reports" },
  { key: "systemConfig", label: "System Configuration", description: "Configure system settings" },
];

const DEFAULT_PERMISSIONS: AdminPermissions = {
  dashboard: true, viewLeads: true, editLeadStatus: false, exportLeads: false,
  manageAdmins: false, createAdmins: false, disableAdmins: false, deleteAdmins: false,
  auditLogs: false, settings: true, analytics: false, systemConfig: false,
};

const inviteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  jobTitle: z.string().optional(),
});

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  disabled: "bg-red-500/10 text-red-400 border-red-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [permModal, setPermModal] = useState<any>(null);
  const [pendingPerms, setPendingPerms] = useState<AdminPermissions | null>(null);
  const [savingPerms, setSavingPerms] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { adminProfile, can, isSuperAdmin } = useAdmin();
  const router = useRouter();

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", jobTitle: "" },
  });

  useEffect(() => {
    if (!can("manageAdmins")) { router.push("/admin/dashboard"); return; }
    const q = query(collection(db, "admins"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const onInviteSubmit = async (values: z.infer<typeof inviteSchema>) => {
    if (!can("createAdmins")) return;
    setInviting(true);
    try {
      // Generate a temporary password (user will reset via email)
      const tempPassword = `TempPass@${Math.random().toString(36).slice(2, 10)}!`;
      
      // Create user in Firebase Auth
      const secondaryApp = getAuth(app);
      const cred = await createUserWithEmailAndPassword(secondaryApp, values.email, tempPassword);
      const newUid = cred.user.uid;

      // Create admin document in Firestore using the UID as the document ID
      await setDoc(doc(db, "admins", newUid), {
        uid: newUid,
        name: values.name,
        email: values.email,
        jobTitle: values.jobTitle || "",
        role: "admin",
        active: true,
        status: "pending",
        permissions: DEFAULT_PERMISSIONS,
        createdAt: new Date(),
      });

      // Send password reset email so the user can set their own password
      await sendPasswordResetEmail(secondaryApp, values.email);

      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "user_created", targetUser: values.email });
      }

      setInviteSuccess(true);
      form.reset();
      setTimeout(() => { setShowModal(false); setInviteSuccess(false); }, 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create user");
    } finally {
      setInviting(false);
    }
  };

  const toggleUserStatus = async (user: any) => {
    if (!can("disableAdmins")) return;
    if (user.role === "super_admin" && !isSuperAdmin) { alert("Super Admin cannot be modified."); return; }
    const newActive = !user.active;
    setActionLoading(user.uid + "_toggle");
    try {
      await updateDoc(doc(db, "admins", user.uid), { active: newActive });
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: newActive ? "user_enabled" : "user_disabled", targetUser: user.email });
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const resetUserPassword = async (user: any) => {
    setActionLoading(user.uid + "_reset");
    try {
      const secondaryAuth = getAuth(app);
      await sendPasswordResetEmail(secondaryAuth, user.email);
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "password_reset_requested", targetUser: user.email });
      }
      alert(`Password reset email sent to ${user.email}`);
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const deleteUser = async (user: any) => {
    if (!can("deleteAdmins")) return;
    if (user.role === "super_admin") { alert("The Super Admin account cannot be deleted."); return; }
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;
    setActionLoading(user.uid + "_delete");
    try {
      await deleteDoc(doc(db, "admins", user.uid));
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "user_deleted", targetUser: user.email });
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const openPermModal = (user: any) => {
    setPermModal(user);
    setPendingPerms({ ...DEFAULT_PERMISSIONS, ...user.permissions });
  };

  const savePermissions = async () => {
    if (!permModal || !pendingPerms) return;
    setSavingPerms(true);
    try {
      await updateDoc(doc(db, "admins", permModal.uid), { permissions: pendingPerms });
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "permissions_updated", targetUser: permModal.email });
      }
      setPermModal(null);
      setPendingPerms(null);
    } catch (e) { console.error(e); }
    finally { setSavingPerms(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Users</h1>
          <p className="text-slate-500 mt-1">Manage system access and permissions.</p>
        </div>
        {can("createAdmins") && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] text-sm font-medium">
            <UserPlus className="w-4 h-4" /> Invite New User
          </button>
        )}
      </div>

      <AdminCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-[#0B1120]/80 border-b border-slate-800/80">
                <tr>
                  {["Name", "Email", "Role", "Status", "Created", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-medium tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-200">{user.name}</p>
                        {user.jobTitle && <p className="text-xs text-slate-500 mt-0.5">{user.jobTitle}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === "super_admin" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {user.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${user.active ? STATUS_BADGE.active : STATUS_BADGE.disabled}`}>
                        {user.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {user.createdAt?.toDate ? format(user.createdAt.toDate(), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openPermModal(user)} title="Edit Permissions" className="p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-slate-500 transition-colors border border-transparent hover:border-blue-500/20">
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        {can("disableAdmins") && user.role !== "super_admin" && (
                          <button onClick={() => toggleUserStatus(user)} disabled={actionLoading === user.uid + "_toggle"} title={user.active ? "Disable" : "Enable"} className="p-2 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 text-slate-500 transition-colors border border-transparent hover:border-amber-500/20">
                            {actionLoading === user.uid + "_toggle" ? <Loader2 className="w-4 h-4 animate-spin" /> : user.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                        )}
                        <button onClick={() => resetUserPassword(user)} disabled={actionLoading === user.uid + "_reset"} title="Reset Password" className="p-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-500 transition-colors border border-transparent hover:border-indigo-500/20">
                          {actionLoading === user.uid + "_reset" ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                        </button>
                        {can("deleteAdmins") && user.role !== "super_admin" && (
                          <button onClick={() => deleteUser(user)} disabled={actionLoading === user.uid + "_delete"} title="Delete" className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors border border-transparent hover:border-red-500/20">
                            {actionLoading === user.uid + "_delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminCard>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#0B1120] border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Invite New Admin</h2>
              <button onClick={() => { setShowModal(false); form.reset(); }} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            {inviteSuccess ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <p className="text-emerald-400 font-medium">Invitation sent!</p>
                <p className="text-slate-500 text-sm text-center">A password setup link has been emailed to the new admin.</p>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onInviteSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Full Name *</label>
                  <input {...form.register("name")} placeholder="e.g. Ahmed Al-Rashid" className="w-full h-11 px-4 bg-slate-950/60 border border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/60 text-white placeholder:text-slate-600 text-sm transition-all" />
                  {form.formState.errors.name && <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Email Address *</label>
                  <input {...form.register("email")} type="email" placeholder="user@mesma.co.in" className="w-full h-11 px-4 bg-slate-950/60 border border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/60 text-white placeholder:text-slate-600 text-sm transition-all" />
                  {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-300">Job Title <span className="text-slate-600">(optional)</span></label>
                  <input {...form.register("jobTitle")} placeholder="e.g. Sales Manager" className="w-full h-11 px-4 bg-slate-950/60 border border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/60 text-white placeholder:text-slate-600 text-sm transition-all" />
                </div>
                <p className="text-xs text-slate-600 pt-1">The user will receive an email with a link to set their password and activate their account.</p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); form.reset(); }} className="flex-1 h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors border border-slate-700">Cancel</button>
                  <button type="submit" disabled={inviting} className="flex-1 h-10 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {permModal && pendingPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 p-6 rounded-2xl bg-[#0B1120] border border-slate-700/50 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-5 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-white">Edit Permissions</h2>
                <p className="text-xs text-slate-500 mt-0.5">{permModal.name} · {permModal.role === "super_admin" ? "Super Admin (all permissions)" : "Admin"}</p>
              </div>
              <button onClick={() => setPermModal(null)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {PERMISSION_LABELS.map(({ key, label, description }) => (
                <label key={key} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${pendingPerms[key] ? "bg-blue-500/5 border-blue-500/20" : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700"} ${permModal.role === "super_admin" ? "opacity-60 cursor-not-allowed" : ""}`}>
                  <div>
                    <p className="text-sm font-medium text-slate-300">{label}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className={`relative w-11 h-6 rounded-full transition-colors ${pendingPerms[key] ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "bg-slate-700"}`}
                      onClick={() => permModal.role !== "super_admin" && setPendingPerms({ ...pendingPerms, [key]: !pendingPerms[key] })}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${pendingPerms[key] ? "left-6" : "left-1"}`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-5 flex-shrink-0">
              <button onClick={() => setPermModal(null)} className="flex-1 h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors border border-slate-700">Cancel</button>
              <button onClick={savePermissions} disabled={savingPerms || permModal.role === "super_admin"} className="flex-1 h-10 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {savingPerms ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Permissions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
