"use client";

import { useEffect, useState, useRef } from "react";
import { listFiles, uploadFile, deleteFile } from "@/lib/storage";
import { useAdmin } from "@/lib/admin-context";
import { Upload, Trash2, Copy, Loader2, Search, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface MediaFile {
  name: string;
  path: string;
  url: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { can } = useAdmin();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const blogMedia = await listFiles("blog-media");
      const featuredImages = await listFiles("featured-images");
      setFiles([...featuredImages, ...blogMedia] as MediaFile[]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiles();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = async (file: File) => {
    if (!can("uploadMedia")) return;
    setUploading(true);
    try {
      await uploadFile(file, "blog-media", (p) => setUploadProgress(p));
      await fetchFiles();
    } catch (e) {
      console.error(e);
      alert("Upload failed.");
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const handleDelete = async (path: string) => {
    if (!can("uploadMedia")) return;
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeletingPath(path);
    try {
      await deleteFile(path);
      setFiles(files.filter((f) => f.path !== path));
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    } finally { setDeletingPath(null); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Media Library</h1>
          <p className="text-slate-500 mt-1">{files.length} file{files.length !== 1 ? "s" : ""} stored</p>
        </div>
        {can("uploadMedia") && (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50">
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {Math.round(uploadProgress)}%</> : <><Upload className="w-4 h-4" /> Upload Image</>}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by filename…"
          className="w-full pl-10 pr-4 py-2.5 bg-[#160d28]/70 border border-purple-900/30 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder:text-slate-600 text-sm" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" /></div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-700" />
          </div>
          <p className="text-slate-500">No images uploaded yet.</p>
          {can("uploadMedia") && (
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-sm hover:bg-purple-600/30 transition-colors">
              <Upload className="w-4 h-4" /> Upload your first image
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.path} className="group relative aspect-square rounded-xl overflow-hidden bg-[#160d28]/70 border border-purple-900/30 hover:border-purple-500/40 transition-all">
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-xs text-white text-center truncate w-full px-1">{file.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(file.url)} title="Copy URL"
                    className="p-2 bg-slate-800/80 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                    {copiedUrl === file.url ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {can("uploadMedia") && (
                    <button onClick={() => handleDelete(file.path)} disabled={deletingPath === file.path}
                      className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                      {deletingPath === file.path ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
