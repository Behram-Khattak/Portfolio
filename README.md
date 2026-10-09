# Behram Khattak — portfolio

Static portfolio site built with Nuxt 4 and Tailwind CSS 4, deployed to GitHub Pages at
[behramkttk.dev](https://behramkttk.dev). There is no backend or database: every page is
pre-rendered to plain HTML at build time.

## Requirements

- Node 22.22.3 or newer (`nvm use` picks up `.nvmrc`)

## Running

```bash
nvm use
npm install
npm run dev          # http://localhost:3000 with hot reload
```

To see exactly what GitHub Pages will serve:

```bash
npm run generate     # writes the site to .output/public
npm run preview      # serves that folder
```

## Editing content

All content lives in `app/data/`. Edit the file, check it locally, then commit and push.

| File | What it holds |
|---|---|
| `site.ts` | Name, job title, contact details, social links, hero headline and text, About bio, résumé link |
| `services.ts` | The services, in display order |
| `projects.ts` | The projects, in display order. `featured: true` puts one on the homepage |
| `experience.ts` | Work history |
| `skills.ts` | Tech stack on the About page |

- **Images** go in `public/images/` and are referenced as `/images/<name>`.
- **Résumé**: replace the PDF in `public/` and update `resumeUrl` in `site.ts` if the file name changes.
- **Icons** are [Iconify](https://icon-sets.iconify.design) names from the `lucide` or `simple-icons` sets, e.g. `lucide:bot`.
- **A new project** also needs its URL added to `public/sitemap.xml`.
- **A new service** shows a large version of its icon as its illustration unless a scene is added for its slug in `app/components/ServiceGraphic.vue`.

## Deploying

Pushing to `main` runs `.github/workflows/static.yml`, which builds the site and publishes
`.output/public` to GitHub Pages. `public/CNAME` keeps the `behramkttk.dev` domain attached.

## Layout

- `app/pages/` — one file per page
- `app/components/` — header, footer, illustrations and other shared pieces
- `app/assets/css/main.css` — colours, type and shared styles
- `app/data/` — content
- `public/` — files served as-is (images, résumé, favicon, `robots.txt`, `sitemap.xml`, `CNAME`)

## Full-stack version

An earlier version with a MySQL database, admin dashboard, blog and contact form is preserved on
the `nuxt-fullstack` branch.
