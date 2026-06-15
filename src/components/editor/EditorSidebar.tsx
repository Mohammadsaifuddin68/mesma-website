"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, ImageIcon, PlusCircle, LogOut, Feather, ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function EditorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminProfile, can } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/editor/dashboard", icon: LayoutDashboard },
    { name: "All Posts", href: "/editor/posts", icon: FileText },
    { name: "New Post", href: "/editor/posts/new", icon: PlusCircle },
    { name: "Media Library", href: "/editor/media", icon: ImageIcon },
  ].filter(Boolean);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/editor/login");
  };

  return (
    <aside className={cn(
      "relative flex flex-col h-screen border-r border-purple-900/30 bg-[#0f0a1a]/95 backdrop-blur-xl transition-all duration-300 z-20",
      collapsed ? "w-[68px]" : "w-60"
    )}>
      {/* Purple glow line */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

      {/* Logo */}
      <div className="h-18 flex items-center px-4 py-5 border-b border-purple-900/30 relative">
        <Link href="/editor/dashboard" className="flex items-center gap-3 group overflow-hidden">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:border-purple-400/60 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
            <Feather className="w-4 h-4 text-purple-400" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm tracking-wider text-slate-200 whitespace-nowrap">MESMA<span className="text-purple-400 font-normal">CMS</span></p>
              <p className="text-xs text-slate-600 whitespace-nowrap">Content Editor</p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0f0a1a] border border-purple-900/50 hover:border-purple-500/40 flex items-center justify-center text-slate-500 hover:text-purple-400 transition-all shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-5 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/editor/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group border",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-purple-500/10 text-purple-400 font-medium border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent"
              )}>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />}
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="p-2.5 border-t border-purple-900/30 space-y-1">
        {!collapsed && adminProfile && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-slate-200 truncate">{adminProfile.name}</p>
            <p className="text-xs text-slate-600 truncate">{adminProfile.email}</p>
            <span className="mt-1 inline-flex px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {adminProfile.role === "super_admin" ? "Super Admin" : "Editor"}
            </span>
          </div>
        )}
        <button onClick={handleLogout} title={collapsed ? "Logout" : undefined}
          className={cn("flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20", collapsed ? "justify-center" : "")}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
