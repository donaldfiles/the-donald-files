// 301 the bare production pages.dev host to the canonical domain, keeping path + query.
// Preview/hash deploys (<hash>.the-donald-files.pages.dev, <branch>.the-donald-files.pages.dev) are untouched.
const PAGES_HOST = 'the-donald-files.pages.dev'
export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url)
  if (url.hostname === PAGES_HOST) {
    return new Response(null, { status: 301, headers: { Location: `https://thedonaldfiles.com${url.pathname}${url.search}`, 'Cache-Control': 'public, max-age=3600' } })
  }
  return next()
}
