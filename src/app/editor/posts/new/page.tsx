"use client";

import { useState, useRef, useCallback } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { uploadFile } from "@/lib/storage";
import { ArrowLeft, Save, Globe, Clock, Upload, X, Loader2, Eye, Tag, ChevronDown } from "lucide-react";
import Link from "next/link";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor").then(m => ({ default: m.TiptapEditor })), { ssr: false });

const CATEGORIES = ["AI Receptionist", "Customer Support", "Voice Automation", "Business Automation", "Call Center AI", "Technology", "Case Studies"];
const STATUS_OPTIONS = [
  { value: "draft", label: "Save as Draft" },
  { value: "pending_review", label: "Submit for Review" },
  { value: "published", label: "Publish Now" },
  { value: "scheduled", label: "Schedule" },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

interface InputFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function InputField({ label, required, children, hint }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export default function NewPostPage() {
  const { adminProfile, can } = useAdmin();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [featuredImagePath, setFeaturedImagePath] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishStatus, setPublishStatus] = useState("draft");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === slugify(title)) setSlug(slugify(val));
    if (!seoTitle) setSeoTitle(val);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const result = await uploadFile(file, "featured-images", (p) => setImageUploadProgress(p));
      setFeaturedImage(result.url);
      setFeaturedImagePath(result.path);
    } catch (e: any) { console.error(e); alert("Image upload failed: " + (e.message || "Please try again.")); }
    finally { setImageUploading(false); setImageUploadProgress(0); }
  };

  const handleSave = async (status: string = publishStatus) => {
    if (!title.trim()) { alert("Please add a title before saving."); return; }
    if (!can("createBlog") && !can("editBlog")) return;
    if (status === "published" && !can("publishBlog")) { alert("You do not have permission to publish posts."); return; }

    setSaving(true);
    setSaveStatus("saving");
    try {
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        slug: slug || slugify(title),
        excerpt: excerpt.trim(),
        content,
        category,
        tags,
        author: adminProfile?.name || "Unknown",
        authorId: adminProfile?.uid,
        status,
        featuredImage,
        featuredImagePath,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        publishedAt: status === "published" ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setSaveStatus("saved");
      setTimeout(() => router.push("/editor/posts"), 800);
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-white p-6 space-y-0 shadow-lg">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/editor/posts" className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">New Post</h1>
            <p className="text-xs text-gray-500">Unsaved draft</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave("draft")} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-xl text-sm transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          {can("publishBlog") && (
            <button onClick={() => handleSave("published")} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {saveStatus === "saved" ? "Published!" : "Publish"}
            </button>
          )}
          {!can("publishBlog") && can("createBlog") && (
            <button onClick={() => handleSave("pending_review")} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
              Submit for Review
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5 space-y-4 shadow-sm">
            <input
              value={title}
              onChange={handleTitleChange}
              placeholder="Post Title…"
              className="w-full bg-transparent text-3xl font-bold text-gray-900 placeholder:text-gray-500 focus:outline-none border-b border-gray-300 pb-3"
            />
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-sm">Slug:</span>
              <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 bg-transparent text-slate-400 text-sm focus:outline-none focus:text-slate-200 border-b border-transparent focus:border-purple-500/30 transition-colors" />
            </div>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Write a short excerpt or summary…" rows={2}
              className="w-full bg-transparent text-slate-400 text-sm placeholder:text-slate-700 focus:outline-none resize-none" />
          </div>

          {/* Rich Text Editor */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">Content</p>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {/* SEO */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">SEO Settings</h3>
            <InputField label="SEO Title" hint={`${seoTitle.length}/60 characters`}>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={60}
                placeholder="Custom SEO title (defaults to post title)"
                className="w-full h-11 px-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-600 text-sm transition-all" />
            </InputField>
            <InputField label="SEO Description" hint={`${seoDescription.length}/160 characters`}>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={160} rows={3}
                placeholder="Write a compelling meta description…"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-600 text-sm transition-all resize-none" />
            </InputField>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-5">
          {/* Featured Image */}
          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-white">Featured Image</h3>
            {featuredImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                <button onClick={() => { setFeaturedImage(""); setFeaturedImagePath(""); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-red-500/70 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => !imageUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-purple-900/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${imageUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/5"}`}>
                {imageUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <p className="text-xs text-slate-500">{Math.round(imageUploadProgress)}% uploaded…</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-600" />
                    <p className="text-xs text-slate-500 text-center">Click to upload<br /><span className="text-slate-700">JPG, PNG, WEBP</span></p>
                  </>
                )}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                e.target.value = '';
              }} />
          </div>

          {/* Category */}
          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-white">Category</h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-slate-300 text-sm transition-all appearance-none">
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Tag className="w-4 h-4 text-purple-400" /> Tags</h3>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag…"
                className="flex-1 h-9 px-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-600 text-sm" />
              <button type="button" onClick={addTag} className="px-3 h-9 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-sm hover:bg-purple-600/30 transition-colors">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
