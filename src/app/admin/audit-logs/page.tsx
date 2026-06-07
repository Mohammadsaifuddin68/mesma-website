"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminCard } from "@/components/admin/AdminCard";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { Search, Download, X, SlidersHorizontal } from "lucide-react";
import { logAuditAction } from "@/lib/audit";

const ACTION_LABELS: Record<string, string> = {
  login: "🔐 Login",
  logout: "🚪 Logout",
  user_created: "👤 User Created",
  user_disabled: "🚫 User Disabled",
  user_enabled: "✅ User Enabled",
  user_deleted: "🗑️ User Deleted",
  permissions_updated: "🛡️ Permissions Updated",
  lead_status_updated: "📊 Lead Status Updated",
  csv_exported: "📥 CSV Exported",
  password_reset_requested: "🔑 Password Reset",
};

const ACTION_BADGE: Record<string, string> = {
  login: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  logout: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  user_created: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  user_disabled: "bg-red-500/10 text-red-400 border-red-500/20",
  user_enabled: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  user_deleted: "bg-red-500/10 text-red-400 border-red-500/20",
  permissions_updated: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  lead_status_updated: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  csv_exported: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  password_reset_requested: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const DATE_PRESETS = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [showFilters, setShowFilters] = useState(false);
  const { adminProfile, can } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!can("auditLogs")) { router.push("/admin/dashboard"); return; }
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const now = new Date();
      if (actionFilter !== "All Actions" && log.action !== actionFilter) return false;
      if (search && !log.adminEmail?.toLowerCase().includes(search.toLowerCase()) && !log.targetUser?.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFilter !== "All Time") {
        const d = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
        if (dateFilter === "Today" && !isWithinInterval(d, { start: startOfDay(now), end: endOfDay(now) })) return false;
        if (dateFilter === "Last 7 Days" && d < subDays(now, 7)) return false;
        if (dateFilter === "Last 30 Days" && d < subDays(now, 30)) return false;
      }
      return true;
    });
  }, [logs, search, actionFilter, dateFilter]);

  const exportLogs = () => {
    const headers = ["Timestamp", "Admin Email", "Action", "Target User", "Lead ID", "Details"];
    const rows = filteredLogs.map((l) => {
      const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
      return [`"${format(d, 'yyyy-MM-dd HH:mm:ss')}"`, `"${l.adminEmail}"`, `"${l.action}"`, `"${l.targetUser || ''}"`, `"${l.leadId || ''}"`, `"${l.details || ''}"`].join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `mesma_audit_logs_${format(new Date(), "yyyyMMdd")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const hasFilter = actionFilter !== "All Actions" || dateFilter !== "All Time" || !!search;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Audit Logs</h1>
          <p className="text-slate-500 mt-1">Track all admin actions and system events.</p>
        </div>
        <button onClick={exportLogs} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 border border-blue-500/30 rounded-xl text-sm font-medium transition-all">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <AdminCard className="!p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-[#0B1120]/60">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email or user…" className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-white placeholder:text-slate-600 text-sm transition-all" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all ${hasFilter ? "border-blue-500/40 text-blue-400 bg-blue-500/10" : "border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-950/30"}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilter && <span className="w-2 h-2 rounded-full bg-blue-400" />}
          </button>
        </div>
        {showFilters && (
          <div className="px-4 py-3 border-b border-slate-800/80 bg-[#0B1120]/40 flex flex-wrap gap-3 items-center">
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50">
              <option>All Actions</option>
              {Object.keys(ACTION_LABELS).map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50">
              {DATE_PRESETS.map((s) => <option key={s}>{s}</option>)}
            </select>
            {hasFilter && <button onClick={() => { setActionFilter("All Actions"); setDateFilter("All Time"); setSearch(""); }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"><X className="w-3.5 h-3.5" /> Clear</button>}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-[#0B1120]/80 border-b border-slate-800/80">
                <tr>
                  {["Timestamp", "Admin", "Action", "Target User", "Lead ID", "Details"].map((h) => (
                    <th key={h} className="px-5 py-4 font-medium tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                  const d = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/10 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-xs">{format(d, "MMM d, yyyy HH:mm:ss")}</td>
                      <td className="px-5 py-3.5 text-slate-300 text-xs font-medium">{log.adminEmail}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${ACTION_BADGE[log.action] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{log.targetUser || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">{log.leadId ? log.leadId.slice(0, 8) + "…" : "—"}</td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs max-w-xs truncate">{log.details || "—"}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-600">No audit logs found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#0B1120]/40 text-sm text-slate-500">
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
      </AdminCard>
    </div>
  );
}
