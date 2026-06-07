"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminCard } from "@/components/admin/AdminCard";
import { useAdmin } from "@/lib/admin-context";
import { format, subDays, startOfMonth } from "date-fns";
import { Users, UserPlus, Phone, TrendingUp, BarChart3, Trophy, ArrowUpRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  new: "#00D4FF",
  contacted: "#6366f1",
  demo_scheduled: "#8b5cf6",
  proposal_sent: "#f59e0b",
  won: "#10b981",
  lost: "#ef4444",
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminProfile, can } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!can("dashboard")) {
      router.push("/admin/leads");
      return;
    }
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  const now = new Date();
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const demoScheduled = leads.filter((l) => l.status === "demo_scheduled").length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const monthlyLeads = leads.filter((l) => {
    const date = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt);
    return date >= startOfMonth(now);
  }).length;

  // 7-day chart data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(now, 6 - i);
    const label = format(date, "MMM d");
    const count = leads.filter((l) => {
      const d = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt);
      return format(d, "MMM d") === label;
    }).length;
    return { name: label, leads: count };
  });

  // Status distribution
  const statusData = Object.entries(
    leads.reduce((acc: Record<string, number>, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace("_", " "), value, color: STATUS_COLORS[name] || "#64748b" }));

  const kpiCards = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "blue", glow: "rgba(59,130,246,0.3)" },
    { label: "New", value: newLeads, icon: UserPlus, color: "cyan", glow: "rgba(6,182,212,0.3)" },
    { label: "Contacted", value: contactedLeads, icon: Phone, color: "indigo", glow: "rgba(99,102,241,0.3)" },
    { label: "Demo Scheduled", value: demoScheduled, icon: BarChart3, color: "violet", glow: "rgba(139,92,246,0.3)" },
    { label: "Won", value: wonLeads, icon: Trophy, color: "emerald", glow: "rgba(16,185,129,0.3)" },
    { label: "This Month", value: monthlyLeads, icon: TrendingUp, color: "blue", glow: "rgba(59,130,246,0.3)" },
  ];

  const colorMap: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {adminProfile?.name?.split(" ")[0]}.</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{format(now, "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const classes = colorMap[card.color];
          return (
            <div key={card.label} className={`relative overflow-hidden rounded-2xl p-5 bg-[#0B1120]/70 border border-slate-800/50 hover:border-slate-700/80 transition-all hover:shadow-[0_0_30px_var(--glow)] group`}
              style={{ "--glow": card.glow } as React.CSSProperties}>
              <div className={`inline-flex p-2.5 rounded-xl border ${classes} mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
              <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <AdminCard className="lg:col-span-2">
          <h3 className="text-base font-semibold text-white mb-6">Lead Acquisition — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", fontSize: "12px" }}
                itemStyle={{ color: "#60a5fa" }}
              />
              <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 5, fill: "#60a5fa" }} />
            </AreaChart>
          </ResponsiveContainer>
        </AdminCard>

        {/* Pie Chart */}
        <AdminCard>
          <h3 className="text-base font-semibold text-white mb-6">Lead Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span className="text-slate-400 text-xs capitalize">{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-slate-600 text-sm">No data yet</div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
