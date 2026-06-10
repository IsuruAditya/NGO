import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("programs", "routes/programs.tsx"),
  route("volunteer", "routes/volunteer.tsx"),
  route("donate", "routes/donate.tsx"),
  route("contact", "routes/contact.tsx"),
  route("blog", "routes/blog.index.tsx"),
  route("blog/:slug", "routes/blog.detail.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
