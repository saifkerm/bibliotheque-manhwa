const TARGET = 'https://api.mangadex.org';

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const upstreamUrl = TARGET + url.pathname + url.search;

    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'bibliotheque-manhwa-proxy (+https://github.com/saifkerm/bibliotheque-manhwa)',
      },
    });

    const response = new Response(upstreamResponse.body, upstreamResponse);
    for (const [key, value] of Object.entries(corsHeaders())) {
      response.headers.set(key, value);
    }
    return response;
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}
