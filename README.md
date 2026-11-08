# After-Diwali Party site

Static site + Cloudflare Worker (RSVPs stored in KV). 

## Deploy
```bash
npm install
npx wrangler login
# KV namespace id is already set in wrangler.jsonc
npx wrangler secret put ADMIN_TOKEN        # any long random string, for viewing the guest list
npm run deploy
```
Preview locally with `npm run dev` (uses a local KV simulation).

## View RSVPs
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://<your-site>.workers.dev/api/rsvps
```

## Last year's photos
Drop images in `public/gallery/` and list them in `public/gallery.json`. Resize to ~1600px wide first. The current files are placeholders.

## Edit details
Time, venue and dress code are in the `.details` section of `public/index.html`.
