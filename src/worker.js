import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // Serve static assets from KV
    return await getAssetFromKV(event, {
      mapRequestToAsset: req => {
        // Handle SPA routing - serve index.html for all routes
        const url = new URL(req.url)
        if (!url.pathname.includes('.') && url.pathname !== '/') {
          return new Request(`${url.origin}/index.html`, req)
        }
        return req
      }
    })
  } catch (e) {
    // If asset not found, serve index.html for SPA routing
    try {
      return await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
      })
    } catch (e) {
      return new Response('Not found', { status: 404 })
    }
  }
}