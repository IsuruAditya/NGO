import { env } from "cloudflare:workers";
import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/blog.detail";

// Dynamic SEO meta tags based on the loaded blog post data
export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.post) {
    return [
      { title: "Story Not Found | EcoAlliance" },
      { name: "description", content: "The requested blog story could not be found." },
    ];
  }
  return [
    { title: `${data.post.title} | EcoAlliance Blog` },
    { name: "description", content: data.post.summary },
  ];
}

// Server-side loader to fetch the specific blog post by slug
export async function loader({ params }: Route.LoaderArgs) {
  try {
    const db = env.DB;
    const post = await db.prepare(
      "SELECT * FROM blog_posts WHERE slug = ?"
    )
      .bind(params.slug)
      .first();

    if (!post) {
      throw new Response("Blog post not found", { status: 404 });
    }

    return { post };
  } catch (error: any) {
    if (error instanceof Response) throw error;
    console.error("Blog detail loader error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
}

export default function BlogDetail() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="pb-24">
      {/* 1. COVER HERO IMAGE */}
      <div className="w-full h-[32rem] relative bg-slate-900 overflow-hidden">
        <img
          src={post.image_url || "https://images.unsplash.com/photo-1541959837701-d1e2b27cbb3c?auto=format&fit=crop&q=80&w=1200"}
          alt={post.title}
          className="w-full h-full object-cover opacity-60 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        {/* Breadcrumb & Title Overlay */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest"
            >
              <span>← Back to Newsroom</span>
            </Link>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center space-x-3 text-xs text-slate-350">
              <span className="font-semibold text-emerald-400">EcoAlliance Field Staff</span>
              <span>•</span>
              <span>{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARTICLE BODY CONTENT */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/30 p-8 sm:p-12">
          {/* Summary / Blurb Box */}
          <div className="border-l-4 border-emerald-500 pl-6 mb-12">
            <p className="text-slate-655 text-base italic leading-relaxed font-light">
              {post.summary}
            </p>
          </div>

          {/* Main Content Rendered Safely from Database */}
          <div
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-light space-y-6 text-sm sm:text-base prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* Footer inside article */}
          <div className="border-t border-slate-100 mt-12 pt-8 flex items-center justify-between">
            <span className="text-xs text-slate-400">Category: Field Report</span>
            <div className="flex space-x-2">
              {/* Share links placeholders */}
              <button
                onClick={() => alert("Copied story link to clipboard!")}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition-all cursor-pointer"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
