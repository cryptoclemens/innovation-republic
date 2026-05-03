# TASKS — Innovation Republic Web

> Stand: 2026-05-03 | Letzte Session: SEO-Pass v2 — FAQ + Copy (Claude Design + Claude Code)

---

## Erledigt

### Deploy & Infrastruktur
- [x] Cloudflare-Deploy-Fehler behoben (`npx wrangler deploy` → kein Deploy-Command nötig)
- [x] `wrangler.toml` angelegt (`pages_build_output_dir = "dist"`)
- [x] `deploy`-Script korrigiert (`wrangler pages deploy dist`)
- [x] GitHub Actions `deploy.yml` entfernt (Cloudflare Pages baut direkt via Git-Push)
- [x] Cloudflare Pages Env-Variablen gesetzt via API:
  - Production: `SITE_URL=https://innovation-republic.de`
  - Preview: `SITE_URL=https://innovation-republic.eu`
- [x] `SITE_URL` in `build.mjs` via `process.env.SITE_URL` (Fallback `.de`)
- [x] `npm run build:staging` / `build:prod` Scripts in `package.json`
- [x] Cloudflare MCP-Server konfiguriert (`.claude/settings.json`, Token hinterlegt)
- [x] `.claude/settings.json` in `.gitignore` (Token bleibt lokal)

### SEO-Pass v1
- [x] `index.html` (Dev-Entry): vollständiger SEO-Head (title, description, canonical, theme-color, robots)
- [x] Open Graph + Twitter Card Tags
- [x] JSON-LD: Organization, WebSite, FAQPage (5 Fragen)
- [x] `assets/og-image.png` (1200×630) angelegt
- [x] `robots.txt` mit KI-Bot-Erlaubnis (GPTBot, ClaudeBot, Google-Extended, PerplexityBot)
- [x] `sitemap.xml` mit allen Hash-Routen inkl. `#/datenschutz`
- [x] `SEO-CHECKLIST.md` aus Claude Design-Session übernommen
- [x] `build.mjs` generiert `robots.txt` + `sitemap.xml` dynamisch mit `SITE_URL`
- [x] `BreadcrumbList` JSON-LD dynamisch per Route in `applyHeadForRoute()` (`_app.jsx`)
- [x] `Service`-Schema für Plattform, KMU, Anbieter, Förderung — dynamisch per Route
- [x] `dateModified` in WebSite JSON-LD (Freshness-Signal für Google)
- [x] `<meta robots="index, nofollow">` für Impressum + Datenschutz via `applyHeadForRoute()`

### SEO-Pass v2 — FAQ + Copy (Claude Design)
- [x] `AFAQBlock`-Komponente in `directionA/subpages.jsx` (wiederverwendbar, Microdata FAQPage/Question/Answer)
- [x] Home: `AHomeFAQ` mit 6 Karten (1:1 Spiegel der FAQPage-JSON-LD aus `index.html`)
- [x] Microdata `schema.org/FAQPage` zusätzlich zur JSON-LD (doppelte Absicherung für Google AI Overviews)
- [x] Subpages: 4 seitenspezifische FAQ-Karten pro Persona (Plattform, KMU, Anbieter, Förderung, Über uns)
- [x] H2-Überschriften auf Landing als vollständige Fragen formuliert
- [x] `directionA/home.jsx` — Copy-Pass nach GEO-Prinzipien (H2-Pass + FAQ-Sektion)
- [x] `directionA/subpages.jsx` — Plattform, KMU, Anbieter, Förderung, Über uns (jeweils H2-als-Frage + 4 FAQ-Karten)
- [x] Hash-Routing-Fixes in `subpages.jsx` (Breadcrumb `#/`, mailto-Links für Spendentiers + Tool-Vorschlag, Form-Submit auf mailto)
- [x] Domain-Reste fixiert: `www.innovationrepublic.de` → `www.innovation-republic.eu` (Über-uns-Kontaktblock)

