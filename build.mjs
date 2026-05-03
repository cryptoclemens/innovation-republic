// build.mjs — Innovation Republic Production-Build
// Bündelt JSX → dist/bundle.js, kopiert Assets, schreibt dist/index.html, robots.txt, sitemap.xml.

import * as esbuild from "esbuild";
import { mkdir, copyFile, readdir, rm, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import http from "node:http";

const args = new Set(process.argv.slice(2));
const watch = args.has("--watch");
const serve = args.has("--serve");

const DIST = "dist";
const SITE_URL = process.env.SITE_URL ?? "https://innovation-republic.de";

if (existsSync(DIST)) await rm(DIST, { recursive: true });
await mkdir(DIST, { recursive: true });
await mkdir(`${DIST}/assets`, { recursive: true });
await mkdir(`${DIST}/directionA`, { recursive: true });

// Production-Bundle: nur Direction A, kein Design-Canvas, kein Tweaks-Panel.
const ENTRY_FILES = [
  "directionA/shared.jsx",
  "directionA/check.jsx",
  "directionA/legal.jsx",
  "directionA/home.jsx",
  "directionA/subpages.jsx",
];

const VIRTUAL_ENTRY = "__virtual_entry__.jsx";
const virtualContent = ENTRY_FILES.map(f => `import "./${f}";`).join("\n") +
  `\nimport "./_app.jsx";\n`;
await writeFile(VIRTUAL_ENTRY, virtualContent);

const buildOptions = {
  entryPoints: [VIRTUAL_ENTRY],
  bundle: true,
  outdir: DIST,
  entryNames: watch ? "bundle" : "bundle.[hash]",
  format: "iife",
  loader: { ".jsx": "jsx" },
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  target: ["es2020"],
  external: [],
  metafile: true,
  define: {
    "process.env.NODE_ENV": watch ? '"development"' : '"production"',
  },
  banner: { js: "/* Innovation Republic — bundled */" },
};

let bundleFile = "bundle.js";

async function build() {
  const result = await esbuild.build(buildOptions);
  const outFiles = Object.keys(result.metafile.outputs);
  const jsOut = outFiles.find(f => f.endsWith(".js"));
  if (jsOut) bundleFile = path.basename(jsOut);
  await copyStaticFiles();
  await generateIndexHtml();
  await generateSeoFiles();
  console.log(`✓ Build done → ${DIST}/ (bundle: ${bundleFile})`);
}

async function copyStaticFiles() {
  await copyFile("directionA/style.css", `${DIST}/directionA/style.css`);
  await copyFile("directionA/style.responsive.css", `${DIST}/directionA/style.responsive.css`);
  await copyFile("directionA/check.css", `${DIST}/directionA/check.css`);
  if (existsSync("shared/tokens.css")) {
    await mkdir(`${DIST}/shared`, { recursive: true });
    await copyFile("shared/tokens.css", `${DIST}/shared/tokens.css`);
  }
  for (const f of await readdir("assets")) {
    await copyFile(`assets/${f}`, `${DIST}/assets/${f}`);
  }

  await writeFile(`${DIST}/_headers`, [
    "/*",
    "  X-Frame-Options: SAMEORIGIN",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
    "",
    "/assets/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/bundle.*.js",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/*.css",
    "  Cache-Control: public, max-age=86400",
    "",
  ].join("\n"));

  await writeFile(`${DIST}/_redirects`, [
    "# Hash-Routing — alle Pfade auf index.html",
    "/* /index.html 200",
    "",
  ].join("\n"));
}

async function generateSeoFiles() {
  const ROUTES = ["", "plattform", "kmu", "anbieter", "foerderung", "ueber", "impressum", "datenschutz"];
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${ROUTES.map(r => {
  const loc = r ? `${SITE_URL}/#/${r}` : `${SITE_URL}/`;
  const prio = r === "" ? "1.0" : (r === "impressum" ? "0.3" : "0.8");
  const cf = r === "" ? "weekly" : (r === "impressum" ? "yearly" : "monthly");
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${prio}</priority>
  </url>`;
}).join("\n")}
</urlset>
`;
  await writeFile(`${DIST}/sitemap.xml`, sitemap);

  await writeFile(`${DIST}/robots.txt`, [
    "# robots.txt — Innovation Republic",
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "Disallow: /uploads/",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n"));
}

async function generateIndexHtml() {
  const TODAY = new Date().toISOString().slice(0, 10);
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Innovation Republic — Innovation für KMU, kuratiert und gemeinnützig</title>
<meta name="description" content="Innovation Republic kuratiert Innovations-Vorhaben für kleine und mittlere Unternehmen — von Bedarfsklärung über Anbieter-Matching bis zur Sprint-Begleitung. Gemeinnützig, unabhängig, transparent." />
<link rel="canonical" href="${SITE_URL}/" />
<meta name="theme-color" content="#0E0E10" />
<meta name="robots" content="index, follow" />
<link rel="icon" href="/assets/logo-ir.png" type="image/png" />

<meta property="og:type" content="website" />
<meta property="og:locale" content="de_DE" />
<meta property="og:site_name" content="Innovation Republic" />
<meta property="og:title" content="Innovation Republic — Innovation für KMU, kuratiert und gemeinnützig" />
<meta property="og:description" content="Bedarfsklärung, Anbieter-Matching, Sprint-Begleitung. Gemeinnützig, unabhängig, transparent." />
<meta property="og:url" content="${SITE_URL}/" />
<meta property="og:image" content="${SITE_URL}/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Innovation Republic — Innovation für KMU" />
<meta name="twitter:description" content="Bedarfsklärung, Anbieter-Matching, Sprint-Begleitung. Gemeinnützig, unabhängig, transparent." />
<meta name="twitter:image" content="${SITE_URL}/assets/og-image.png" />

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Organization","name":"Innovation Republic","url":"${SITE_URL}/","logo":"${SITE_URL}/assets/logo-ir.png","image":"${SITE_URL}/assets/og-image.png","description":"Gemeinnützige Initiative, die Innovations-Vorhaben für kleine und mittlere Unternehmen kuratiert.","areaServed":["DE","AT","CH"],"email":"hello@innovationrepublic.de","address":{"@type":"PostalAddress","streetAddress":"Leopoldstraße 31","postalCode":"80802","addressLocality":"München","addressCountry":"DE"},"parentOrganization":{"@type":"Organization","name":"vencly GmbH","url":"https://www.vencly.com/"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Innovation Republic","url":"${SITE_URL}/","inLanguage":"de-DE","dateModified":"${TODAY}"}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Was ist Innovation Republic?","acceptedAnswer":{"@type":"Answer","text":"Innovation Republic ist eine gemeinnützige Initiative, die Innovations-Vorhaben für kleine und mittlere Unternehmen kuratiert."}},{"@type":"Question","name":"Für wen ist Innovation Republic gedacht?","acceptedAnswer":{"@type":"Answer","text":"Für kleine und mittlere Unternehmen im deutschsprachigen Raum, die Innovations- oder Digitalisierungsvorhaben umsetzen wollen."}},{"@type":"Question","name":"Was kostet Innovation Republic?","acceptedAnswer":{"@type":"Answer","text":"Bedarfsklärung und Matching sind für KMU kostenfrei. Sprint-Umsetzungen rechnen die Anbieter direkt mit dem KMU ab."}},{"@type":"Question","name":"Wie läuft ein Innovations-Sprint ab?","acceptedAnswer":{"@type":"Answer","text":"Bedarf klären (1–2 Wochen), Anbieter matchen (2–3 Wochen), Sprint umsetzen (4–12 Wochen) mit fester Begleitung."}},{"@type":"Question","name":"Welche Förderungen sind verfügbar?","acceptedAnswer":{"@type":"Answer","text":"Je nach Vorhaben: go-digital, Digital Jetzt oder regionale Innovationsgutscheine."}}]}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/directionA/style.css">
<link rel="stylesheet" href="/directionA/style.responsive.css">
<link rel="stylesheet" href="/directionA/check.css">
<style>
  html, body { margin: 0; padding: 0; background: #F6F5F1; }
  body { font-family: "Inter Tight", system-ui, sans-serif; }
  #app { min-height: 100vh; }
</style>
</head>
<body>
<div id="app"></div>
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="/${bundleFile}"></script>
<!-- Cloudflare Web Analytics: nach Aktivierung im CF-Dashboard das beacon-Snippet hier einsetzen -->
</body>
</html>
`;
  await writeFile(`${DIST}/index.html`, html);
}

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  bundleFile = "bundle.js";
  await copyStaticFiles();
  await generateIndexHtml();
  await generateSeoFiles();
  console.log("👀 Watch-Mode aktiv");

  if (serve) {
    const PORT = 8080;
    http.createServer(async (req, res) => {
      let p = req.url.split("?")[0];
      if (p === "/") p = "/index.html";
      const filePath = path.join(DIST, p);
      try {
        const data = await readFile(filePath);
        const ext = path.extname(p);
        const types = {
          ".html": "text/html", ".js": "application/javascript",
          ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml",
          ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json"
        };
        res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
        res.end(data);
      } catch {
        const idx = await readFile(`${DIST}/index.html`).catch(() => null);
        if (idx) { res.writeHead(200, { "Content-Type": "text/html" }); res.end(idx); }
        else { res.writeHead(404); res.end("Not found"); }
      }
    }).listen(PORT, () => console.log(`→ http://localhost:${PORT}`));
  }
} else {
  await build();
  await rm(VIRTUAL_ENTRY).catch(() => {});
}
