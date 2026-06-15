"use client";

import { usePathname } from "next/navigation";
import { AdminProvider } from "@/lib/admin-context";
import { EditorGuard } from "@/components/editor/EditorGuard";
import { EditorSidebar } from "@/components/editor/EditorSidebar";

const EDITOR_AUTH_ROUTES = ["/editor/login"];

function EditorLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = EDITOR_AUTH_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-[#0f0a1a] text-slate-50 flex font-sans selection:bg-purple-500/30">
      <EditorGuard>
        {!isAuthRoute && <EditorSidebar />}
        <main className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
          {/* Ambient purple background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
          </div>
          <div className={`relative z-10 flex-1 flex flex-col overflow-auto ${!isAuthRoute ? "p-8" : ""}`}>
            {children}
          </div>
        </main>
      </EditorGuard>
    </div>
  );
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <EditorLayoutInner>{children}</EditorLayoutInner>
    </AdminProvider>
  );
}
