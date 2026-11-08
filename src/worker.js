// Handles /api/* only; everything else is served as static assets.
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid request" }, 400); }

      if (body.website) return json({ ok: true }); // honeypot: bots fill this in

      const name = clean(body.name, 100);
      const email = clean(body.email, 200).toLowerCase();
      const attending = body.attending === "no" ? "no" : "yes";
      const guests = Math.min(Math.max(parseInt(body.guests, 10) || 1, 1), 6);
      const note = clean(body.note, 500);

      if (!name) return json({ error: "Please enter your name." }, 400);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Please enter a valid email." }, 400);

      // Keyed by email so re-submitting updates the earlier RSVP.
      await env.RSVPS.put(
        `rsvp:${email}`,
        JSON.stringify({ name, email, attending, guests: attending === "yes" ? guests : 0, note, at: new Date().toISOString() })
      );
      return json({ ok: true });
    }

    // Host-only guest list: GET /api/rsvps with header "Authorization: Bearer <ADMIN_TOKEN>"
    if (url.pathname === "/api/rsvps" && request.method === "GET") {
      if (!env.ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: "Unauthorized" }, 401);
      }
      const { keys } = await env.RSVPS.list({ prefix: "rsvp:" });
      const rsvps = (await Promise.all(keys.map((k) => env.RSVPS.get(k.name, "json")))).filter(Boolean);
      const headcount = rsvps.reduce((n, r) => n + (r.guests || 0), 0);
      return json({ headcount, rsvps });
    }

    return json({ error: "Not found" }, 404);
  },
};
