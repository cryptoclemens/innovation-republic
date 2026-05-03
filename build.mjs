// Build-Skript für Innovation Republic
// Nutzt esbuild, um alle JSX-Files zu einem einzigen bundle.js zu kompilieren.
// Output: dist/  →  direkt deployable auf Cloudflare Pages.
//
// Verwendung:
//   npm run build         (Production-Build)
//   npm run dev           (Watch + lokaler Dev-Server auf :8080)

import * as esbuild from "esbuild";
import { mkdir, copyFile, readdir, rm, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import http from "node:http";

const args = new Set(process.argv.slice(2));
const watch = args.has("--watch");
const serve = args.has("--serve");

const DIST = "dist";

// ---- 1. Clean dist ----
if (existsSync(DIST)) await rm(DIST, { recursive: true });
await mkdir(DIST, { recursive: true });
await mkdir(`${DIST}/assets`, { recursive: true });
await mkdir(`${DIST}/directionA`, { recursive: true });

// ---- 2. JSX-Bundle ----
// Reihenfolge ist wichtig: shared.jsx vor home.jsx, etc.
const ENTRY_FILES = [
  "design-canvas.jsx",
  "tweaks-panel.jsx",
  "directionA/shared.jsx",
  "directionA/check.jsx",
  "directionA/home.jsx",
  "directionA/subpages.jsx",
];

// Wir wrappen alle Files in einen virtuellen Entry-Point — dadurch teilen sie sich
// einen Scope und globale Component-Definitionen funktionieren wie im Babel-Setup.
const VIRTUAL_ENTRY = "__virtual_entry__.jsx";
const virtualContent = ENTRY_FILES.map(f => `import "./${f}";`).join("\n") +
  `\nimport "./_app.jsx";\n`;

await writeFile(VIRTUAL_ENTRY, virtualContent);

// _app.jsx enthält den Mount-Code (vorher inline im index.html)
const appJsx = await readFile("_app.jsx.template", "utf8").catch(() => null);
if (!appJsx) {
  // Beim ersten Run das Template aus index.html extrahieren
  console.log("→ Erstelle _app.jsx.template aus index.html (einmalig)");
  await extractAppFromIndex();
}

const buildOptions = {
  entryPoints: [VIRTUAL_ENTRY],
  bundle: true,
  outfile: `${DIST}/bundle.js`,
  format: "iife",
  loader: { ".jsx": "jsx" },
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  target: ["es2020"],
  // React + ReactDOM bleiben als Globals (UMD-Builds via CDN) — wir bündeln sie nicht
  external: [],
  define: {
    "process.env.NODE_ENV": watch ? '"development"' : '"production"',
  },
  // Treat React/ReactDOM as globals provided by CDN script tags
  banner: { js: "/* Innovation Republic — bundled */" },
};

async function build() {
  await esbuild.build(buildOptions);
  await copyStaticFiles();
  await generateIndexHtml();
  console.log(`✓ Build done → ${DIST}/`);
}

async function copyStaticFiles() {
  // CSS
  await copyFile("directionA/style.css", `${DIST}/directionA/style.css`);
  await copyFile("directionA/check.css", `${DIST}/directionA/check.css`);
  if (existsSync("directionB/style.css")) {
    await mkdir(`${DIST}/directionB`, { recursive: true });
    await copyFile("directionB/style.css", `${DIST}/directionB/style.css`);
  }
  if (existsSync("shared/tokens.css")) {
    await mkdir(`${DIST}/shared`, { recursive: true });
    await copyFile("shared/tokens.css", `${DIST}/shared/tokens.css`);
  }

  // Assets
  for (const f of await readdir("assets")) {
    await copyFile(`assets/${f}`, `${DIST}/assets/${f}`);
  }

  // Cloudflare-spezifisch
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
    "/bundle.js",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/*.css",
    "  Cache-Control: public, max-age=86400",
    "",
  ].join("\n"));

  await writeFile(`${DIST}/_redirects`, [
    "# SPA-Fallback nicht nötig — wir haben aktuell nur eine Page.",
    "# Falls später Subpages: /* /index.html 200",
    "",
  ].join("\n"));
}

async function generateIndexHtml() {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Innovation Republic — Vom Bauchgefühl zum Ergebnis.</title>
<meta name="description" content="Gemeinnütziger Innovations-Kurator. Vom unscharfen Bedarf über kuratierte Anbieter bis zum dokumentierten 100-Werktage-Sprint. Best-in-Class pro Phase — statt Eigenbau und Tool-Wildwuchs.">
<link rel="icon" href="/assets/logo-ir.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/directionA/style.css">
<link rel="stylesheet" href="/directionA/check.css">
<style>
  html, body { margin: 0; padding: 0; background: #F6F5F1; }
  body { font-family: "Inter Tight", system-ui, sans-serif; }
  #app { min-height: 100vh; }
</style>
<!-- OG / Twitter -->
<meta property="og:title" content="Innovation Republic">
<meta property="og:description" content="Vom Bauchgefühl zum Ergebnis. Gemeinnützig, kuratiert.">
<meta property="og:type" content="website">
</head>
<body>
<div id="app"></div>
<!-- React via CDN (cached aggressively durch Cloudflare) -->
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="/bundle.js"></script>
</body>
</html>
`;
  await writeFile(`${DIST}/index.html`, html);
}

async function extractAppFromIndex() {
  // Extrahiert den App()-Block aus index.html → _app.jsx.template
  // (Damit wir ihn beim Bundling als normales File haben.)
  const idx = await readFile("index.html", "utf8");
  const m = idx.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("Konnte App-Code nicht aus index.html extrahieren");
  await writeFile("_app.jsx", m[1]);
  await writeFile("_app.jsx.template", "// auto-generated\n");
  console.log("→ _app.jsx geschrieben. Bitte in Production manuell pflegen.");
}

// ---- Run ----
if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  await copyStaticFiles();
  await generateIndexHtml();
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
          ".json": "application/json"
        };
        res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    }).listen(PORT, () => console.log(`→ http://localhost:${PORT}`));
  }
} else {
  await build();
  // Cleanup
  await rm(VIRTUAL_ENTRY).catch(() => {});
}
