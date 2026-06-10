import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Story & Team | EcoAlliance" },
    {
      name: "description",
      content: "Learn about EcoAlliance's origins, our core conservation values, and the dedicated team of volunteers and specialists driving our ecological initiatives.",
    },
  ];
}

export default function About() {
  const values = [
    {
      icon: "🌱",
      title: "Sustainability First",
      desc: "Every initiative we deploy is engineered for long-term ecological balance and community self-reliance.",
    },
    {
      icon: "🤝",
      title: "Community Partnerships",
      desc: "We co-design conservation projects directly with native communities to respect local customs and knowledge.",
    },
    {
      icon: "📊",
      title: "Radical Transparency",
      desc: "We track every dollar spent and map all well coordinates and reforestation metrics on our public ledger.",
    },
  ];

  const team = [
    {
      name: "Dr. Elena Vance",
      role: "Executive Director & Ecologist",
      bio: "Elena holds a PhD in Forest Ecology and has directed environmental campaigns across three continents for 15 years.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Marcus Thorne",
      role: "Director of Water Operations",
      bio: "An off-grid mechanical engineer, Marcus has overseen the installation of over 120 solar-powered water systems.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sarah Jenkins",
      role: "Education Coordinator",
      bio: "Sarah is a former high-school principal dedicated to integrating environmental literacy and local schooling.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <div className="pb-24">
      {/* 1. HEADER HERO */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Our Identity</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">About EcoAlliance</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            A collective of scientists, engineers, and volunteers dedicating resources to restore ecosystems and uplift community standards.
          </p>
        </div>
      </section>

      {/* 2. THE STORY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900">How We Started</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              Founded in 2021, EcoAlliance started when a group of environmental scientists witnessed the compounding impacts of deforestation and seasonal droughts in rural communities. 
            </p>
            <p className="text-slate-500 text-sm leading-relaxed font-light">
              We realized that nature conservation fails if the local population lacks fresh water or basic resources. By drilling wells and sponsoring schooling alongside planting trees, we provide communities with the economic flexibility to protect their surrounding forests.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
                alt="Mountains and trees landscape representation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="bg-slate-100/60 py-20 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Compass</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/20">
                <div className="text-3xl mb-4">{val.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEET THE TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Innovators</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Meet Our Leadership</h2>
          <p className="text-slate-500 text-sm leading-relaxed font-light">
            Meet the researchers, operations planners, and coordinators spearheading our global efforts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((person, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/20 flex flex-col hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-64 overflow-hidden bg-slate-150">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-4 flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    {person.role}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
