---
name: run-portfolio
description: Launch, smoke-test and drive this Nuxt portfolio site in a real browser, with screenshots. Use this whenever asked to run, start, preview, screenshot or demo the site, to check that a change works in the actual app, or to verify anything under app/ or public/ end to end, even if the request only says "does it work?" or "show me". It encodes the Node version and the static-build checks that otherwise cost several failed attempts.
---

# Run and verify the portfolio site

The site is a Nuxt 4 app on Cloudflare Workers. Public pages are pre-rendered from a D1 database
and served as static assets; `/admin` and `/api/*` run in the Worker. Run `npm run db:migrate:local`
and `node scripts/seed.ts --local` once to fill the local database that `dev` mode uses. Running it means serving the pages and looking at what a visitor would see, not
just type-checking.

All commands run from the repository root. `SK=.claude/skills/run-portfolio/scripts`.

## 1. Start the server

```bash
$SK/site.sh start          # dev server (hot reload), the default
$SK/site.sh start static   # nuxt build, then wrangler dev over .output (needs D1_* in .env)
```

Use `static` before saying something is ready to deploy. It is what Cloudflare serves, and it is
the only mode that shows problems caused by there being no server at runtime.

The script handles the things that fail silently otherwise:

- **Node version.** Nuxt needs the version in `.nvmrc`, but the shell default is older and `nvm use`
  is not available in non-interactive shells. The script puts the right nvm Node on `PATH`. If you
  run `npm`/`npx` yourself, prefix the same way:
  `export PATH=$HOME/.nvm/versions/node/v$(cat .nvmrc)/bin:$PATH`
- **Port.** If something already listens on 3000 it reports that and reuses it instead of starting
  a second server. Stop it first when switching between dev and static.

It waits until `/` returns 200, then prints the log path. `$SK/site.sh status` and
`$SK/site.sh stop` do what they say.

## 2. Smoke-test

```bash
$SK/site.sh smoke
```

Checks every page, one page per project from `/api/projects`, the static files, the dashboard shell, and that
unknown routes return 404.

## 3. Drive it in a browser

```bash
$SK/site.sh drive                       # all pages, screenshots to a temp dir
$SK/site.sh drive --out /some/dir       # choose where screenshots go
$SK/site.sh drive --pages /about,/projects/quotes-network   # only these pages
```

This starts headless Chrome, loads each page directly, then follows the header links without
reloading (client-side navigation). It takes a screenshot per page and reports each page's heading
plus any console errors, uncaught exceptions, failed or 4xx/5xx requests, and icons that did not
render. It exits non-zero if anything went wrong.

Go through `site.sh drive` rather than calling `node drive.mjs` directly: the driver needs the
project's Node version, and the shell's default Node is too old for it.

**Look at the screenshots** with the Read tool. A page can return 200 and still be visibly broken,
and that is the whole reason to drive it.

For a change the script does not cover, extend the visit with a few lines in `drive.mjs` using its
`type`, `click` and `evaluate` helpers.

## 4. Stop

```bash
$SK/site.sh stop
```

Leave the server running only if the user asked to see the site themselves; tell them the URL and
how to stop it.

## Things that will trip you up

- **Never run `nuxt generate` or `nuxt build` while the dev server is running.** They rewrite the
  shared `.nuxt` folder underneath it, and every page then fails with `useSite is not defined`
  (auto-imports gone) and a 500. Stop the dev server first, or use `site.sh start static`, which
  refuses to start while the port is busy. To recover: `site.sh stop`, delete `.nuxt`, start again.
- **Icons must be in the bundle.** There is no icon server at runtime. `nuxt.config.ts` scans
  `app/**/*.{vue,ts}` for icon names, so an icon named anywhere else (or built from a string at
  runtime) will be blank after client-side navigation, though it looks fine on a direct page load.
  The driver's client-navigation pass exists to catch this; run it in `static` mode.
- **`text-base` is a colour here.** The palette has a `base` token, so the Tailwind class
  `text-base` paints text in the page background colour. Use `text-[1rem]` for the font size.
- **New content needs a rebuild.** Public pages and `/sitemap.xml` are pre-rendered, so edits appear after **Publish changes**.
- **Mobile screenshots.** Headless Chrome's `--window-size` will not go narrower than 500px. For a
  true phone width, set device metrics over the DevTools protocol instead.
- **The driver uses fixed waits.** Right after a large change the dev server may still be
  recompiling and a page can report "no heading". Run it again before treating that as a bug.
- **Nothing here deploys.** The site goes live only when `main` is pushed; never push or merge as
  part of running the site.
