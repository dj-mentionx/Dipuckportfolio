# dipuckjones.com

Case-file site for [dipuckjones.com](https://dipuckjones.com). Visitors drag to declassify cached answers from GPT, Gemini, Claude, and Perplexity, then open a shareable AI visibility card for their own name.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · GSAP · Supabase · Vercel Cron · `next/og`

The page reads **cached** mentions only. Live model calls happen on the daily refresh route and, once per visitor per day (capped), on “Open your own file.”

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without API keys or Supabase the site runs on the hand-written seed file in `lib/seed.ts` and a deterministic demo scan.

## Environment

| Variable | Where |
|---|---|
| `OPENAI_API_KEY` | Refresh + live scan |
| `GOOGLE_AI_API_KEY` | Refresh |
| `ANTHROPIC_API_KEY` | Refresh |
| `PERPLEXITY_API_KEY` | Refresh |
| `SUPABASE_URL` | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to the client |
| `CRON_SECRET` | Vercel Cron bearer token |
| `NEXT_PUBLIC_SITE_URL` | Canonical / OG |

## Supabase

Run `supabase/schema.sql` in the project SQL editor. Then call the refresh route once to replace the seed:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://dipuckjones.com/api/refresh-mentions
```

Vercel Cron hits the same path daily at 06:00 UTC (`vercel.json`).

## Deploy

Host on Vercel. Set the env vars, apply the schema, trigger one refresh, point the domain to `dipuckjones.com`.
