import { env } from "cloudflare:workers";
import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/volunteer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Volunteer Registration | Get Involved | EcoAlliance" },
    {
      name: "description",
      content: "Register to join our conservation volunteer team. Offer your skills, help plant forests, assist in drilling wells, and support educational programs.",
    },
  ];
}

// Server-side Action to handle the form submission
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  // Basic Validation
  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    const db = env.DB;
    await db.prepare(
      "INSERT INTO volunteers (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'pending')"
    )
      .bind(name, email, phone || null, message || null)
      .run();

    return { success: true, message: "Thank you for registering! We will reach out to you within 2-3 business days." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default function Volunteer() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Get Involved</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">Become a Volunteer</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            Apply your time, skills, and passion to assist local communities and build ecological resilience.
          </p>
        </div>
      </section>

      {/* 2. CORE REGISTRATION BOX */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/40 p-8 sm:p-12">
          {actionData?.success ? (
            /* Success State */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-inner shadow-emerald-100/50">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Application Received!</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto font-light">
                  {actionData.message}
                </p>
              </div>
            </div>
          ) : (
            /* Form State */
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Volunteer Application</h2>
                <p className="text-slate-500 text-xs font-light">
                  Please fill out the form below. Fields marked with an asterisk (*) are required.
                </p>
              </div>

              {actionData?.error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                  ⚠️ {actionData.error}
                </div>
              )}

              <Form method="post" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g. +1 (555) 012-3456"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                    Why do you want to volunteer? (Skills & Motivation)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us a little bit about your interest, skills, or prior conservation experiences..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </Form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
