"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { FileText, FilePen, Globe, Clock, PlusCircle, ArrowUpRight, TrendingUp, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors: Record<string, string> = {
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-[#160d28]/70 border border-purple-900/30 hover:border-purple-700/50 transition-all group">
      <div className={`inline-flex p-2.5 rounded-xl border ${colors[color]} mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
      <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
    </div>
  );
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: string;
  createdAt?: { toDate: () => Date };
}

export default function EditorDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminProfile } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total = posts.length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const published = posts.filter((p) => p.status === "published").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Blog Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {adminProfile?.name?.split(" ")[0]}.</p>
        </div>
        <Link href="/editor/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] text-sm font-medium">
          <PlusCircle className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Posts" value={total} icon={FileText} color="purple" />
        <StatCard label="Drafts" value={drafts} icon={FilePen} color="violet" />
        <StatCard label="Published" value={published} icon={Globe} color="emerald" />
        <StatCard label="Scheduled" value={scheduled} icon={Clock} color="amber" />
      </div>

      {/* Recent Posts */}
      <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-900/30 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-400" /> Recent Posts</h3>
          <Link href="/editor/posts" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all →</Link>
        </div>
        {loading ? (
          <div className="p-10 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" /></div>
        ) : recentPosts.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No posts yet. Create your first blog post!</p>
            <Link href="/editor/posts/new" className="inline-flex mt-4 items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-sm hover:bg-purple-600/30 transition-colors">
              <PlusCircle className="w-4 h-4" /> Create Post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-purple-900/20">
            {recentPosts.map((post) => {
              const statusColors: Record<string, string> = {
                draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
                published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                scheduled: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                pending_review: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                archived: "bg-red-500/10 text-red-400 border-red-500/20",
              };
              const d = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
              return (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-purple-500/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">{post.title || "Untitled"}</p>
                    <p className="text-xs text-slate-600 mt-0.5">By {post.author} · {format(d, "MMM d, yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${statusColors[post.status] || statusColors.draft}`}>
                      {post.status?.replace(/_/g, " ") || "draft"}
                    </span>
                    <Link href={`/editor/posts/${post.id}/edit`} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Edit →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
