# EcoAlliance: Developer & Deployment Handbook

Congratulations on successfully deploying your NGO website to Cloudflare! Your live application is running at:
👉 **[https://react-router-app.isuru1999adi-sandaru.workers.dev](https://react-router-app.isuru1999adi-sandaru.workers.dev)**

This handbook serves as your complete guide to maintaining, extending, and updating your website as you grow. Since you are new to web development, this document describes the workflow step-by-step.

---

## 1. Retrospective Analysis of Your Deployment

Let's break down exactly what happened when you ran your terminal commands:

1.  **Remote Database Migration (`npx wrangler d1 execute ngo-db --remote --file=./schema.sql`)**:
    *   Wrangler connected to the Cloudflare network and executed `schema.sql` on the live database. It created your tables (`programs`, `volunteers`, `donations`, `contacts`, `blog_posts`).
2.  **Remote Database Seeding (`npx wrangler d1 execute ... --file=./seed.sql`)**:
    *   Wrangler inserted 3 initial programs (Clean Water, Education, Forestry) and 2 blog posts into the production database.
3.  **Secret Provisioning (`npx wrangler secret put STRIPE_SECRET_KEY`)**:
    *   This stored your Stripe private key inside Cloudflare's secure hardware. The key is encrypted, meaning it is never exposed in the code.
4.  **Deployment Build & Asset Upload (`npm run deploy`)**:
    *   **Vite** (our bundler) compiled the frontend into a single package (`build/client`).
    *   **React Router** packed your server code (which loads database data and coordinates Hono) into a Cloudflare Workers runner (`build/server/index.js`).
    *   Wrangler uploaded these static assets (CSS stylesheets, images) and the compiled code.
    *   It bound your production database (`DB`) to your live Worker.

---

## 2. Daily Local Development Routine

When you want to work on the website locally before pushing updates live, follow these steps:

### Setup Your Environment Keys
Ensure you have a `.dev.vars` file in the project root containing your local Stripe key:
```text
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### Start the Local Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser. Changes you make in the code will appear on this screen instantly!

### Testing local database queries
To run SQL queries locally (e.g. looking at submissions or mock donations), run:
```bash
# List all volunteers who signed up locally
npx wrangler d1 execute ngo-db --local --command="SELECT * FROM volunteers"
```

---

## 3. How to Extend the Codebase (Modification Protocols)

As your NGO grows, you will need to add new features. Here is the exact blueprint for making modifications:

### Protocol A: Adding a New Page/Route
If you want to add a new page (e.g., a "Newsroom" page under `/news`):

1.  **Define the Route Map**:
    Open `app/routes.ts` and declare your new route using the `route` helper:
    ```typescript
    // app/routes.ts
    export default [
      index("routes/home.tsx"),
      route("about", "routes/about.tsx"),
      // Add your new route mapping here:
      route("news", "routes/news.tsx"),
    ] satisfies RouteConfig;
    ```
2.  **Create the Page File**:
    Create a new file called `app/routes/news.tsx` and structure it with a loader, metadata, and default export component:
    ```typescript
    // app/routes/news.tsx
    import type { Route } from "./+types/news";

    export function meta({}: Route.MetaArgs) {
      return [{ title: "EcoAlliance Newsroom" }];
    }

    export default function News() {
      return (
        <div className="max-w-4xl mx-auto py-16">
          <h1 className="text-3xl font-extrabold">NGO Press Releases</h1>
          <p className="text-slate-500">Welcome to our newsroom.</p>
        </div>
      );
    }
    ```
3.  **Run Dev**: Start the local server to verify `http://localhost:5173/news` works.

---

### Protocol B: Altering the Database Structure (Schema Changes)
If you need to store more information (e.g. adding a `category` column to the `programs` table):

1.  **Update the Local Schema File**:
    Open `schema.sql` and add the new column to your table definition.
2.  **Update Local SQLite Database**:
    Apply the change locally to update your local development database:
    ```bash
    npx wrangler d1 execute ngo-db --local --command="ALTER TABLE programs ADD COLUMN category TEXT;"
    ```
3.  **Update Cloudflare Production Database**:
    Apply the change to your live remote database:
    ```bash
    npx wrangler d1 execute ngo-db --remote --command="ALTER TABLE programs ADD COLUMN category TEXT;"
    ```
4.  **Regenerate TypeScript types**:
    Run typegen to ensure typescript is updated:
    ```bash
    npx wrangler types
    ```

---

### Protocol C: Modifying API Endpoints (Hono Router)
If you need to add a new API route (e.g., `/api/newsletter` for email signups):

1.  **Add Route to Hono Router**:
    Open `app/api/index.ts` and define the route:
    ```typescript
    // app/api/index.ts
    api.post("/newsletter", async (c) => {
      try {
        const { email } = await c.req.json();
        if (!email) return c.json({ success: false, error: "Email required" }, 400);

        // Save to D1 (if you make a newsletter table) or call an external service
        return c.json({ success: true, message: "Subscribed!" });
      } catch (err: any) {
        return c.json({ success: false, error: err.message }, 500);
      }
    });
    ```
2.  **Consume from Frontend**:
    In your React forms, you can post to `/api/newsletter` using standard fetch requests.

---

## 4. How to Deploy Updates (Production Workflow)

Whenever you edit files (like changing layouts, adding articles, or styling), publishing those updates is a simple one-step command:

```bash
npm run deploy
```

This will automatically:
1.  Verify typescript types.
2.  Compile your updated stylesheets, loaders, and actions.
3.  Upload the diff (the changed parts) to your live Cloudflare Worker.

*Note: Your database data (volunteers, contacts, donations) is stored separately in D1 and is preserved during code updates.*

---

## 5. Maintenance and Image Upload Policies

*   **Image Compression Guidelines**: Because images are converted into Base64 strings and stored inside D1 (SQLite), keep images compressed. Avoid uploading raw camera photos (which can be 5MB–10MB).
    *   Compress images using [squoosh.app](https://squoosh.app) to convert them to JPEG/WebP formats.
    *   Keep files **under 500KB** (ideal size is 100KB–300KB) to ensure lightning-fast page loading.
*   **Stripe Session Expiry**: Stripe checkout sessions expire after 24 hours. Pending donation rows created in your database will remain `pending` if a user closes the checkout. This is normal.
*   **Database Inspection**: You can inspect your live data via your browser by logging into the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigating to **D1 Databases > ngo-db**, and clicking the **Console** tab to run queries.
