import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Metadata } from "next";
import { format } from "date-fns";
import { Search, Clock, ArrowRight, BookOpen, Rss } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog – AI Automation Insights | Mesma Technologies",
  description: "Explore expert articles on AI receptionists, voice automation, lead qualification, and business automation from the Mesma Technologies team.",
};

const CATEGORIES = ["All", "AI Receptionist", "Customer Support", "Voice Automation", "Business Automation", "Call Center AI", "Technology", "Case Studies"];

function readingTime(content: string): number {
  const words = content?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

async function getPosts(category?: string) {
  try {
    let q;
    if (category && category !== "All") {
      q = query(collection(db, "blogs"), where("status", "==", "published"), where("category", "==", category), orderBy("publishedAt", "desc"));
    } else {
      q = query(collection(db, "blogs"), where("status", "==", "published"), orderBy("publishedAt", "desc"));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
  } catch {
    return [];
  }
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const posts = await getPosts(category);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FF] via-white to-[#F0EBF9]">
      <Navbar />

      {/* Hero with Water Animation */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4 bg-[#0a0514] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-transparent z-0" />
        
        {/* Water Wave Animation SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 z-0">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px] sm:h-[120px] md:h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <style>
              {`
                .shape-fill { fill: #F7F5FF; }
                .wave-animation { animation: wave 12s linear infinite; }
                .wave-animation-slow { animation: wave 18s linear infinite; opacity: 0.5; }
                @keyframes wave {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-1200px); }
                }
              `}
            </style>
            <g className="wave-animation">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill" />
              <path d="M1521.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C2023.78,31,2106.67,72,2185.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H1200V27.35A600.21,600.21,0,0,0,1521.39,56.44Z" className="shape-fill" />
            </g>
            <g className="wave-animation-slow" style={{ transformOrigin: "center", transform: "scaleX(-1) translateX(-200px)" }}>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill" />
              <path d="M1521.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C2023.78,31,2106.67,72,2185.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H1200V27.35A600.21,600.21,0,0,0,1521.39,56.44Z" className="shape-fill" />
            </g>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-6">
            <Rss className="w-4 h-4" /> Mesma Blog
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            AI Automation<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">Insights & Guides</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Expert articles on AI receptionists, voice automation, lead qualification, and how businesses are scaling with AI.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = (!category && cat === "All") || category === cat;
              return (
                <Link key={cat} href={cat === "All" ? "/blogs" : `/blogs?category=${encodeURIComponent(cat)}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${isActive ? "bg-purple-600 text-white border-purple-600 shadow-[0_2px_15px_rgba(124,58,237,0.3)]" : "bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600"}`}>
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
            <p className="text-gray-400">Check back soon for articles on AI automation and business growth.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link href={`/blogs/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-8 p-8 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300">
                  {featured.featuredImage && (
                    <div className="relative h-64 md:h-full rounded-2xl overflow-hidden">
                      <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{featured.category || "General"}</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime(featured.content)} min read</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">{featured.title}</h2>
                    <p className="text-gray-500 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                          {featured.author?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{featured.author}</p>
                          <p className="text-xs text-gray-400">{featured.publishedAt?.toDate ? format(featured.publishedAt.toDate(), "MMM d, yyyy") : ""}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">Read more <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Post Grid */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-8">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => {
                    const date = post.publishedAt?.toDate ? format(post.publishedAt.toDate(), "MMM d, yyyy") : "";
                    return (
                      <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col rounded-2xl bg-white border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                        {post.featuredImage ? (
                          <div className="h-48 overflow-hidden">
                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-purple-300" />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1 gap-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-medium border border-purple-100">{post.category || "General"}</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime(post.content)} min</span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">{post.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                                {post.author?.charAt(0) || "M"}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-700">{post.author}</p>
                                <p className="text-xs text-gray-400">{date}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
