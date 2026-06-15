"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdmin } from "@/lib/admin-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const EDITOR_AUTH_ROUTES = ["/editor/login"];

export function EditorGuard({ children }: { children: React.ReactNode }) {
  const { user, adminProfile, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = EDITOR_AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthRoute) {
      router.push("/editor/login");
      return;
    }

    if (user && isAuthRoute) {
      if (adminProfile?.active && adminProfile.permissions?.viewBlogDashboard) {
        router.push("/editor/dashboard");
      }
      return;
    }

    // User is logged in but not a valid editor
    if (user && !isAuthRoute && adminProfile !== null) {
      const hasEditorAccess =
        adminProfile.role === "super_admin" ||
        adminProfile.permissions?.viewBlogDashboard === true;
      if (!hasEditorAccess) {
        signOut(auth).then(() => router.push("/editor/login"));
      }
    }
  }, [user, adminProfile, loading, isAuthRoute, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f0a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
          <p className="text-slate-500 text-sm animate-pulse">Loading editor…</p>
        </div>
      </div>
    );
  }

  if (user && !isAuthRoute && adminProfile === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f0a1a]">
        <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-slate-900/60 border border-red-500/20 text-center">
          <h2 className="text-xl font-bold text-white mb-3">No Editor Access</h2>
          <p className="text-slate-400 text-sm">Your account does not have access to the Mesma Content Editor. Contact your administrator.</p>
          <button onClick={() => signOut(auth).then(() => router.push("/editor/login"))} className="mt-6 px-5 py-2 bg-slate-800 text-slate-300 text-sm rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
