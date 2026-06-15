"use client";

import { use, useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { uploadFile } from "@/lib/storage";
import { ArrowLeft, Save, Globe, Upload, X, Loader2, Tag } from "lucide-react";
import Link from "next/link";
import { logAuditAction } from "@/lib/audit";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor").then(m => ({ default: m.TiptapEditor })), { ssr: false });

const CATEGORIES = ["AI Receptionist", "Customer Support", "Voice Automation", "Business Automation", "Call Center AI", "Technology", "Case Studies"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

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

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { adminProfile, can } = useAdmin();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImagePath, setFeaturedImagePath] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "blogs", id));
      if (!snap.exists()) { router.push("/editor/posts"); return; }
      const data = { id: snap.id, ...snap.data() } as BlogPost;
      setPost(data);
      setTitle(data.title || "");
      setSlug(data.slug || "");
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setCategory(data.category || "");
      setTags(data.tags || []);
      setSeoTitle(data.seoTitle || "");
      setSeoDescription(data.seoDescription || "");
      setFeaturedImage(data.featuredImage || "");
      setFeaturedImagePath(data.featuredImagePath || "");
      setLoading(false);
    };
    fetch().catch(console.error);
  }, [id]);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const result = await uploadFile(file, "featured-images", () => {});
      setFeaturedImage(result.url);
      setFeaturedImagePath(result.path);
    } catch (e: any) { alert("Upload failed: " + (e.message || "Please try again.")); }
    finally { setImageUploading(false); }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSave = async (newStatus?: string) => {
    if (!can("editBlog")) return;
    const status = newStatus || post?.status || "draft";
    if (status === "published" && !can("publishBlog")) { alert("You do not have permission to publish."); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, "blogs", id), {
        title, slug: slug || slugify(title), excerpt, content, category, tags,
        seoTitle: seoTitle || title, seoDescription,
        featuredImage, featuredImagePath, status,
        publishedAt: status === "published" && !post?.publishedAt ? new Date() : post?.publishedAt,
        updatedAt: new Date(),
      });
      if (adminProfile?.email) {
        await logAuditAction({ adminEmail: adminProfile.email, action: "lead_status_updated", details: `Blog updated: ${title}` });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/editor/posts" className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Post</h1>
            <p className="text-xs text-slate-600">Last saved: {post?.updatedAt?.toDate ? post.updatedAt.toDate().toLocaleString() : "never"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-sm transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {saveStatus === "saved" ? "Saved!" : "Save Draft"}
          </button>
          {can("publishBlog") && (
            <button onClick={() => handleSave(post?.status === "published" ? "draft" : "published")} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {post?.status === "published" ? "Unpublish" : "Publish"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 p-5 space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title…"
              className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-slate-700 focus:outline-none border-b border-purple-900/20 pb-3" />
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-sm">Slug:</span>
              <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 bg-transparent text-slate-400 text-sm focus:outline-none focus:text-slate-200 border-b border-transparent focus:border-purple-500/30 transition-colors" />
            </div>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt…" rows={2}
              className="w-full bg-transparent text-slate-400 text-sm placeholder:text-slate-700 focus:outline-none resize-none" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">Content</p>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO Settings</h3>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-300">SEO Title</label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60}
                className="w-full h-11 px-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-300">SEO Description</label>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={160} rows={3}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white text-sm resize-none" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Featured Image</h3>
            {featuredImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                <button onClick={() => { setFeaturedImage(""); setFeaturedImagePath(""); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-red-500/70 transition-colors"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <div onClick={() => !imageUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-purple-900/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-all ${imageUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-purple-500/40"}`}>
                {imageUploading ? <Loader2 className="w-6 h-6 text-purple-400 animate-spin" /> : <Upload className="w-6 h-6 text-slate-600" />}
                <p className="text-xs text-slate-500 text-center">Click to upload image</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                e.target.value = '';
              }} />
          </div>

          <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Category</h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-slate-300 text-sm appearance-none">
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="rounded-2xl bg-[#160d28]/70 border border-purple-900/30 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Tag className="w-4 h-4 text-purple-400" /> Tags</h3>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag…"
                className="flex-1 h-9 px-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white text-sm" />
              <button onClick={addTag} className="px-3 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-sm hover:bg-purple-600/30 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs">
                  {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
