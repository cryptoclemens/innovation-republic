# TASKS — Innovation Republic Web

> Stand: 2026-05-03 | Letzte Session: Claude Code (Cloudflare-Deploy-Debug + SEO-Pass)

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

### SEO-Pass
- [x] `index.html` (Dev-Entry): vollständiger SEO-Head (title, description, canonical, theme-color, robots)
- [x] Open Graph + Twitter Card Tags
- [x] JSON-LD: Organization, WebSite, FAQPage (5 Fragen)
- [x] `assets/og-image.png` (1200×630) angelegt
- [x] `robots.txt` mit KI-Bot-Erlaubnis (GPTBot, ClaudeBot, Google-Extended, PerplexityBot)
- [x] `sitemap.xml` mit allen Hash-Routen
- [x] `SEO-CHECKLIST.md` aus Claude Design-Session übernommen
- [x] `build.mjs` generiert `robots.txt` + `sitemap.xml` dynamisch mit `SITE_URL`

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

### SEO (nächste Priorität)
- [ ] `BreadcrumbList` JSON-LD auf allen Subpages (in `subpages.jsx` und `legal.jsx`)
- [ ] `Service`-Schema für jedes Tool: Robert, Konrad, SpinIn, James, Roland, Fördergeld-Check
- [ ] `#/datenschutz` in `sitemap.xml` ergänzen (aktuell fehlt diese Route)
- [ ] `dateModified` in JSON-LD Schemas (Freshness-Signal für Google)
- [ ] `<meta robots="index, nofollow">` für Impressum + Datenschutz in `_app.jsx` bereits via `applyHeadForRoute()` — verifizieren ob korrekt gesetzt wird

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

### GEO / Copy-Pass (nächste Design-Session)
- [ ] H2-Überschriften auf Landing als vollständige Fragen formulieren
  (z. B. „Wie läuft ein Innovations-Sprint ab?" statt „Prozess")
- [ ] FAQ-Sektion sichtbar im DOM auf Landing (nicht hinter Click-to-Expand)
  → mind. 5–8 echte Nutzerfragen + Antworten in vollständigen Sätzen
- [ ] Erste Sätze jedes Abschnitts = Kernaussage (Inverted Pyramid)
- [ ] Zahlen, Zeitrahmen, Ortsangaben statt Marketing-Floskeln

### Inhaltliche Copy-Anpassungen
- [ ] `directionA/home.jsx` — Copy-Pass nach GEO-Prinzipien
- [ ] `directionA/subpages.jsx` — Plattform, KMU, Anbieter, Förderung, Über uns
- [ ] `directionA/check.jsx` — Check-Modal Texte prüfen

### UI / Design
- [ ] Team-Sektion in `ADirectionAUeber` reaktivieren (`{false && …}` → sichtbar)
  → sobald 2–3 Personen / Beirat öffentlich kommunizierbar
- [ ] EN-Toggle: aktuell nur visuell angedeutet — Entscheidung: implementieren oder entfernen?
- [ ] OG Image für Subpages (aktuell nur Landing hat OG Image)

### Workflow
- [ ] Änderungen aus Design-Session als ZIP oder API-Link übergeben
  → Claude Code übernimmt via `api.anthropic.com/v1/design/h/...` oder ZIP in `uploads/`

---

## Cloudflare Dashboard — Manuelle Schritte

- [ ] **Deploy Command** leer lassen (Build command: `npm run build`, Output: `dist`) — bereits gesetzt?
- [ ] **HTTPS Force** aktiviert? (sollte Cloudflare-Default sein)
- [ ] **www → apex Redirect** festlegen (Vorschlag: www.innovation-republic.de → innovation-republic.de)
- [ ] **Cloudflare Web Analytics** aktivieren → Beacon-Snippet an Claude Code übergeben

---

## Sonstiges

- `design-canvas.jsx` + `tweaks-panel.jsx` bleiben im Repo für Dev-Reviews — nicht löschen
- `directionB/` ist verworfen, liegt aber noch im Repo — Entscheidung ausstehend
- SEO für `.de` (Production) erst vollständig testen wenn Domain auf Cloudflare Pages zeigt
