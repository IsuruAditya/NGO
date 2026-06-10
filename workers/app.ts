import { createRequestHandler } from "react-router";
import api from "../app/api";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Route API requests to Hono
    if (url.pathname.startsWith("/api")) {
      return api.fetch(request, env, ctx);
    }

    // Route page requests to React Router
    return requestHandler(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
