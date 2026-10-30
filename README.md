# Portfolio

Portfolio site built with Nuxt 4 and Tailwind CSS 4, running on Cloudflare Workers at
[behramkttk.dev](https://behramkttk.dev). Content is managed from a dashboard at `/admin`.

## How it works

- **Public pages** are pre-rendered from a D1 database and served as static assets.
- **`/admin`** is a client-only dashboard. Sign-in is through GitHub, limited to one account, and the Worker checks a signed session cookie on every `/api/admin` request.
- **Images and the résumé** live in R2 and are served from `media.behramkttk.dev`.
- **Publish changes** in the dashboard fires a Workers Builds deploy hook. Edits save instantly but reach the public site after the rebuild.

## Local development

Requires the Node version in `.nvmrc`.

```bash
npm install
cp .env.example .env
npm run db:migrate:local
node scripts/seed.ts --local
npm run dev
```

In dev the dashboard skips sign-in, and uploaded images are stored locally, so they won't load from the media domain.

## Database changes

Edit `server/database/schema.ts`, then:

```bash
npm run db:generate
npm run db:migrate:local
npm run db:migrate:remote
```

## Deploying

Pushing to the production branch builds and deploys through Workers Builds.

Build variables: `NODE_VERSION`, `D1_ACCOUNT_ID`, `D1_DATABASE_ID`, `D1_API_TOKEN` (read-only) and `NUXT_PUBLIC_TURNSTILE_SITE_KEY`.

Worker secrets: `NUXT_TURNSTILE_SECRET_KEY`, `NUXT_DEPLOY_HOOK_URL`, `NUXT_GITHUB_CLIENT_ID`, `NUXT_GITHUB_CLIENT_SECRET` and `NUXT_SESSION_SECRET`.

## Project layout

- `app/` — pages, components and the dashboard UI
- `server/api/` — public read routes, the contact form and `/api/admin`
- `server/database/` — D1 schema and migrations
- `shared/utils/` — validation schemas and the markdown renderer
- `scripts/` — the seed script and the original content it loads
