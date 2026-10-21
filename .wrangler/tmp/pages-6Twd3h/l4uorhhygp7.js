// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/api/*",
    "/trump-videos",
    "/trump-videos/",
    "/trump-videos/gaffes",
    "/trump-videos/gaffes/",
    "/trump-videos/truth-social",
    "/trump-videos/truth-social/",
    "/trump-videos/cruelty",
    "/trump-videos/cruelty/"
  ],
  exclude: []
};

// ../../home/box/.local/lib/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/workspace/the-donald-files/.wrangler/tmp/pages-6Twd3h/functionsWorker-0.6349740193707201.mjs";
import { isRoutingRuleMatch } from "/home/box/.local/lib/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/workspace/the-donald-files/.wrangler/tmp/pages-6Twd3h/functionsWorker-0.6349740193707201.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=l4uorhhygp7.js.map
