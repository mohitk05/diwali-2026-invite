# After-Diwali Party site

Static site + Cloudflare Worker (RSVPs stored in KV). 

## Deploy
```bash
npm install
npx wrangler login
# KV namespace id is already set in wrangler.jsonc
npm run deploy
```
Preview locally with `npm run dev` (uses a local KV simulation).

## View RSVPs
RSVPs are stored in KV under `rsvp:<email>`. List them from your terminal:
```bash
npx wrangler kv key list --binding RSVPS --remote --prefix rsvp:
npx wrangler kv key get "rsvp:guest@example.com" --binding RSVPS --remote
```
Or browse them in the Cloudflare dashboard under Workers & Pages -> KV.

## Last year's photos
Drop images in `public/gallery/` and list them in `public/gallery.json`. Resize to ~1600px wide first. The current files are placeholders.

## Edit details
Time, venue and dress code are in the `.details` section of `public/index.html`.
