import { env } from "cloudflare:workers";
import { Link } from "react-router";
import type { Route } from "./+types/blog.index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stories of Impact | EcoAlliance Blog" },
    {
      name: "description",
      content: "Read news updates, field journals, ecological reports, and stories of community transformation from the EcoAlliance team.",
    },
  ];
}

// Server Loader to fetch all blog posts from D1 SQLite
export async function loader() {
  try {
    const db = env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM blog_posts ORDER BY published_at DESC"
    ).all();
    return { posts: results };
  } catch (error) {
    console.error("Blog index loader error:", error);
    return { posts: [] };
  }
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Newsroom</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">Stories of Impact</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            Follow our field campaigns, water system inaugurations, and environmental insights directly from the team.
          </p>
        </div>
      </section>

      {/* 2. BLOG LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-md">
            <span className="text-4xl block mb-4">📭</span>
            <h3 className="text-lg font-bold text-slate-800">No blog posts found</h3>
            <p className="text-slate-500 text-sm font-light mt-2">
              We have not published any stories yet. Subscribe to our newsletter to stay updated!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-56 relative bg-slate-100">
                  <img
                    src={post.image_url || "https://images.unsplash.com/photo-1541959837701-d1e2b27cbb3c?auto=format&fit=crop&q=80&w=800"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                      📅 {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-505 text-sm leading-relaxed font-light line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                  <div className="pt-8">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
                    >
                      <span>Read Story</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
