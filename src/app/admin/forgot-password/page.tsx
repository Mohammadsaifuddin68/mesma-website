"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Hexagon, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError("Failed to send reset email. Please verify the address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center relative">
      {/* Background Particles Simulation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -top-40 -right-40" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] -bottom-20 -left-20" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,153,255,0.1)]">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Hexagon className="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2 text-sm">Enter your email and we'll send you a reset link.</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            <p className="text-emerald-400 font-medium text-center">Password reset link has been sent to your email.</p>
            <Link href="/admin/login" className="w-full h-12 mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all flex items-center justify-center border border-slate-700 hover:border-slate-600">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                {...form.register("email")}
                type="email"
                placeholder="admin@mesma.co.in"
                className="w-full h-12 px-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white placeholder:text-slate-600 transition-all"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
            </button>

            <div className="pt-4 text-center">
              <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