### App-Architektur
- [x] Hash-Router in `_app.jsx` (#/, #/plattform, #/kmu, #/anbieter, #/foerderung, #/ueber, #/impressum, #/datenschutz)
- [x] `ProductionApp` / `DevApp` getrennt
- [x] `isProd`-Bug behoben (`process.env.NODE_ENV === 'production'` → esbuild ersetzt zur Buildzeit)
- [x] Content-Hash im Bundle-Dateinamen (`bundle.[hash].js`) → Browser-Cache-Invalidierung
- [x] `directionA/legal.jsx` — Impressum + Datenschutz als Hash-Routen
- [x] `directionA/shared.jsx` — Nav + Footer: `href="#"` → echte Hash-Routes
- [x] `build.mjs` ENTRY_FILES: nur Direction A, kein Canvas, kein Tweaks-Panel

---

## Claude Code — Noch offen

### Analytics
- [ ] Cloudflare Web Analytics Beacon-Snippet in `build.mjs → generateIndexHtml()` einsetzen
  → Slot ist markiert: `<!-- Cloudflare Web Analytics: … -->`
  → Snippet kommt aus dem Cloudflare Dashboard nach Aktivierung (manuelle Übergabe nötig)

### Routing & Subpages
- [ ] Subpages-Routing verifizieren: alle 8 Hash-Routen im Browser testen
- [ ] `directionB/` löschen — **erst nach Rückfrage**, ob noch Inhalte gebraucht werden

### Features (separater Sprint)
- [ ] PDF-Export in `check.jsx` (`downloadPdf()` ist aktuell `.txt`-Stub)
  → Option A: client-seitig mit `pdfmake` oder `jsPDF`
  → Option B: Cloudflare Worker mit `puppeteer-core` + `chrome-aws-lambda`
- [ ] Mail-Versand für Check-Reports
  → Cloudflare Worker + Resend (3.000 Mails/Monat free)
  → Endpoint `POST /api/check-report`

### Validierung nach Go-Live (manual)
- [ ] https://innovation-republic.de/robots.txt erreichbar?
- [ ] https://innovation-republic.de/sitemap.xml erreichbar?
- [ ] https://validator.schema.org/ → Landing-URL → alle Schemas grün?
- [ ] https://search.google.com/test/rich-results → bestanden?
- [ ] OG-Preview: https://www.opengraph.xyz/url/https%3A%2F%2Finnovation-republic.de
- [ ] Ergebnisse in `SEO-CHECKLIST.md` übertragen

---

## Claude Design — Offen

### Mobile ⚡ HÖCHSTE PRIORITÄT — aktuelle Version nicht lesbar auf iOS Safari
- [ ] Responsive Breakpoints für alle Sektionen in `directionA/style.css`
- [ ] Hero-Grid: Desktop 2-spaltig → Mobile 1-spaltig, OS-Widget unterhalb Text
- [ ] Navigation: Hamburger-Menü oder Collapsed Nav auf Mobile
- [ ] `dirA-os` App-Tile-Grid: horizontales Scrollen oder 2-Spalten-Grid auf Mobile
- [ ] Schriftgrößen anpassen (h1 zu groß für Mobile)
- [ ] Touch-Targets: Buttons mind. 44×44px
- [ ] Check-Modal: vollständig scrollbar auf Mobile, kein Overflow
- [ ] Sticky-Pill: Position + Größe auf Mobile prüfen

### GEO — noch offen
- [ ] Erste Sätze jedes Abschnitts = Kernaussage (Inverted Pyramid) — Fließtext-Pass
- [ ] Zahlen, Zeitrahmen, Ortsangaben statt Marketing-Floskeln — Fließtext-Pass
- [ ] `directionA/check.jsx` — Check-Modal Texte prüfen

### UI / Design
- [ ] Team-Sektion in `ADirectionAUeber` reaktivieren (`{false && …}` → sichtbar)
  → sobald 2–3 Personen / Beirat öffentlich kommunizierbar
- [ ] EN-Toggle: aktuell nur visuell angedeutet — Entscheidung: implementieren oder entfernen?
- [ ] OG Image für Subpages (aktuell nur Landing hat OG Image)
- [ ] Subpage-spezifische FAQPage-JSON-LD (sobald File-basiertes Routing kommt)

### Workflow
- [ ] Änderungen aus Design-Session als ZIP oder API-Link übergeben
  → Claude Code übernimmt via `api.anthropic.com/v1/design/h/...` oder ZIP in `uploads/`

---

## Cloudflare Dashboard — Manuelle Schritte

- [ ] **Deploy Command** leer lassen (Build command: `npm run build`, Output: `dist`)
- [ ] **HTTPS Force** aktiviert? (sollte Cloudflare-Default sein)
- [ ] **www → apex Redirect** festlegen (Vorschlag: `www.innovation-republic.de` → `innovation-republic.de`)
- [ ] **Cloudflare Web Analytics** aktivieren → Beacon-Snippet an Claude Code übergeben

---

## Sonstiges

- `design-canvas.jsx` + `tweaks-panel.jsx` bleiben im Repo für Dev-Reviews — nicht löschen
- `directionB/` ist verworfen, liegt aber noch im Repo — Entscheidung ausstehend
- SEO für `.de` (Production) erst vollständig testen wenn Domain auf Cloudflare Pages zeigt
