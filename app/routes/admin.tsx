import { env } from "cloudflare:workers";
import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/admin";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Publish Article | Admin Control" }];
}

// Server Action to handle the blog post creation + image upload to R2
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const summary = formData.get("summary")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const imageFile = formData.get("image") as File | null;

  if (!title || !slug || !summary || !content) {
    return { success: false, error: "Title, slug, summary, and content are required." };
  }

  try {
    let imageUrl = "";

    // If an image is selected, convert it directly to Base64 text string
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      imageUrl = `data:${imageFile.type};base64,${base64}`;
    }

    // Insert the blog post metadata and image URL into D1 SQLite database
    const db = env.DB;
    await db.prepare(
      "INSERT INTO blog_posts (title, slug, summary, content, image_url) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(title, slug, summary, content, imageUrl || null)
      .run();

    return { success: true, message: "Blog post published successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default function Admin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create New Article</h1>
        <p className="text-slate-500 text-xs font-light">
          Fill in the details below to upload a cover photo and write a blog post.
        </p>
      </div>

      {actionData?.success ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-105 text-emerald-600 flex items-center justify-center text-xl mx-auto">
            ✓
          </div>
          <p className="text-emerald-800 text-sm font-semibold">{actionData.message}</p>
          <a
            href="/blog"
            className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-lg"
          >
            Go to Blog Feed
          </a>
        </div>
      ) : (
        <Form method="post" encType="multipart/form-data" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          {actionData?.error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
              ⚠️ {actionData.error}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Planting 5,000 Oak Trees"
              className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-sm"
            />
          </div>

          {/* Slug input */}
          <div className="space-y-1">
            <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
              URL Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              placeholder="e.g. planting-oak-trees"
              className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-sm"
            />
          </div>

          {/* Summary input */}
          <div className="space-y-1">
            <label htmlFor="summary" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
              Short Summary
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              required
              placeholder="A brief snippet displayed on the feed list page..."
              className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-sm"
            />
          </div>

          {/* Image file upload */}
          <div className="space-y-1">
            <label htmlFor="image" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
              Cover Image File
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          {/* Content HTML editor */}
          <div className="space-y-1">
            <label htmlFor="content" className="block text-xs font-bold uppercase tracking-wider text-slate-550">
              Article Content (HTML supported)
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              placeholder="<p>Write your detailed story here...</p>"
              className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-sm"
            ></textarea>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center"
          >
            {isSubmitting ? "Uploading & Publishing..." : "Publish Post"}
          </button>
        </Form>
      )}
    </div>
  );
}
