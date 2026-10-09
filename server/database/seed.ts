// One-off content import: creates the admin account and loads the content that used to be
// hard-coded in the old Vue components. Safe to re-run; tables that already have rows are skipped.
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { passwordSchema, type SiteSettings } from "../../shared/utils/schemas";
import { storeImage } from "../utils/image";
import { hashSecret } from "../utils/password";
import * as schema from "./schema";

const url = process.env.DATABASE_MIGRATE_URL;
if (!url) throw new Error("DATABASE_MIGRATE_URL is not set");
const pool = mysql.createPool({ uri: url, charset: "utf8mb4" });
const db = drizzle(pool, { schema, mode: "default" });

const isEmpty = async (table: MySqlTable) => (await db.select({ total: count() }).from(table))[0]!.total === 0;

async function importImage(file: string, alt: string) {
  const data = await readFile(fileURLToPath(new URL(`./seed-assets/${file}`, import.meta.url)));
  const stored = await storeImage(data);
  const [result] = await db.insert(schema.media).values({ ...stored, originalName: file, alt });
  return result.insertId;
}

async function seedAdmin() {
  if (!(await isEmpty(schema.users))) return console.log("users: skipped (already present)");
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = passwordSchema.safeParse(process.env.ADMIN_PASSWORD);
  if (!email || !password.success) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in .env");
  await db.insert(schema.users).values({ email, passwordHash: await hashSecret(password.data) });
  console.log(`users: created admin ${email}`);
}

