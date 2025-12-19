/**
 * Cloudflare Function for proxying BrasilAPI CEP requests
 * This function provides CORS headers and error handling for CEP lookups
 */

interface Env {
  // Add any environment variables here if needed
}

interface BrasilAPIResponse {
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
}

export const onRequestGET: PagesFunction<Env> = async (context) => {
  const { params, request } = context;
  const cep = params.cep as string;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate CEP format
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8 || !/^\d{8}$/.test(cleanCep)) {
    return new Response(
      JSON.stringify({ error: 'CEP deve ter o formato 99999-999' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  try {
    // Proxy request to BrasilAPI
    const brasilApiUrl = `https://brasilapi.com.br/api/cep/v1/${cleanCep}`;
    const response = await fetch(brasilApiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SolarSys/1.0',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'CEP não encontrado' }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      throw new Error(`BrasilAPI returned ${response.status}`);
    }

    const data: BrasilAPIResponse = await response.json();

    // Return the data with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('CEP lookup error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erro na consulta do CEP' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};