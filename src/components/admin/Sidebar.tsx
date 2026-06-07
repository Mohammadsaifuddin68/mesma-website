"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Hexagon,
  ScrollText,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { logAuditAction } from "@/lib/audit";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, can } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    if (adminProfile?.email) {
      await logAuditAction({ adminEmail: adminProfile.email, action: "logout" });
    }
    await signOut(auth);
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard" as const },
    { name: "Leads", href: "/admin/leads", icon: Users, permission: "viewLeads" as const },
    { name: "Users", href: "/admin/users", icon: UserCog, permission: "manageAdmins" as const },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText, permission: "auditLogs" as const },
    { name: "Settings", href: "/admin/settings", icon: Settings, permission: "settings" as const },
  ];

  const visibleItems = menuItems.filter(item => can(item.permission));

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-slate-800/50 bg-[#0B1120]/95 backdrop-blur-xl transition-all duration-300 z-20",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Glow line on the right */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />

      {/* Logo */}
      <div className="h-20 flex items-center px-4 border-b border-slate-800/50 relative">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group overflow-hidden">
          <div className="flex-shrink-0 relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 group-hover:border-blue-500/60 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
            <Hexagon className="w-5 h-5 text-blue-400" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-wider text-slate-200 whitespace-nowrap">
              MESMA<span className="text-blue-500 font-normal">OS</span>
            </span>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0B1120] border border-slate-700 hover:border-blue-500/50 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-6 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group overflow-hidden",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile + Logout */}
      <div className="p-2.5 border-t border-slate-800/50 space-y-1">
        {!collapsed && adminProfile && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-slate-200 truncate">{adminProfile.name}</p>
            <p className="text-xs text-slate-500 truncate">{adminProfile.email}</p>
            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {adminProfile.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
