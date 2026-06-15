"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Feather, Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function EditorLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const adminDoc = await getDoc(doc(db, "admins", cred.user.uid));
      if (!adminDoc.exists() || !adminDoc.data()?.active) {
        await auth.signOut();
        setError("You are not authorized to access the Mesma Content Editor.");
        setLoading(false);
        return;
      }
      const data = adminDoc.data();
      if (!data.permissions?.viewBlogDashboard && data.role !== "super_admin") {
        await auth.signOut();
        setError("You do not have editor permissions. Contact your administrator.");
        setLoading(false);
        return;
      }
      await updateDoc(doc(db, "admins", cred.user.uid), { lastLogin: new Date() });
      router.push("/editor/dashboard");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0f0a1a] relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[150px] -top-1/4 -right-1/4 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -bottom-1/4 -left-1/4 animate-[pulse_10s_ease-in-out_infinite]" />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="relative p-8 rounded-2xl bg-[#160d28]/80 backdrop-blur-2xl border border-purple-900/30 shadow-[0_0_80px_rgba(168,85,247,0.06),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center justify-center">
              <Feather className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Content Editor</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Sign in to manage Mesma blog content</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input {...form.register("email")} type="email" autoComplete="email" placeholder="editor@mesma.co.in"
                className="w-full h-12 px-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 text-white placeholder:text-slate-600 transition-all" />
              {form.formState.errors.email && <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input {...form.register("password")} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 text-white placeholder:text-slate-600 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}
            </div>
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full h-12 mt-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Editor"}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-600">For content editors only &bull; Protected by Mesma Security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
