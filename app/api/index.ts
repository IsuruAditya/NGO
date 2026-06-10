import { Hono } from "hono";
import Stripe from "stripe";

// Define the shape of our environment variables (secrets/keys)
export interface ApiEnv {
  Bindings: Env & {
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  };
}

// Initialize the Hono app
const api = new Hono<ApiEnv>().basePath("/api");

// ==========================================
// 1. PROGRAMS / PROJECTS ENDPOINTS
// ==========================================

// GET /api/programs - Returns all NGO initiatives
api.get("/programs", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM programs ORDER BY id DESC"
    ).all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==========================================
// 2. VOLUNTEER SIGNUP ENDPOINT
// ==========================================

// POST /api/volunteer - Receives volunteer applications
api.post("/volunteer", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, message } = body;

    // Basic Validation: make sure name and email are present
    if (!name || !email) {
      return c.json({ success: false, error: "Name and email are required." }, 400);
    }

    // Insert volunteer into D1 SQLite database
    await c.env.DB.prepare(
      "INSERT INTO volunteers (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'pending')"
    )
      .bind(name, email, phone || null, message || null)
      .run();

    return c.json({ success: true, message: "Volunteer application received!" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==========================================
// 3. CONTACT FORM SUBMISSIONS ENDPOINT
// ==========================================

// POST /api/contact - Receives contact messages
api.post("/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ success: false, error: "Name, email, and message are required." }, 400);
    }

    // Insert contact message into D1 SQLite database
    await c.env.DB.prepare(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
    )
      .bind(name, email, message)
      .run();

    return c.json({ success: true, message: "Your message has been stored. Thank you!" });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==========================================
// 4. BLOG / NEWS ENDPOINTS
// ==========================================

// GET /api/blog - Returns all blog posts
api.get("/blog", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM blog_posts ORDER BY published_at DESC"
    ).all();
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET /api/blog/:slug - Returns a specific blog post by its URL identifier (slug)
api.get("/blog/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const post = await c.env.DB.prepare(
      "SELECT * FROM blog_posts WHERE slug = ?"
    )
      .bind(slug)
      .first();

    if (!post) {
      return c.json({ success: false, error: "Blog post not found." }, 404);
    }

    return c.json({ success: true, data: post });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==========================================
// 5. STRIPE DONATION ENDPOINTS
// ==========================================

// POST /api/donate/checkout - Creates a Stripe Checkout Session
api.post("/donate/checkout", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, donorName, donorEmail, programId } = body;

    if (!amount || amount <= 0 || !donorName || !donorEmail) {
      return c.json({ success: false, error: "Invalid donation details." }, 400);
    }

    const stripeKey = c.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return c.json(
        { success: false, error: "Stripe key is not configured in environment variables." },
        500
      );
    }

    // Initialize Stripe client
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-15-preview" as any });

    // Determine the origin URL of the request to construct redirect pages
    const requestUrl = new URL(c.req.url);
    const origin = requestUrl.origin;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${programId ? "Program ID: " + programId : "General NGO Fund"}`,
              description: `Thank you for supporting our cause, ${donorName}!`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents ($10 = 1000 cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: donorEmail,
      success_url: `${origin}/donate?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?cancelled=true`,
      metadata: {
        donorName,
        donorEmail,
        amount: amount.toString(),
        programId: programId ? programId.toString() : "",
      },
    });

    // Record the pending donation in our database
    await c.env.DB.prepare(
      "INSERT INTO donations (donor_name, donor_email, amount, stripe_session_id, status) VALUES (?, ?, ?, ?, 'pending')"
    )
      .bind(donorName, donorEmail, amount, session.id)
      .run();

    return c.json({ success: true, url: session.url });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// POST /api/donate/webhook - Stripe Webhook to mark donation successful
api.post("/donate/webhook", async (c) => {
  try {
    const stripeKey = c.env.STRIPE_SECRET_KEY;
    const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
      return c.json({ success: false, error: "Stripe secret keys are not configured." }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-15-preview" as any });

    // Verify webhook signature (Cloudflare Workers raw request body is text)
    const signature = c.req.header("stripe-signature");
    if (!signature) {
      return c.json({ success: false, error: "Stripe signature header is missing." }, 400);
    }

    const rawBody = await c.req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } catch (err: any) {
      return c.json({ success: false, error: `Webhook signature verification failed: ${err.message}` }, 400);
    }

    // Process event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      // Find the pending donation
      const donation = await c.env.DB.prepare(
        "SELECT * FROM donations WHERE stripe_session_id = ?"
      )
        .bind(sessionId)
        .first();

      if (donation) {
        // 1. Update donation status to success
        await c.env.DB.prepare(
          "UPDATE donations SET status = 'success' WHERE stripe_session_id = ?"
        )
          .bind(sessionId)
          .run();

        // 2. If donation is linked to a program, increment the raised amount
        const programId = session.metadata?.programId;
        const amount = parseFloat(session.metadata?.amount || "0");

        if (programId && amount > 0) {
          await c.env.DB.prepare(
            "UPDATE programs SET raised_amount = raised_amount + ? WHERE id = ?"
          )
            .bind(amount, parseInt(programId))
            .run();
        }
      }
    }

    return c.json({ received: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==========================================
// 6. IMAGE STORAGE (R2) ENDPOINTS
// ==========================================

// POST /api/upload - Uploads a file to Cloudflare R2
api.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return c.json({ success: false, error: "No file uploaded." }, 400);
    }

    // Generate a unique file name
    const ext = file.name.split(".").pop() || "jpg";
    const key = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Upload direct to R2 bucket
    await c.env.IMAGES.put(key, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // Return the URL matching our R2 reader proxy endpoint below
    return c.json({ success: true, url: `/api/images/${key}` });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// GET /api/images/:key - Serves files directly from R2
api.get("/images/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const file = await c.env.IMAGES.get(key);

    if (!file) {
      return c.text("Image not found", 404);
    }

    // Set headers and respond with the image binary stream
    const headers = new Headers();
    file.writeHttpMetadata(headers);
    headers.set("etag", file.httpEtag);

    return new Response(file.body, { headers });
  } catch (err: any) {
    return c.text(`Error: ${err.message}`, 500);
  }
});

export default api;
