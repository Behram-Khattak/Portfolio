#!/usr/bin/env node
// Drives the running site in headless Chrome over the DevTools protocol (no dependencies):
// visits pages, signs in to /admin through the real form, screenshots each page, and reports
// headings plus any console errors, exceptions or CSP violations. Read-only: creates no content.
//
// Run it through the wrapper so it gets the right Node version:
//   site.sh drive [--out DIR] [--base URL] [--no-admin] [--pages /a,/admin/b]
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (typeof WebSocket === "undefined") {
  console.error(`Node ${process.version} has no built-in WebSocket. Run this through "site.sh drive", which uses the Node version in .nvmrc.`);
  process.exit(2);
}

const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = option("--base", "http://localhost:3000").replace(/\/$/, "");
const outDir = option("--out", join(tmpdir(), "portfolio-run"));
const only = option("--pages", "")?.split(",").filter(Boolean);
const withAdmin = !args.includes("--no-admin");
const DEBUG_PORT = 9333;

const PUBLIC_PAGES = ["/", "/services", "/projects", "/blog", "/about", "/contact"];
const ADMIN_PAGES = ["/admin", "/admin/projects", "/admin/posts", "/admin/services", "/admin/media", "/admin/content", "/admin/experiences", "/admin/skills", "/admin/inquiries", "/admin/settings"];
const publicPages = only?.length ? only.filter((p) => !p.startsWith("/admin")) : PUBLIC_PAGES;
const adminPages = only?.length ? only.filter((p) => p.startsWith("/admin")) : withAdmin ? ADMIN_PAGES : [];

try {
  process.loadEnvFile(".env");
} catch {
  // no .env; admin login is skipped below
}
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const chromePath = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((path) => path && existsSync(path));
if (!chromePath) {
  console.error("Chrome not found. Set CHROME_BIN to a Chrome or Chromium binary.");
  process.exit(2);
}
try {
  await fetch(base, { signal: AbortSignal.timeout(10000) });
} catch {
  console.error(`Nothing is answering at ${base}. Start the server first (site.sh start).`);
  process.exit(2);
}

mkdirSync(outDir, { recursive: true });
// A fresh profile every run, so no session cookie carries over and the sign-in is really exercised
const profileDir = mkdtempSync(join(tmpdir(), "portfolio-chrome-"));
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profileDir}`, "--window-size=1440,1000", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let target;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250);
  try {
    target = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json()).find((t) => t.type === "page");
  } catch {
    // Chrome still starting
  }
}
if (!target) {
  chrome.kill();
  rmSync(profileDir, { recursive: true, force: true });
  console.error("Chrome did not start.");
  process.exit(2);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => (ws.onopen = resolve));
let nextId = 0;
let currentPage = "";
const pending = new Map();
const problems = [];
ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) {
    pending.get(data.id)(data.result ?? data.error);
    pending.delete(data.id);
  }
  const note = (text) => problems.push(`${currentPage}  ${text.slice(0, 300)}`);
  if (data.method === "Runtime.consoleAPICalled" && data.params.type === "error") note(`console.error: ${data.params.args.map((a) => a.value ?? a.description ?? "").join(" ")}`);
  if (data.method === "Runtime.exceptionThrown") note(`exception: ${data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text}`);
  if (data.method === "Log.entryAdded" && data.params.entry.level === "error") note(`${data.params.entry.text} ${data.params.entry.url ?? ""}`);
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    pending.set(++nextId, resolve);
    ws.send(JSON.stringify({ id: nextId, method, params }));
  });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.value;
for (const domain of ["Runtime", "Page", "Log"]) await send(`${domain}.enable`);

// Helpers for extending this script with real interactions
const go = async (path, waitMs = 2500) => {
  currentPage = path;
  await send("Page.navigate", { url: base + path });
  await sleep(waitMs);
};
const screenshot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const file = join(outDir, `${name}.png`);
  writeFileSync(file, Buffer.from(data, "base64"));
  return file;
};
// Sets a value the way typing would, so Vue's v-model sees it
const type = (selector, value) =>
  evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.focus();
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); return true; })()`);
const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)})?.click()`);
const fileName = (path) => (path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-"));

const results = [];
const visit = async (path) => {
  await go(path);
  const heading = await evaluate("document.querySelector('h1')?.innerText ?? ''");
  const landedOn = await evaluate("location.pathname");
  const file = await screenshot(fileName(path));
  results.push({ path, heading, landedOn, file });
  if (!heading) problems.push(`${path}  page has no heading (blank or failed render?)`);
  if (landedOn !== path) problems.push(`${path}  ended up on ${landedOn}`);
};

for (const path of publicPages) await visit(path);

if (adminPages.length) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    problems.push("/admin  ADMIN_EMAIL / ADMIN_PASSWORD not found in .env, admin pages skipped");
  } else {
    await go("/admin");
    const guarded = (await evaluate("location.pathname")) === "/admin/login";
    if (!guarded) problems.push("/admin  was reachable without signing in");
    await type("#email", ADMIN_EMAIL);
    await type("#password", ADMIN_PASSWORD);
    await click('button[type="submit"]');
    await sleep(3500);
    if ((await evaluate("location.pathname")) === "/admin/login") {
      const needsCode = await evaluate("Boolean(document.querySelector('#code'))");
      const message = await evaluate("document.querySelector('[role=alert]')?.innerText ?? ''");
      problems.push(`/admin/login  sign-in did not succeed: ${needsCode ? "two-factor authentication is on, so this script cannot sign in" : message || "no error shown"}`);
    } else {
      for (const path of adminPages) await visit(path);
      await evaluate("fetch('/api/auth/logout', { method: 'POST' }).then(() => true)");
    }
  }
}

ws.close();
chrome.kill();
await sleep(500);
rmSync(profileDir, { recursive: true, force: true });

for (const result of results) console.log(`${result.path.padEnd(22)} ${String(result.heading).replace(/\s+/g, " ").slice(0, 60).padEnd(62)} ${result.file}`);
const unique = [...new Set(problems)];
console.log(unique.length ? `\n${unique.length} problem(s):\n${unique.join("\n")}` : "\nNo console errors, exceptions or failed pages.");
console.log(`Screenshots: ${outDir}`);
process.exit(unique.length ? 1 : 0);
