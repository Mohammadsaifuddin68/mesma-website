"use client";

import { usePathname } from "next/navigation";
import { AdminProvider } from "@/lib/admin-context";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { Sidebar } from "@/components/admin/Sidebar";
import "./globals.css";

const AUTH_ROUTES = ["/admin/login", "/admin/forgot-password"];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <div className="admin-portal min-h-screen bg-[#071426] text-slate-50 flex font-sans selection:bg-blue-500/30">
      <AuthGuard>
        {!isAuthRoute && <Sidebar />}
        <main className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
          {/* Ambient background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.03),transparent_60%)]" />
          </div>
          <div className={`relative z-10 flex-1 flex flex-col overflow-auto ${!isAuthRoute ? "p-8" : ""}`}>
            {children}
          </div>
        </main>
      </AuthGuard>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
