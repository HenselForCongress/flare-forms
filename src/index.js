export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://henselforcongress.com',
      /\\.henselforcongress\\.com$/
    ];

    const origin = request.headers.get('Origin');

    if (!isAllowedOrigin(origin, allowedOrigins)) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      const contentType = request.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return new Response('Unsupported Media Type', { status: 415 });
      }

      const data = await request.json();

      if (!data.email) {
        return new Response('Email is required', { status: 400 });
      }

      const { first = '', last = '', email, zip = '' } = data;
      const source_ip = request.headers.get('CF-Connecting-IP');
      const source_url = request.headers.get('Referer');
      const country = request.cf ? request.cf.country || 'N/A' : 'N/A';
      const region = request.cf ? request.cf.region || 'N/A' : 'N/A';
      const city = request.cf ? request.cf.city || 'N/A' : 'N/A';
      const timezone = request.cf ? request.cf.timezone || 'N/A' : 'N/A';

      const db = env.cloudflareD1;

      // Insert signup into D1
      const dbResult = await db.prepare(`
        INSERT INTO signups (first_name, last_name, email_address, zip_code, source_ip, source_url, country, region, city, timezone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(first, last, email, zip, source_ip, source_url, country, region, city, timezone).run();

      const listmonkData = {
          email: email,
          name: `${first} ${last}`,
          status: 'enabled',
          lists: [6], // List ID for the subscription
          attribs: {
            // Add future fields here
            source_ip: source_ip,
            source_url: source_url,
            zip: zip,
            city: city,
            region: region,
            country: country,
            timezone: timezone
          }
        };

      const listmonkResponse = fetch(`${env.ESP_URL}/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${env.CLOUDFLARE_ACCESS_CLIENT_ID}:${env.CLOUDFLARE_ACCESS_CLIENT_SECRET}`)
        },
        body: JSON.stringify(listmonkData)
      });

      // Wait for both requests to complete
      await Promise.allSettled([dbResult, listmonkResponse]);

      return new Response('Signup successful', {
        headers: { 'Access-Control-Allow-Origin': origin },
      });
    } catch (err) {
      console.error('Error occurred:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

function isAllowedOrigin(origin, allowedOrigins) {
  return allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }
    return false;
  });
}
