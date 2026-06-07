"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminCard } from "@/components/admin/AdminCard";
import { useAdmin } from "@/lib/admin-context";
import { logAuditAction } from "@/lib/audit";
import { format } from "date-fns";
import { ArrowLeft, User, Building2, Mail, Phone, Briefcase, Calendar, Save, Loader2, MessageSquare, Tag, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

const STATUS_OPTIONS = ["new", "contacted", "demo_scheduled", "proposal_sent", "won", "lost"];
const STATUS_BADGE: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  demo_scheduled: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  proposal_sent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

function InfoRow({ icon: Icon, label, value, isEmail = false, isPhone = false }: any) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-800/50 last:border-0">
      <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-600 mb-0.5">{label}</p>
        {isEmail ? (
          <a href={`mailto:${value}`} className="text-blue-400 hover:underline">{value}</a>
        ) : isPhone ? (
          <a href={`tel:${value}`} className="text-blue-400 hover:underline">{value}</a>
        ) : (
          <p className="text-slate-200">{value || "—"}</p>
        )}
      </div>
    </div>
  );
}

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { adminProfile, can } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!can("viewLeads")) { router.push("/admin/dashboard"); return; }
    const fetch = async () => {
      const snap = await getDoc(doc(db, "leads", id));
      if (!snap.exists()) { router.push("/admin/leads"); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { id: snap.id, ...snap.data() };
      setLead(data);
      setStatus(data.status || "new");
      setLoading(false);
    };
    fetch().catch(console.error);
  }, [id]);

  const handleSave = async () => {
    if (!can("editLeadStatus")) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "leads", id), { status, updatedAt: new Date() });
      if (adminProfile?.email) {
        await logAuditAction({
          adminEmail: adminProfile.email,
          action: "lead_status_updated",
          leadId: id,
          details: `Status changed from "${lead.status}" to "${status}"`,
        });
      }
      setLead({ ...lead, status });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  }
  if (!lead) return null;

  const date = lead.createdAt?.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{lead.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_BADGE[lead.status] || ""} uppercase tracking-wider`}>
              {lead.status?.replace(/_/g, " ")}
            </span>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-slate-500 text-sm">{format(date, "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact + Inquiry Details */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Contact Information
            </h3>
            <InfoRow icon={User} label="Full Name" value={lead.name} />
            <InfoRow icon={Building2} label="Company" value={lead.company} />
            <InfoRow icon={Mail} label="Email Address" value={lead.email} isEmail />
            <InfoRow icon={Phone} label="Phone Number" value={lead.phone} isPhone />
          </AdminCard>

          <AdminCard>
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Inquiry Details
            </h3>
            <InfoRow icon={Tag} label="Requested Service" value={lead.service} />
            <InfoRow icon={Globe} label="Source" value={lead.source || "Website Contact Form"} />
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-600">Message</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <AdminCard className="border-t-2 border-t-blue-500/60">
            <h3 className="text-base font-semibold text-white mb-5">Lead Management</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Pipeline Status</label>
                {can("editLeadStatus") ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-950/80 border border-slate-700/80 rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-white transition-all appearance-none text-sm"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                ) : (
                  <div className={`w-full h-11 px-4 flex items-center rounded-xl border ${STATUS_BADGE[status] || ""} text-sm uppercase tracking-wider`}>
                    {status.replace(/_/g, " ")}
                  </div>
                )}
              </div>

              {can("editLeadStatus") && (
                <button
                  onClick={handleSave}
                  disabled={saving || status === lead.status}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? "✓ Saved!" : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Submitted {format(date, "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span>{lead.source || "Website Contact Form"}</span>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <a href={`mailto:${lead.email}?subject=Re: Your inquiry about ${lead.service}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 hover:text-blue-400 text-slate-400 transition-all text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" /> Email Lead
              </a>
              <a href={`tel:${lead.phone}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 hover:text-blue-400 text-slate-400 transition-all text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" /> Call Lead
              </a>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
