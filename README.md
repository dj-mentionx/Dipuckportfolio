# dipuckjones.com — UNPROMPTED

A cinematic field of unasked questions. Visitors ask. Four models answer as four cameras. Then they ask about themselves and leave with a still.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Live

Vercel project + `dipuckjones.com`. Cached model pulls stay on `/api/refresh-mentions`. The opening film uses authored scenes in `lib/scenes.ts` until live keys replace them.

## Env

See `.env.example`. `SUPABASE_*` and model keys are optional for the film to run.
