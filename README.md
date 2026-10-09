# Behram Khattak — portfolio

Full-stack portfolio and services site with an admin dashboard.
Nuxt 4, MySQL (Drizzle ORM), Tailwind CSS 4.

## Requirements

- Node 22.22.3 or newer (`nvm use` picks up `.nvmrc`)
- MySQL 8 (locally: DBngin on `127.0.0.1:3306`)

## Setup

```bash
nvm use
npm install
cp .env.example .env          # then fill in the values
```

Create the database and a least-privilege runtime user (run once as a MySQL admin):

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'portfolio_app'@'localhost' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio.* TO 'portfolio_app'@'localhost';
```

Then create the tables and the first admin account:

```bash
npm run db:migrate
npm run db:seed               # uses ADMIN_EMAIL / ADMIN_PASSWORD from .env
```

## Running

```bash
npm run dev                   # http://localhost:3000, admin at /admin
npm run build && npm run preview
```

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Runtime connection. Use the least-privilege user. |
| `DATABASE_MIGRATE_URL` | Used only by `db:migrate` and `db:seed`; needs DDL rights. |
| `NUXT_SESSION_PASSWORD` | 32+ random characters. Seals session cookies and encrypts 2FA secrets. Changing it signs everyone out and invalidates enrolled 2FA. |
| `NUXT_PUBLIC_SITE_URL` | Public URL. When it starts with `https://`, cookies are marked `Secure` and `upgrade-insecure-requests` is sent. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin account, read by `db:seed` only. |
| `TRUST_PROXY` | Set to `true` only behind a reverse proxy that sets `X-Forwarded-For`, so rate limits and logs see real client IPs. |
| `UPLOAD_DIR` | Where uploads are stored. Defaults to `storage/uploads`. |

## Changing the schema

Edit `server/database/schema.ts`, then:

```bash
npm run db:generate
npm run db:migrate
```

## Layout

- `app/` — pages, layouts and components (public site and `/admin`)
- `server/api/` — public read endpoints; everything under `server/api/admin/` requires a session
- `server/middleware/` — origin check for writes, admin session guard
- `server/database/` — schema, migrations, seed
- `shared/utils/schemas.ts` — validation shared by forms and API
- `storage/uploads/` — uploaded images and résumé (not in git; back this up along with the database)

## Deploying

The app needs a Node server, MySQL and a persistent disk for `storage/uploads`, so static hosts such as GitHub Pages will not work.
Run it behind HTTPS, set `NUXT_PUBLIC_SITE_URL` to the `https://` address, and have the proxy pass the original `Host` header.
