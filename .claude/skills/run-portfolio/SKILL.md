---
name: run-portfolio
description: Launch, smoke-test and drive this Nuxt + MySQL portfolio site (public pages and the /admin dashboard) in a real browser, with screenshots. Use this whenever asked to run, start, preview, screenshot or demo the site, to check that a change works in the actual app, or to verify anything under app/ or server/ end to end, even if the request only says "does it work?" or "show me". It encodes the Node version, startup checks and request quirks that otherwise cost several failed attempts.
---

# Run and verify the portfolio site

The app is a Nuxt 4 server backed by MySQL. Running it means starting that server and looking at
what a visitor or the admin would see, not just type-checking.

All commands run from the repository root. `SK=.claude/skills/run-portfolio/scripts`.

## 1. Start the server

```bash
$SK/site.sh start        # dev server (hot reload), the default
$SK/site.sh start prod   # production build + node server; slower, use to verify prod-only behaviour
```

The script handles the things that fail silently otherwise:

- **Node version.** Nuxt needs the version in `.nvmrc`, but the shell default is older and `nvm use`
  is not available in non-interactive shells. The script puts the right nvm Node on `PATH`. If you
  run `npm`/`npx` yourself, prefix the same way:
  `export PATH=$HOME/.nvm/versions/node/v$(cat .nvmrc)/bin:$PATH`
- **Preconditions.** It checks `.env` exists and MySQL answers on 127.0.0.1:3306 (DBngin). If MySQL
  is down, ask the user to start it in DBngin rather than trying to start one yourself.
- **Port.** If something already listens on 3000 it reports that and reuses it instead of starting
  a second server.

It waits until `/` returns 200, then prints the log path. `$SK/site.sh status` and
`$SK/site.sh stop` do what they say.

If the database is empty (fresh clone): `npm run db:migrate && npm run db:seed` with the Node
prefix above, then start.

## 2. Smoke-test

```bash
$SK/site.sh smoke
```

Hits every public route, the admin login page, `/api/site`, and confirms `/api/admin/dashboard`
returns 401 without a session. Any other status is a real failure; read the server log it points to.

## 3. Drive it in a browser

```bash
$SK/site.sh drive                       # public pages + admin, screenshots to a temp dir
$SK/site.sh drive --out /some/dir       # choose where screenshots go
$SK/site.sh drive --no-admin            # public pages only
$SK/site.sh drive --pages /about,/admin/settings   # only these pages
```

This starts headless Chrome, visits each page, signs in to `/admin` through the real login form
(reading `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`, never printing them), takes a screenshot per
page, and reports each page's heading plus any console errors, uncaught exceptions or CSP
violations. It exits non-zero if anything went wrong.

Go through `site.sh drive` rather than calling `node drive.mjs` directly: the driver needs the
project's Node version, and the shell's default Node is too old for it.

It is read-only: it creates no content. **Look at the screenshots** with the Read tool. A page can
return 200 and still be visibly broken, and that is the whole reason to drive it.

For a change the script does not cover (submitting a form, creating a project), extend the visit
with a few lines in `drive.mjs` using its `type`, `click` and `evaluate` helpers, or use `curl`
with the notes below.

## 4. Stop

```bash
$SK/site.sh stop
```

Leave the server running only if the user asked to see the site themselves; tell them the URL and
how to stop it.

## Things that will trip you up

- **Writes need an `Origin` header.** Every non-GET `/api/` request without a same-site `Origin`
  gets 403 by design (CSRF protection). With curl: `-H "Origin: http://localhost:3000"`.
- **zsh does not split unquoted variables.** `J="-b jar -H Origin:..."; curl $J` sends one
  argument and fails confusingly. Use an array: `J=(-b jar -H "Origin: http://localhost:3000")`.
- **Login is limited twice.** The route allows 10 requests per 5 minutes per IP (in memory, resets
  when the server restarts), and 10 failed passwords from one IP lock it out for 15 minutes
  (stored in `login_attempts`). If your own testing triggers the lockout, restart the server and
  delete only the rows you caused.
- **Clean up after yourself.** If you create posts, projects, inquiries or uploads to test
  something, delete them afterwards so the user's real site content is unchanged. Never change the
  admin password or leave 2FA enabled.
- **Mobile screenshots.** Headless Chrome will not go narrower than 500px; a 390px-wide capture is
  a cropped 500px layout, not an overflow bug.
- **Dev vs prod differences.** In dev, client IPs log as `unknown` and error responses include
  stack traces; neither happens in a production build. Check prod before reporting those as bugs.
- **Admin pages are client-rendered.** `curl /admin/...` returns an empty shell with status 200
  whether or not you are signed in. Use `site.sh drive` to see them; use `/api/admin/*` to test access
  control.
