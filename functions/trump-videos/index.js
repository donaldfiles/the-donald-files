import { paged } from '../_lib/paged.js'
export const onRequestGet = (ctx) => paged(ctx, '/trump-videos/')
