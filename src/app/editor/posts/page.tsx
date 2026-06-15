"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdmin } from "@/lib/admin-context";
import { format } from "date-fns";
import Link from "next/link";
import { Search, PlusCircle, Trash2, Edit3, Eye, Globe, Loader2, SlidersHorizontal, X } from "lucide-react";
import { logAuditAction } from "@/lib/audit";

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  scheduled: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending_review: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  archived: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUSES = ["All", "draft", "published", "scheduled", "pending_review", "archived"];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  status: string;
  featuredImage: string;
  featuredImagePath: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt?: { toDate: () => Date } | null;
  createdAt?: { toDate: () => Date };
  updatedAt?: { toDate: () => Date };
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { adminProfile, can } = useAdmin();

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const canSeePost = can("manageOthersPosts") || p.authorId === adminProfile?.uid;
      if (!canSeePost) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, search, statusFilter, adminProfile, can]);

  const handleDelete = async (post: BlogPost) => {
    if (!can("deleteBlog")) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setActionLoading(post.id + "_delete");
    try {
      await deleteDoc(doc(db, "blogs", post.id));
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "lead_status_updated", details: `Blog deleted: ${post.title}` });
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handlePublishToggle = async (post: BlogPost) => {
    if (!can("publishBlog")) return;
    const newStatus = post.status === "published" ? "draft" : "published";
    setActionLoading(post.id + "_publish");
    try {
      await updateDoc(doc(db, "blogs", post.id), {
        status: newStatus,
        publishedAt: newStatus === "published" ? new Date() : null,
        updatedAt: new Date(),
      });
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">All Posts</h1>
          <p className="text-slate-500 mt-1">{filtered.length} post{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        {can("createBlog") && (
          <Link href="/editor/posts/new" className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] text-sm font-medium">
            <PlusCircle className="w-4 h-4" /> New Post
          </Link>
        )}
      </div>

      <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-purple-900/30 flex flex-col sm:flex-row gap-3 bg-[#130a22]/60">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title…"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-600 text-sm transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${statusFilter === s ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "bg-slate-950/30 text-slate-500 border-slate-800 hover:text-slate-300"}`}>
                {s === "All" ? "All" : s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-[#130a22]/80 border-b border-purple-900/30">
                <tr>
                  {["Title", "Author", "Category", "Status", "Updated", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-medium tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {filtered.length > 0 ? filtered.map((post) => {
                  const d = post.updatedAt?.toDate ? post.updatedAt.toDate() : post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
                  return (
                    <tr key={post.id} className="hover:bg-purple-500/5 transition-colors">
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-medium text-slate-200 truncate">{post.title || "Untitled"}</p>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">/{post.slug || "no-slug"}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm whitespace-nowrap">{post.author || "—"}</td>
                      <td className="px-5 py-4 text-slate-400 text-sm whitespace-nowrap">{post.category || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs border ${STATUS_BADGE[post.status] || STATUS_BADGE.draft}`}>
                          {(post.status || "draft").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{format(d, "MMM d, yyyy")}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {can("editBlog") && (
                            <Link href={`/editor/posts/${post.id}/edit`} className="p-2 rounded-lg hover:bg-purple-500/10 hover:text-purple-400 text-slate-500 transition-colors border border-transparent hover:border-purple-500/20">
                              <Edit3 className="w-4 h-4" />
                            </Link>
                          )}
                          {can("publishBlog") && (
                            <button onClick={() => handlePublishToggle(post)} disabled={actionLoading === post.id + "_publish"} title={post.status === "published" ? "Unpublish" : "Publish"}
                              className="p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-500 transition-colors border border-transparent hover:border-emerald-500/20">
                              {actionLoading === post.id + "_publish" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                            </button>
                          )}
                          <Link href={`/blogs/${post.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-700/50 hover:text-slate-300 text-slate-500 transition-colors border border-transparent hover:border-slate-700">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {can("deleteBlog") && (
                            <button onClick={() => handleDelete(post)} disabled={actionLoading === post.id + "_delete"}
                              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors border border-transparent hover:border-red-500/20">
                              {actionLoading === post.id + "_delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-600">No posts match your filters.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
