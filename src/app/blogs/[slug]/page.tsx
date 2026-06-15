import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Share2, Tag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

async function getPostBySlug(slug: string) {
  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug), where("status", "==", "published"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() as any };
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Mesma" };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title: `${title} | Mesma Technologies`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toDate().toISOString(),
      authors: [post.author],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

function readingTime(content: string): number {
  const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const date = post.publishedAt?.toDate ? format(post.publishedAt.toDate(), "MMMM d, yyyy") : "";
  const rTime = readingTime(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage ? [post.featuredImage] : [],
    "datePublished": post.publishedAt?.toDate().toISOString(),
    "dateModified": post.updatedAt?.toDate().toISOString(),
    "author": [{ "@type": "Person", "name": post.author }],
    "publisher": {
      "@type": "Organization",
      "name": "Mesma Technologies",
      "logo": { "@type": "ImageObject", "url": "https://mesma.co.in/logo.png" }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FF] flex flex-col">
      <Navbar />
      <article className="flex-1 pt-12 pb-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-wider">{post.category || "General"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-gray-700">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{rTime} min read</span>
            </div>
          </div>
        </header>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-purple-100 bg-white">
            <img src={post.featuredImage} alt={post.title} className="w-full max-h-[600px] object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-purple"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-purple-100 flex flex-wrap items-center gap-3">
            <Tag className="w-5 h-5 text-gray-400" />
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm hover:border-purple-300 hover:text-purple-600 cursor-default transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 p-8 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Found this helpful?</h3>
            <p className="text-gray-500 text-sm">Share this article with your network.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Simple share buttons - in a real app these would have proper sharing URLs */}
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors">
              <Share2 className="w-4 h-4" /> Share Article
            </button>
          </div>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
