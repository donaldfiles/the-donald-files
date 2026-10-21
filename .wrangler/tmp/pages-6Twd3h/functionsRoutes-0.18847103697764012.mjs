import { onRequestGet as __api_confirm_js_onRequestGet } from "/workspace/the-donald-files/functions/api/confirm.js"
import { onRequestPost as __api_subscribe_js_onRequestPost } from "/workspace/the-donald-files/functions/api/subscribe.js"
import { onRequestGet as __api_unsubscribe_js_onRequestGet } from "/workspace/the-donald-files/functions/api/unsubscribe.js"
import { onRequestPost as __api_unsubscribe_js_onRequestPost } from "/workspace/the-donald-files/functions/api/unsubscribe.js"
import { onRequest as __api_subscribe_js_onRequest } from "/workspace/the-donald-files/functions/api/subscribe.js"
import { onRequestGet as __trump_videos__topic__js_onRequestGet } from "/workspace/the-donald-files/functions/trump-videos/[topic].js"
import { onRequestGet as __trump_videos_index_js_onRequestGet } from "/workspace/the-donald-files/functions/trump-videos/index.js"

export const routes = [
    {
      routePath: "/api/confirm",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_confirm_js_onRequestGet],
    },
  {
      routePath: "/api/subscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscribe_js_onRequestPost],
    },
  {
      routePath: "/api/unsubscribe",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_unsubscribe_js_onRequestGet],
    },
  {
      routePath: "/api/unsubscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_unsubscribe_js_onRequestPost],
    },
  {
      routePath: "/api/subscribe",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_subscribe_js_onRequest],
    },
  {
      routePath: "/trump-videos/:topic",
      mountPath: "/trump-videos",
      method: "GET",
      middlewares: [],
      modules: [__trump_videos__topic__js_onRequestGet],
    },
  {
      routePath: "/trump-videos",
      mountPath: "/trump-videos",
      method: "GET",
      middlewares: [],
      modules: [__trump_videos_index_js_onRequestGet],
    },
  ]