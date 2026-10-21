import { paged } from '../_lib/paged.js'
// Only invoked for the topic hubs listed in dist/_routes.json (clip pages stay pure static).
export const onRequestGet = (ctx) => paged(ctx, `/trump-videos/${ctx.params.topic}/`)
