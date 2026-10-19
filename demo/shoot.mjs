/**
 * Takes the README screenshots from the demo page: `npm run screenshots`.
 * Needs a local Chrome or Chromium; set CHROME to its path if it is not in the usual place.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml" };

const CHROME = process.env.CHROME || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].find(existsSync);
if (!CHROME) throw new Error("No Chrome found: set CHROME=/path/to/chrome");

/** The demo imports the card and @mdi/js as ES modules, which file:// URLs do not allow. */
export function serve(port = 0) {
  const server = createServer(async (req, res) => {
    const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
    if (!path.startsWith(ROOT)) return res.writeHead(403).end();
    const file = path.endsWith("/") ? join(path, "index.html") : path;
    let body;
    try {
      body = await readFile(file);
    } catch {
      return res.writeHead(404).end();
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  });
  return new Promise((ok) => server.listen(port, "127.0.0.1", () => ok(server)));
}

const SHOTS = [
  { file: "screenshot.jpg", query: "theme=dark&width=1040", viewport: { width: 1040, height: 640 } },
  { file: "mobile.jpg", query: "theme=dark&width=400&cols=1", viewport: { width: 390, height: 1100, isMobile: true, hasTouch: true }, scale: 2 },
  { file: "styles.jpg", query: "theme=light&width=1040&cols=3&scene=styles", viewport: { width: 1040, height: 260 } },
  { file: "compact.jpg", query: "theme=light&width=520&cols=1&scene=compact", viewport: { width: 520, height: 300 } },
  { file: "italian.jpg", query: "theme=light&width=1040&lang=it", viewport: { width: 1040, height: 640 } }
];

const run = async () => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}/demo/`;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
  try {
    for (const s of SHOTS) {
      const page = await browser.newPage();
      await page.setViewport({ deviceScaleFactor: s.scale || 1.5, ...s.viewport });
      page.on("pageerror", (e) => console.error(`[${s.file}]`, e.message));
      await page.goto(`${base}?${s.query}`, { waitUntil: "networkidle0" });
      await page.waitForFunction(() => window.__cards?.length > 0);
      // Let the transitions finish and the backgrounds decode.
      await new Promise((r) => setTimeout(r, 1200));
      const out = join(ROOT, "docs", s.file);
      await (await page.$("#stage")).screenshot({ path: out, type: "jpeg", quality: 88 });
      console.log("wrote", out);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await run();