async function seedContent() {
  if (!(await isEmpty(schema.settings))) return console.log("content: skipped (already present)");

  const profile = await importImage("profile.png", "Behram Khattak");
  const logos = {
    innovatix: await importImage("innovatix-logo.png", "Innovatix System Services logo"),
    cn: await importImage("CN-logo.png", "Creative Networks logo"),
    ssc: await importImage("ssc-logo.png", "Safe Solutions Consultants logo"),
    ips: await importImage("ips-logo.webp", "iPlexSoft logo"),
  };

  const settings: SiteSettings = {
    site: {
      name: "Behram Khattak",
      role: "Full-Stack Web & AI Engineer",
      description:
        "Websites, custom web and mobile apps, and AI-powered products, built and deployed end to end by a full-stack engineer based in Doha, Qatar.",
    },
    contact: {
      email: "behramkttk9@gmail.com",
      phone: "+974 6691 7419",
      whatsapp: "97466917419",
      location: "Doha, Qatar",
      availability: "Open to freelance projects and full-time roles",
    },
    socials: {
      github: "https://github.com/Behram-Khattak",
      linkedin: "https://www.linkedin.com/in/behramkttk",
      youtube: "https://www.youtube.com/@codewithbehram",
      x: "https://twitter.com/behramkttk",
    },
    hero: {
      headline: "Every Business Needs a Software",
      subhead: "From websites and custom web and mobile apps to AI-powered tools, I design, build and maintain software that helps your business run and grow.",
    },
    about: {
      heading: "About Me",
      body: [
        "I'm Behram Khattak, a Web Software Engineer passionate about building large-scale web apps and optimizing Linux infrastructure for high-performance cloud computing.",
        "I started with PHP and JavaScript in 2019, moved on to Laravel, Vue and React in 2021, and have run my work on Linux since then. Along the way I have built content management systems, custom e-commerce platforms, chat applications, LMS, CRM and ERP systems.",
        "Converting caffeine into scalable code and stable servers.",
      ].join("\n\n"),
      profileMediaId: profile,
    },
  };
  await db.insert(schema.settings).values(Object.entries(settings).map(([key, value]) => ({ key, value })));

  await db.insert(schema.services).values([
    {
      slug: "website-development",
      title: "Website Development",
      tagline: "Fast, search-friendly websites that turn visitors into customers.",
      description:
        "Marketing sites, company websites and content platforms, designed to load quickly, rank well and be easy for your team to update.",
      icon: "lucide:globe",
      deliverables: ["Responsive design", "CMS you can edit yourself", "SEO and performance tuning", "Hosting and deployment"],
      sortOrder: 1,
    },
    {
      slug: "custom-web-apps",
      title: "Custom Web Applications",
      tagline: "CRMs, ERPs, dashboards and SaaS products built around how you work.",
      description:
        "Business software shaped to your process rather than the other way round: internal tools, client portals, e-commerce platforms and multi-tenant SaaS.",
      icon: "lucide:layout-dashboard",
      deliverables: ["Requirements and architecture", "Backend APIs and database design", "Admin dashboards", "Third-party integrations"],
      sortOrder: 2,
    },
    {
      slug: "mobile-apps",
      title: "Mobile Apps",
      tagline: "iOS and Android apps backed by the same solid API as your web product.",
      description:
        "Cross-platform mobile apps that share a backend with your web application, so your data and business logic live in one place.",
      icon: "lucide:smartphone",
      deliverables: ["Cross-platform iOS and Android", "Shared API with your web app", "Push notifications", "App store submission"],
      sortOrder: 3,
    },
    {
      slug: "ai-apps",
      title: "AI Apps & Integration",
      tagline: "Assistants, automation and AI features wired into your product.",
      description:
        "Put large language models to work inside your business: chat assistants over your own data, document processing, workflow automation and AI features inside existing apps.",
      icon: "lucide:bot",
      deliverables: ["AI chat assistants", "Search over your own documents", "Workflow automation", "AI features in existing apps"],
      sortOrder: 4,
    },
  ]);

  await db.insert(schema.experiences).values([
    {
      company: "Innovatix System Services",
      role: "Software Developer",
      timeline: "October 2025 - Ongoing",
      summary:
        "Developing and maintaining web applications, backend APIs, and client-based solutions using technologies such as Laravel, PHP, Next.js. My role involves bug fixing, feature development, system integration, database management, and collaborating with teams to deliver scalable and efficient software solutions for ongoing projects.",
      link: "https://innovatixsystems.com/",
      logoMediaId: logos.innovatix,
      sortOrder: 1,
    },
    {
      company: "Creative Networks",
      role: "Web Engineer | Contract",
      timeline: "March 2025 - September 2025",
      summary:
        "Managed client communications and project management tasks, also developed websites & web applications using Laravel and WordPress, ensuring optimal performance and user experience.",
      link: "https://www.creative-n.com/",
      logoMediaId: logos.cn,
      sortOrder: 2,
    },
    {
      company: "Safe Solutions Consultants",
      role: "Backend Engineer | Contract",
      timeline: "January 2024 - October 2024",
      summary:
        "Developed and maintained backend services using Laravel & PHP, enhancing application functionality and performance.",
      link: "https://safesolutionsconsultants.com/",
      logoMediaId: logos.ssc,
      sortOrder: 3,
    },
    {
      company: "iPlexSoft",
      role: "Full Stack Web Developer | Contract",
      timeline: "June 2023 - December 2023",
      summary:
        "Developed and deployed CRM and ERP systems using Laravel and Vue.js, improving business operations and client management.",
      link: "https://iplexsoft.com/",
      logoMediaId: logos.ips,
      sortOrder: 4,
    },
  ]);

  const skills: [name: string, icon: string, category: string][] = [
    ["Laravel", "simple-icons:laravel", "Backend"],
    ["PHP", "simple-icons:php", "Backend"],
    ["Livewire", "simple-icons:livewire", "Backend"],
    ["Filament", "simple-icons:filament", "Backend"],
    ["Vue.js", "simple-icons:vuedotjs", "Frontend"],
    ["React", "simple-icons:react", "Frontend"],
    ["Next.js", "simple-icons:nextdotjs", "Frontend"],
    ["TypeScript", "simple-icons:typescript", "Frontend"],
    ["MySQL", "simple-icons:mysql", "Data"],
    ["PostgreSQL", "simple-icons:postgresql", "Data"],
    ["Redis", "simple-icons:redis", "Data"],
    ["Docker", "simple-icons:docker", "Infrastructure"],
    ["Linux", "simple-icons:linux", "Infrastructure"],
    ["Ubuntu", "simple-icons:ubuntu", "Infrastructure"],
    ["Nginx", "simple-icons:nginx", "Infrastructure"],
  ];
  await db.insert(schema.skills).values(skills.map(([name, icon, category], i) => ({ name, icon, category, sortOrder: i + 1 })));

  await db.insert(schema.projects).values([
    {
      slug: "quotes-network",
      title: "Quotes Network",
      summary:
        "Join Us On Our Engaging Social Media Journey As We Curate And Share The Best Quotes Every Day. Connect With Us On Pinterest And Instagram To Enhance Your Personal Growth And Enrich Your Daily Life.",
      body: "",
      tech: ["Laravel", "Bootstrap", "JavaScript"],
      liveUrl: "https://quotes.network/",
      gallery: [],
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      slug: "cogni-4-health",
      title: "Cogni 4 Health",
      summary:
        "Cogni® is expanding Wellness for All, Always Providing virtual solutions to accelerate wellness results so that Wellness Programs and Mental Health Providers support more people without delay.",
      body: "",
      tech: ["Laravel", "Bootstrap", "JavaScript"],
      liveUrl: "https://cogni4health.com/",
      gallery: [],
      featured: true,
      published: true,
      sortOrder: 2,
    },
  ]);

  console.log("content: imported settings, services, experiences, skills and projects");
}

