import { env } from "cloudflare:workers";
import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us | EcoAlliance" },
    {
      name: "description",
      content: "Have questions about our conservation programs, sponsorships, or volunteering? Reach out to EcoAlliance via email, phone, or our contact form.",
    },
  ];
}

// Server action to process contact submissions
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  // Basic Validation
  if (!name || !email || !message) {
    return { success: false, error: "Name, email, and message are required." };
  }

  try {
    const db = env.DB;
    await db.prepare(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
    )
      .bind(name, email, message)
      .run();

    return { success: true, message: "Your message has been sent successfully! Our administrative team will respond shortly." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Communication</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">Contact Us</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            Have questions about our initiatives, corporate partnerships, or donation options? Get in touch with our team.
          </p>
        </div>
      </section>

      {/* 2. CONTACT LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Side (Col span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Get in Touch</h2>
              <p className="text-slate-550 leading-relaxed font-light text-sm">
                We are open to collaborations, research inquiries, corporate CSR programs, and media interviews. Feel free to contact our Washington headquarters.
              </p>
            </div>

            <div className="space-y-6">
              {/* Box 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Office Location</h3>
                  <p className="text-slate-500 text-xs font-light mt-1">
                    100 Forest Parkway, Suite 500, Seattle, WA 98101
                  </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Email Inquiry</h3>
                  <p className="text-slate-500 text-xs font-light mt-1">
                    info@ecoalliance.org
                  </p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                  📞
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Phone Line</h3>
                  <p className="text-slate-500 text-xs font-light mt-1">
                    +1 (206) 555-0143
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side (Col span 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/40 p-8 sm:p-10">
              {actionData?.success ? (
                /* Success Message */
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-4xl mx-auto">
                    ✓
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Message Sent!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto font-light">
                      {actionData.message}
                    </p>
                  </div>
                </div>
              ) : (
                /* Form */
                <div className="space-y-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                    <p className="text-xs text-slate-400 font-light">
                      We usually respond within 24 hours on weekdays.
                    </p>
                  </div>

                  {actionData?.error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                      ⚠️ {actionData.error}
                    </div>
                  )}

                  <Form method="post" className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                          Your Name *
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

                      {/* Email */}
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

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                        Message Contents *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Write your question, proposal, or comment here..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                      ></textarea>
                    </div>

                    {/* Submit */}
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
                          Sending message...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
