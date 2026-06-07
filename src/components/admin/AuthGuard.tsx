"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAdmin } from "@/lib/admin-context";
import { logAuditAction } from "@/lib/audit";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const AUTH_ROUTES = ["/admin/login", "/admin/forgot-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, adminProfile, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // ── Auto-logout on inactivity ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(async () => {
        if (adminProfile?.email) {
          await logAuditAction({ adminEmail: adminProfile.email, action: "logout", details: "Auto-logged out due to inactivity" });
        }
        await signOut(auth);
        router.push("/admin/login");
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, adminProfile, router]);

  // ── Route guard logic ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthRoute) {
      router.push("/admin/login");
      return;
    }

    if (user && isAuthRoute) {
      // Once the profile loads, if access is denied, don't redirect to dashboard
      if (adminProfile && adminProfile.active) {
        router.push("/admin/dashboard");
      }
      return;
    }
  }, [user, adminProfile, loading, isAuthRoute, router]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#071426]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-slate-500 text-sm animate-pulse">Authenticating…</p>
        </div>
      </div>
    );
  }

  // ── Access Denied ──────────────────────────────────────────────────────────
  if (user && !isAuthRoute && adminProfile === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#071426]">
        <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Access Denied</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            You are not authorized to access the Mesma Admin Portal. Please contact the system administrator.
          </p>
          <button
            onClick={() => signOut(auth).then(() => router.push("/admin/login"))}
            className="mt-6 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
