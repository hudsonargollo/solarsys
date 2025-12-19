// Simple Cloudflare Worker to serve your React app
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve your React app for all routes
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SolarSys - Simulador Solar</title>
    <meta name="description" content="Simule sua instalação de energia solar e receba uma proposta personalizada" />
  </head>
  <body>
    <div id="root">
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h1>🌞 SolarSys</h1>
          <p>Carregando simulador solar...</p>
          <p style="color: #666; font-size: 14px;">Sua plataforma de simulação de energia solar está sendo carregada.</p>
        </div>
      </div>
    </div>
    <script>
      // Redirect to your actual deployed app
      window.location.href = 'https://solarsys.pages.dev';
    </script>
  </body>
</html>`

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}