// src/index.js
export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
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

    try {
      const db = cloudflareD1.getInstance();
      await db.prepare(`
        INSERT INTO signups (first_name, last_name, email_address, zip_code, source_ip, source_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(first, last, email, zip, source_ip, source_url).run();

      return new Response('Signup successful', {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    } catch (err) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
