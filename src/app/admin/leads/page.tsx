"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminCard } from "@/components/admin/AdminCard";
import { useAdmin } from "@/lib/admin-context";
import { logAuditAction } from "@/lib/audit";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { Search, Download, Filter, MoreHorizontal, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, getFilteredRowModel, flexRender,
  ColumnDef, SortingState,
} from "@tanstack/react-table";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  demo_scheduled: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  proposal_sent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const DATE_PRESETS = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];
const SERVICES = ["All Services", "AI Receptionist", "AI Customer Support", "Appointment Booking", "Lead Qualification", "Outbound Automation", "Custom Solution"];
const STATUSES = ["All Status", "new", "contacted", "demo_scheduled", "proposal_sent", "won", "lost"];

export default function LeadsPage() {
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [showFilters, setShowFilters] = useState(false);
  const { adminProfile, can } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!can("viewLeads")) { router.push("/admin/dashboard"); return; }
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setAllLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (statusFilter !== "All Status" && lead.status !== statusFilter) return false;
      if (serviceFilter !== "All Services" && lead.service !== serviceFilter) return false;
      if (dateFilter !== "All Time") {
        const d = lead.createdAt?.toDate ? lead.createdAt.toDate() : new Date(lead.createdAt);
        const now = new Date();
        if (dateFilter === "Today" && !isWithinInterval(d, { start: startOfDay(now), end: endOfDay(now) })) return false;
        if (dateFilter === "Last 7 Days" && d < subDays(now, 7)) return false;
        if (dateFilter === "Last 30 Days" && d < subDays(now, 30)) return false;
      }
      return true;
    });
  }, [allLeads, statusFilter, serviceFilter, dateFilter]);

  const exportCSV = useCallback(() => {
    if (!can("exportLeads")) return;
    const headers = ["Name", "Company", "Email", "Phone", "Service", "Status", "Date"];
    const rows = filteredLeads.map((l) => {
      const d = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt);
      return [`"${l.name || ''}"`, `"${l.company || ''}"`, `"${l.email || ''}"`, `"${l.phone || ''}"`, `"${l.service || ''}"`, `"${l.status || ''}"`, `"${format(d, 'yyyy-MM-dd')}"`].join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `mesma_leads_${format(new Date(), "yyyyMMdd")}.csv`; a.click();
    URL.revokeObjectURL(url);
    if (adminProfile?.email) {
      logAuditAction({ adminEmail: adminProfile.email, action: "csv_exported", details: `Exported ${filteredLeads.length} leads` });
    }
  }, [filteredLeads, adminProfile, can]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <span className="font-medium text-slate-200">{info.getValue() as string}</span>,
    },
    { accessorKey: "company", header: "Company", cell: (info) => <span className="text-slate-400">{info.getValue() as string}</span> },
    { accessorKey: "email", header: "Email", cell: (info) => <span className="text-slate-400 text-sm">{info.getValue() as string}</span> },
    { accessorKey: "phone", header: "Phone", cell: (info) => <span className="text-slate-400 text-sm">{info.getValue() as string}</span> },
    { accessorKey: "service", header: "Service", cell: (info) => <span className="text-slate-300 text-sm">{info.getValue() as string}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const s = info.getValue() as string;
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE[s] || "bg-slate-500/10 text-slate-400 border-slate-500/20"} uppercase tracking-wider`}>{s.replace(/_/g, " ")}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: (info) => {
        const v = info.getValue() as any;
        if (!v) return "—";
        const d = v.toDate ? v.toDate() : new Date(v);
        return <span className="text-slate-500 text-sm">{format(d, "MMM d, yyyy")}</span>;
      },
    },
    {
      id: "actions",
      cell: (info) => (
        <Link href={`/admin/leads/${info.row.original.id}`} className="p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-slate-500 transition-colors inline-flex border border-transparent hover:border-blue-500/20">
          <MoreHorizontal className="w-4 h-4" />
        </Link>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredLeads,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const hasActiveFilter = statusFilter !== "All Status" || serviceFilter !== "All Services" || dateFilter !== "All Time";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leads</h1>
          <p className="text-slate-500 mt-1">Manage and track your incoming inquiries.</p>
        </div>
        {can("exportLeads") && (
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 hover:text-blue-300 border border-blue-500/30 rounded-xl transition-all text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      <AdminCard className="!p-0 overflow-hidden">
        {/* Table toolbar */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-[#0B1120]/60">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search name, email, company…"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 transition-all text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all ${hasActiveFilter ? "border-blue-500/40 text-blue-400 bg-blue-500/10" : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300 bg-slate-950/30"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-blue-400 ml-0.5" />}
          </button>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className="px-4 py-3 border-b border-slate-800/80 bg-[#0B1120]/40 flex flex-wrap gap-3 items-center">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50">
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-blue-500/50">
              {DATE_PRESETS.map((s) => <option key={s}>{s}</option>)}
            </select>
            {hasActiveFilter && (
              <button onClick={() => { setStatusFilter("All Status"); setServiceFilter("All Services"); setDateFilter("All Time"); }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-[#0B1120]/80 border-b border-slate-800/80">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="px-5 py-4 font-medium tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {h.column.getIsSorted() === "asc" ? " ↑" : h.column.getIsSorted() === "desc" ? " ↓" : ""}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-5 py-16 text-center text-slate-600">
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#0B1120]/40 flex items-center justify-between text-sm text-slate-500">
          <span>Showing {table.getRowModel().rows.length} of {filteredLeads.length} leads</span>
          <div className="flex gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Prev</button>
            <span className="px-3.5 py-1.5">{table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
