"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hexagon, Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { logAuditAction } from "@/lib/audit";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Verify the user exists in the admins collection
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (!adminDoc.exists() || !adminDoc.data()?.active) {
        await auth.signOut();
        setError("You are not authorized to access the Mesma Admin Portal. Please contact the system administrator.");
        setLoading(false);
        return;
      }

      // Update last login
      await updateDoc(doc(db, "admins", user.uid), { lastLogin: new Date() });

      // Log the login action
      await logAuditAction({ adminEmail: values.email, action: "login" });

      router.push("/admin/dashboard");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Account temporarily locked. Try again later or reset your password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center relative overflow-hidden bg-[#071426]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] -top-1/4 -right-1/4 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -bottom-1/4 -left-1/4 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card */}
        <div className="relative p-8 rounded-2xl bg-[#0B1120]/80 backdrop-blur-2xl border border-slate-700/30 shadow-[0_0_80px_rgba(0,212,255,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]">
          
          {/* Top glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Hexagon className="w-9 h-9 text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
            <p className="text-slate-500 mt-1.5 text-sm text-center">Sign in to access the Mesma dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                {...form.register("email")}
                type="email"
                autoComplete="email"
                placeholder="admin@mesma.co.in"
                className="w-full h-12 px-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 transition-all"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="/admin/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <input
                {...form.register("rememberMe")}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Portal"}
            </button>
          </form>

          {/* Bottom divider */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-600">Protected by Mesma Security &bull; For authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
