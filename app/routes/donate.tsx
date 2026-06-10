import { env } from "cloudflare:workers";
import { Form, useActionData, useLoaderData, useNavigation, redirect, useSearchParams } from "react-router";
import type { Route } from "./+types/donate";
import Stripe from "stripe";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Support Our Cause | Secure Donation | EcoAlliance" },
    {
      name: "description",
      content: "Make a tax-deductible contribution to EcoAlliance. Sponsor reforestation, provide clean drinking water, or support underprivileged schools.",
    },
  ];
}

// Server-side loader to fetch programs to populate the dropdown and verify checkout session
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const db = env.DB;
    const { results } = await db.prepare(
      "SELECT id, title FROM programs ORDER BY id DESC"
    ).all();

    // Parse the URL search params to see if a specific program was pre-selected
    const url = new URL(request.url);
    const selectedProgramId = url.searchParams.get("program") || "";
    const success = url.searchParams.get("success") === "true";
    const sessionId = url.searchParams.get("session_id") || "";

    // Synchronous redirect verification using STRIPE_SECRET_KEY
    if (success && sessionId) {
      const stripeKey = env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-15-preview" as any });
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
          // Check D1 database to see if this session was already completed
          const existingDonation = await db.prepare(
            "SELECT id, status FROM donations WHERE stripe_session_id = ?"
          )
            .bind(sessionId)
            .first() as { id: number; status: string } | null;

          if (existingDonation && existingDonation.status === "pending") {
            // 1. Mark the donation as success in the D1 database
            await db.prepare(
              "UPDATE donations SET status = 'success' WHERE stripe_session_id = ?"
            )
              .bind(sessionId)
              .run();

            // 2. Increment program raised amount if linked
            const programId = session.metadata?.programId;
            const amount = parseFloat(session.metadata?.amount || "0");

            if (programId && amount > 0) {
              await db.prepare(
                "UPDATE programs SET raised_amount = raised_amount + ? WHERE id = ?"
              )
                .bind(amount, parseInt(programId))
                .run();
            }
          }
        }
      }
    }

    return { programs: results, selectedProgramId };
  } catch (error) {
    console.error("Donate loader error:", error);
    return { programs: [], selectedProgramId: "" };
  }
}

// Action to process the form and call Hono Checkout API
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const amountStr = formData.get("amount")?.toString();
  const customAmountStr = formData.get("customAmount")?.toString();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const programId = formData.get("programId")?.toString();

  // Determine actual amount ($)
  let amount = parseFloat(amountStr || "0");
  if (amountStr === "custom") {
    amount = parseFloat(customAmountStr || "0");
  }

  // Validations
  if (!amount || amount <= 0) {
    return { success: false, error: "Please enter a valid donation amount." };
  }
  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    const origin = new URL(request.url).origin;

    // Call the Hono Checkout API route
    const response = await fetch(`${origin}/api/donate/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        donorName: name,
        donorEmail: email,
        programId: programId || null,
      }),
    });

    const result = await response.json() as any;

    if (result.success && result.url) {
      // Redirect user directly to Stripe Checkout
      return redirect(result.url);
    } else {
      return { success: false, error: result.error || "Failed to initiate payment gateway." };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export default function Donate() {
  const { programs, selectedProgramId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const isRedirecting = navigation.state === "submitting";
  const paymentSuccess = searchParams.get("success") === "true";
  const paymentCancelled = searchParams.get("cancelled") === "true";

  // Pre-configured donation amounts
  const presetAmounts = [15, 30, 50, 100];

  return (
    <div className="pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Giving Back</span>
          <h1 className="text-4xl sm:text-5xl font-black mt-3 mb-6">Support Our Mission</h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed font-light text-base sm:text-lg">
            Your donations directly fund native trees, solar pumps, and tuition fees on the ground. Secure payment powered by Stripe.
          </p>
        </div>
      </section>

      {/* 2. MAIN LAYOUT */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/40 p-8 sm:p-12">
          {paymentSuccess ? (
            /* Success Response Card */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-4xl mx-auto">
                🎉
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Thank You!</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto font-light">
                  Your donation checkout has been completed. A receipt has been sent to your email. We appreciate your generosity in helping preserve our ecosystems.
                </p>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Secure Donation Form</h2>
                <p className="text-slate-500 text-xs font-light">
                  Choose a contribution amount and fill out your information.
                </p>
              </div>

              {paymentCancelled && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold">
                  ⚠️ Payment was cancelled or interrupted. You can try again below.
                </div>
              )}

              {actionData?.error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                  ⚠️ {actionData.error}
                </div>
              )}

              <Form method="post" className="space-y-8">
                {/* 1. Select Amount */}
                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                    1. Select Donation Amount *
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {presetAmounts.map((amt) => (
                      <label
                        key={amt}
                        className="border border-slate-200 rounded-xl p-4 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-slate-350 transition-all font-semibold text-slate-800 has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500 has-[:checked]:text-emerald-700"
                      >
                        <input
                          type="radio"
                          name="amount"
                          value={amt}
                          defaultChecked={amt === 30}
                          className="sr-only"
                        />
                        <span className="text-2xl font-black">${amt}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">One-time</span>
                      </label>
                    ))}
                  </div>

                  {/* Custom Amount Field */}
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500 has-[:checked]:text-emerald-700">
                    <label className="flex items-center space-x-3 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="amount"
                        value="custom"
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm">Other Custom Amount ($)</span>
                    </label>
                    <input
                      type="number"
                      name="customAmount"
                      min="1"
                      placeholder="e.g. 250"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white placeholder-slate-400 max-w-[150px] font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* 2. Program Designation */}
                <div className="space-y-2">
                  <label htmlFor="programId" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                    2. Designate Donation (Optional)
                  </label>
                  <select
                    id="programId"
                    name="programId"
                    defaultValue={selectedProgramId}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="">General NGO Fund (Where needed most)</option>
                    {programs.map((prog: any) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Donor details */}
                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-550">
                    3. Contact Information *
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="e.g. Jane Smith"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs font-bold text-slate-500">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="e.g. jane@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit redirect button */}
                <button
                  type="submit"
                  disabled={isRedirecting}
                  className="w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center"
                >
                  {isRedirecting ? (
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
                      Connecting to secure payment gateway...
                    </>
                  ) : (
                    "Proceed to Secure Checkout"
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
