// Hub pagination: /trump-videos/?page=N (and /trump-videos/<topic>/?page=N) serve the prerendered
// static page at <base>page/N/. Page 1 or no param falls through to the static index untouched.
export async function paged(context, base) {
  const url = new URL(context.request.url)
  const raw = url.searchParams.get('page')
  if (raw === null) return context.next()
  if (!/^\d{1,4}$/.test(raw)) return notFound(context)
  const n = Number(raw)
  if (n === 1) return Response.redirect(`${url.origin}${base}`, 301)
  const res = await context.env.ASSETS.fetch(new URL(`${base}page/${n}/`, url.origin))
  if (res.status !== 200) return notFound(context)
  return new Response(res.body, { status: 200, headers: res.headers })
}
async function notFound(context) {
  const r = await context.env.ASSETS.fetch(new URL('/404.html', context.request.url))
  return new Response(r.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