// Sample posts so the blog has something to show. Edit or delete them from the dashboard.
async function seedPosts() {
  if (!(await isEmpty(schema.posts))) return console.log("posts: skipped (already present)");
  const day = 24 * 60 * 60 * 1000;
  await db.insert(schema.posts).values([
    {
      slug: "adding-an-ai-assistant-to-an-existing-web-app",
      title: "Adding an AI assistant to an existing web app: where to start",
      excerpt: "You do not need to rebuild your product to add AI to it. Start with one narrow job, your own data, and a way to check the answers.",
      tags: ["AI", "Architecture"],
      published: true,
      publishedAt: new Date(Date.now() - 2 * day),
      body: [
        "Most requests for \"AI in our app\" turn out to be one of three things: answering questions from data the business already has, drafting text a person then edits, or sorting and tagging things that arrive in bulk. Picking which one you actually need is most of the design work.",
        "## Start with one narrow job",
        "A general-purpose chatbot is the hardest thing to get right and the easiest to demo. A feature that does one job is the opposite. Good first candidates:",
        "- Answering customer questions from your help articles\n- Summarising a long ticket or order history for staff\n- Turning a free-text request into a filled-in form",
        "## Give the model your data, not your database",
        "The model should only ever see what the current user is allowed to see. Fetch the relevant records in your own backend, with your existing permission checks, and pass those to the model as context.",
        "```php\n$orders = $user->orders()->unpaid()->latest()->limit(20)->get();\n\n$answer = $assistant->ask(\n    question: $request->input('question'),\n    context: $orders->toJson(),\n);\n```",
        "> If a user could not load a record through your normal screens, the assistant must not be able to read it either.",
        "## Decide how you will know it is wrong",
        "Before launch, write down twenty real questions and the answers you expect. Run them every time you change the prompt or the model. It is unglamorous, and it is the difference between a feature you can maintain and one you are afraid to touch.",
        "## What it costs to run",
        "Cost follows the amount of text you send, so the cheapest improvement is usually sending less: retrieve the five most relevant records instead of fifty, and cache answers to questions that repeat.",
      ].join("\n\n"),
    },
    {
      slug: "hardening-a-fresh-ubuntu-server",
      title: "A short checklist for hardening a fresh Ubuntu server",
      excerpt: "Six things worth doing in the first half hour on any new server, before the application goes anywhere near it.",
      tags: ["Linux", "Security"],
      published: true,
      publishedAt: new Date(Date.now() - 9 * day),
      body: [
        "A new server is scanned by bots within minutes of getting a public address. None of the steps below are advanced, and together they close most of the doors those bots try first.",
        "## 1. Log in with keys, not passwords",
        "Create a normal user, add your public key, then turn password logins and direct root logins off in `/etc/ssh/sshd_config`:",
        "```\nPermitRootLogin no\nPasswordAuthentication no\n```",
        "Open a second terminal and confirm you can still log in before you close the first one.",
        "## 2. Close every port you are not using",
        "```bash\nsudo ufw default deny incoming\nsudo ufw allow OpenSSH\nsudo ufw allow 'Nginx Full'\nsudo ufw enable\n```",
        "## 3. Let security updates install themselves",
        "```bash\nsudo apt install unattended-upgrades\nsudo dpkg-reconfigure --priority=low unattended-upgrades\n```",
        "## 4. Slow down repeated login attempts",
        "`fail2ban` watches the auth log and temporarily blocks addresses that keep failing. The default SSH jail is enough to start with.",
        "## 5. Keep the database off the internet",
        "MySQL and PostgreSQL should listen on `127.0.0.1` unless another server needs them, and the application should connect as a user that can only read and write rows, never change the schema.",
        "## 6. Back up, then restore once",
        "A backup you have never restored is a hope, not a backup. Restore it to a scratch machine once and write down how long it took.",
      ].join("\n\n"),
    },
    {
      slug: "how-this-site-keeps-its-admin-safe",
      title: "How this site keeps its admin dashboard safe",
      excerpt: "A walk through the layers between the public internet and the dashboard that runs this website.",
      tags: ["Security", "Nuxt"],
      published: true,
      publishedAt: new Date(Date.now() - 16 * day),
      body: [
        "This site is a Nuxt application with a MySQL database and a private dashboard for editing everything you see. A dashboard like that is the most attractive target on any small site, so it has several independent layers in front of it. If one fails, the others still hold.",
        "## The server decides, not the page",
        "Every admin request passes through one piece of server middleware that checks for a valid session. Individual endpoints cannot forget to check, because they never get the chance to run without it.",
        "## Sign-in",
        "- Passwords are hashed with scrypt, so a stolen database does not reveal them\n- Repeated failures from one address are locked out for fifteen minutes\n- Two-factor codes are supported, and the secret behind them is encrypted at rest\n- Changing the password signs out every other device",
        "## Requests that change things",
        "The session cookie cannot be read by scripts and is not sent on cross-site requests. On top of that, the server rejects any write that does not come from the site's own address.",
        "## Uploads",
        "Images are identified by their contents rather than their file name, re-encoded before they are stored, and saved under random names outside the public folder. SVG files are refused because they can carry scripts.",
        "## Content",
        "Posts like this one are written in Markdown and rendered with raw HTML switched off. A strict content security policy means that even if something slipped through, the browser would refuse to run it.",
        "## The database",
        "The running application connects as a user that can read and write rows and nothing else. Changing the structure of the database needs a different account that the web server never uses.",
      ].join("\n\n"),
    },
  ]);
  console.log("posts: added 3 sample posts");
}

await seedAdmin();
await seedContent();
await seedPosts();
await pool.end();
