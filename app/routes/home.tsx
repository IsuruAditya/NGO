import { env } from "cloudflare:workers";
import { Link } from "react-router";
import type { Route } from "./+types/home";

// Meta tags for search engines (SEO)
export function meta({}: Route.MetaArgs) {
  return [
    { title: "EcoAlliance | Empowering Conservation & Sustainable Communities" },
    {
      name: "description",
      content: "Join EcoAlliance in protecting global ecosystems, drilling clean water wells, planting native forests, and sponsoring child education.",
    },
  ];
}

// Server-side loader to fetch featured programs and recent news
export async function loader() {
  try {
    const db = env.DB;

    // Fetch the 3 most recently created programs
    const { results: programs } = await db.prepare(
      "SELECT * FROM programs ORDER BY id DESC LIMIT 3"
    ).all();

    // Fetch the 2 most recently published blog posts
    const { results: blogPosts } = await db.prepare(
      "SELECT * FROM blog_posts ORDER BY published_at DESC LIMIT 2"
    ).all();

    return { programs, blogPosts };
  } catch (error) {
    console.error("Home loader error:", error);
    return { programs: [], blogPosts: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { programs, blogPosts } = loaderData;

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-50 via-slate-50 to-white pt-24 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                🌍 Protecting Our Ecosystems
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] font-sans">
                Nurture Earth, <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Empower Communities
                </span>
              </h1>
              <p className="text-lg text-slate-655 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                We bridge the gap between ecological conservation and community prosperity. Through clean water access, reforestation, and education, we build a greener future.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/donate"
                  className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-xl shadow-emerald-100 hover:shadow-emerald-250 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Donate to a Project
                </Link>
                <Link
                  to="/volunteer"
                  className="px-8 py-4 rounded-xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm hover:border-slate-300 transition-all duration-200"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>

            {/* Visual Panel */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-[3rem] bg-gradient-to-tr from-emerald-150 to-teal-100 overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                  alt="Environmental restoration volunteer holding sapling"
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 filter contrast-105"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 flex items-center space-x-4 max-w-xs animate-bounce">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xl">
                  🌳
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-lg">50,000+</span>
                  <span className="block text-xs text-slate-500 font-medium">Trees Planted Globally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NGO STATS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2.5rem] py-12 px-6 sm:px-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <div>
              <span className="block text-4xl sm:text-5xl font-black text-emerald-450 mb-1">50K+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Trees Planted</span>
            </div>
            <div>
              <span className="block text-4xl sm:text-5xl font-black text-emerald-450 mb-1">10K+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Kids Supported</span>
            </div>
            <div>
              <span className="block text-4xl sm:text-5xl font-black text-emerald-450 mb-1">50+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Clean Wells Built</span>
            </div>
            <div>
              <span className="block text-4xl sm:text-5xl font-black text-emerald-450 mb-1">2.5M+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Gallons Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE MISSION PUSH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Strategy</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Three Pillars of Sustainable Action</h2>
          <p className="text-slate-500 leading-relaxed font-light text-base">
            We formulate long-term solutions by addressing environmental deterioration, educational deficits, and water scarcity concurrently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-slate-100 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              🌲
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Reforestation & Climate</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Restoring habitats by planting native trees, preventing soil erosion, and educating farmers on sustainable agroforestry practices.
            </p>
          </div>
          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-slate-100 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              💧
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Clean Water Access</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Providing off-grid, solar-powered wells and water purification stations to communities facing severe water contamination and shortages.
            </p>
          </div>
          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-slate-100 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              🎒
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Youth Empowerment</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Distributing school books, paying secondary school tuition fees, and offering environmental camps to nurture the next generation of eco-citizens.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS (D1 BOUND) */}
      <section className="bg-slate-100/60 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Active Initiatives</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Featured Programs</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Directly support local communities by contributing to our active programs. Transparent metrics and direct allocation.
              </p>
            </div>
            <Link
              to="/programs"
              className="mt-4 md:mt-0 text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center space-x-2 group hover:underline"
            >
              <span>View All Programs</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program: any) => {
              const percentage = Math.min(
                100,
                Math.round((program.raised_amount / program.goal_amount) * 100)
              );
              return (
                <div
                  key={program.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-56 relative overflow-hidden bg-slate-100">
                    <img
                      src={program.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900">{program.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-light line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    <div className="mt-8 space-y-6">
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-600">{percentage}% Raised</span>
                          <span className="text-slate-400">Goal: ${program.goal_amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-900 font-extrabold">
                          ${program.raised_amount.toLocaleString()}{" "}
                          <span className="text-slate-400 text-xs font-normal">raised</span>
                        </span>
                        <Link
                          to={`/donate?program=${program.id}`}
                          className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-850 rounded-xl transition-all"
                        >
                          Donate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LATEST BLOG POSTS (D1 BOUND) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Newsroom</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Stories of Impact</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Read how your donations are applied in our fieldwork campaigns and updates from our environmental staff.
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center space-x-2 group hover:underline"
          >
            <span>Read all updates</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post: any) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-full"
            >
              <div className="md:w-2/5 h-64 md:h-auto relative bg-slate-100 flex-shrink-0">
                <img
                  src={post.image_url || "https://images.unsplash.com/photo-1541959837701-d1e2b27cbb3c?auto=format&fit=crop&q=80&w=800"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-3/5 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    📅 {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-light line-clamp-3">
                    {post.summary}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 group"
                  >
                    <span>Read Full Story</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-emerald-650 to-teal-550 rounded-[2.5rem] p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black leading-tight">Ready to make a difference?</h2>
            <p className="text-base sm:text-lg text-emerald-50 leading-relaxed font-light">
              Your contribution, whether it is $10 or a week of your time as a volunteer, helps us secure ecosystems and deliver humanitarian support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                to="/donate"
                className="px-8 py-4 rounded-xl text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg transition-all"
              >
                Donate Now
              </Link>
              <Link
                to="/volunteer"
                className="px-8 py-4 rounded-xl text-base font-bold bg-emerald-700 hover:bg-emerald-750 text-white shadow-lg border border-emerald-600/30 transition-all"
              >
                Sign Up to Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
