import { env } from "cloudflare:workers";
import { Link } from "react-router";
import type { Route } from "./+types/programs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Programs & Active Initiatives | EcoAlliance" },
    {
      name: "description",
      content: "Explore our active environmental, water access, and community education programs, and find ways to support their completion.",
    },
  ];
}

// Server-side loader to fetch all programs
export async function loader() {
  try {
    const db = env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM programs ORDER BY id DESC"
    ).all();
    return { programs: results };
  } catch (error) {
    console.error("Programs loader error:", error);
    return { programs: [] };
  }
}

export default function Programs({ loaderData }: Route.ComponentProps) {
  const { programs } = loaderData;

  return (
    <div className="pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Our Work</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">Our Programs & Initiatives</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            Supporting environmental restoration and humanitarian resource deployment directly on the ground.
          </p>
        </div>
      </section>

      {/* 2. INITIATIVES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {programs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-md">
            <span className="text-4xl block mb-4">📭</span>
            <h3 className="text-lg font-bold text-slate-800">No programs found</h3>
            <p className="text-slate-500 text-sm font-light mt-2">
              We are currently preparing new initiatives. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program: any) => {
              const percentage = Math.min(
                100,
                Math.round((program.raised_amount / program.goal_amount) * 100)
              );

              return (
                <div
                  key={program.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
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
                      <p className="text-slate-500 text-sm leading-relaxed font-light">
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
                        <div>
                          <span className="block text-slate-900 font-extrabold text-lg">
                            ${program.raised_amount.toLocaleString()}
                          </span>
                          <span className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                            raised of goal
                          </span>
                        </div>
                        <Link
                          to={`/donate?program=${program.id}`}
                          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg shadow-emerald-50 hover:shadow-emerald-100 rounded-xl transition-all duration-200"
                        >
                          Sponsor Project
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
