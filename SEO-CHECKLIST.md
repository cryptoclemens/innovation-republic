# SEO & GEO Checklist — Innovation Republic

> Status nach SEO-Pass 2026-05-03 (Claude Design-Session).
> Status-Marker: `[x]` erledigt im Repo-Patch, `[ ]` offen, `[~]` teilweise / Deployment nötig.

---

## 1. Technisches Fundament

- [x] **`<title>`** auf Landing, Subpages erhalten dynamischen Titel via Hash-Route (`_app.jsx → applyHeadForRoute`)
- [x] **`<meta name="description">`** Landing — < 155 Z.
- [x] **Canonical-URL** Landing statisch, Subpages dynamisch via Router gesetzt
- [x] **`<meta name="theme-color" content="#0E0E10">`**
- [x] **OG Image** PNG 1200×630 → `assets/og-image.png` (Stoneground + IR-Mark + Claim)
- [x] **Alle URLs absolut** auf `https://innovation-republic.eu`
- [x] **`<meta property="og:locale" content="de_DE">`**
- [x] **`<meta name="robots">`** default `index, follow`; Impressum/Datenschutz: `index, nofollow` via Router
- [x] **kein hreflang** — bleibt deutsch-only

## 2. Strukturierte Daten (JSON-LD)

### Pflicht für Landing
- [x] **Organization** mit Adresse + parentOrganization (vencly GmbH bis e.V. gegründet)
- [x] **WebSite**
- [x] **FAQPage** mit 6 Fragen (Was/Für wen/Kosten/Sprint-Ablauf/Förderung/Trägerschaft)
- [x] **BreadcrumbList** Landing (einzeiliger Eintrag)

### Bei Subpages-Routing
- [ ] **Service** je Tool — sobald Tool-Detail-Seiten existieren
- [ ] **BreadcrumbList** mehrstufig pro Subpage (aktuell nur via Routing-Pfad)
- [ ] **FAQPage** auf Tool- und Persona-Seiten

### Wenn Team-Sektion aktiv
- [ ] **Person** + `sameAs` LinkedIn — wartet auf Reaktivierung der Team-Sektion

### Validierung
- [~] https://validator.schema.org/ — **nach Deploy laufen lassen**
- [~] https://search.google.com/test/rich-results — **nach Deploy laufen lassen**

## 3. robots.txt + sitemap.xml

- [x] `dist/robots.txt` (statisch + via `build.mjs → generateSeoFiles`)
- [x] `dist/sitemap.xml` (build-time generiert mit aktuellem `lastmod`)
- [x] AI-Crawler explizit erlaubt (GPTBot, ClaudeBot, Google-Extended, PerplexityBot)

## 4. GEO — Generative Engine Optimization

### Copy-Prinzipien
- [~] **H2 als Fragen** — aktuell teils Aussagesätze; in nächstem Copy-Pass schärfen
- [~] **Inverted Pyramid** — wo schon, gut; auf KMU/Anbieter-Seiten noch mal durchgehen
- [x] **FAQ-Sektion auf Landing** — als JSON-LD bereits drin; visuelle FAQ-Sektion im DOM **TODO**: optisch hinzufügen
- [~] **Vollständige Sätze in Listen** — Footer-Listen sind Stichwort, OK; Body-Listen prüfen
- [x] **Zahlen/Zeitrahmen** — 14 Tage, 100 WT, 4–12 Wochen schon drin

## 5. Rechtliches

- [x] **Impressum** → `directionA/legal.jsx → ADirectionAImpressum`, Hash-Route `#/impressum`
  - vencly GmbH, Leopoldstraße 31, 80802 München
  - Vertretung: Clemens Eugen Theodor Pompeÿ
  - HRB 290524, USt-ID DE367131457
  - Hinweis zur Trägerschaft (Innovation Republic e.V. in Gründung)
- [x] **Datenschutz** → `ADirectionADatenschutz`, Hash-Route `#/datenschutz`
  - Verlinkt extern auf vencly-Datenschutzerklärung
  - Kurzfassung im DOM: Hosting, kein Tracking, Speicherfristen, Art. 22, Betroffenenrechte, BayLDA
- [x] **Footer**: Impressum + Datenschutz auf jeder Seite (siehe `directionA/shared.jsx → AFooter`)

## 6. Analytics / Tracking

- [~] **Cloudflare Web Analytics** — Beacon-Snippet-Slot in `build.mjs → generateIndexHtml` markiert; **Aktivierung im CF-Dashboard pending**
- [x] **kein GA4** — bewusst weggelassen
- [x] **Kein Cookie-Banner** — kein Tracking, keine notwendige Einwilligung

## 7. Schnell-Checkliste vor Go-Live

### Technisch
- [x] Canonical-URL auf jeder Route
- [x] OG Image PNG 1200×630
- [x] Title < 60 Z., Description < 155 Z.
- [~] `/robots.txt` und `/sitemap.xml` — **erst nach Deploy live**
- [x] Keine doppelten H1s
- [ ] HTTPS forciert + www-Redirect — **Cloudflare-Pages-Einstellung pending**

### Strukturierte Daten
- [x] Organization + WebSite + FAQ + BreadcrumbList im Landing-`<head>`
- [~] schema.org-Validator grün — **nach Deploy**

### Rechtliches
- [x] Impressum vollständig, Träger vencly GmbH benannt
- [x] Datenschutz-Link funktioniert (intern + extern auf vencly)
- [x] Footer: Impressum + Datenschutz auf jeder Seite sichtbar

### GEO
- [ ] **Visuelle FAQ-Sektion auf Landing** — JSON-LD allein reicht für AI-Indexierung, aber für Google-AI-Overviews ist DOM-FAQ Pflicht. **Folge-Patch nötig.**
- [~] H2s auf Landing als Fragen — Copy-Pass empfohlen

---

## Done in diesem Patch

1. `index.html` — Vollständiger SEO-`<head>` (war teils da, jetzt mit Address + parent + Breadcrumb-LD)
2. `directionA/legal.jsx` — Impressum + Datenschutz neu
3. `directionA/shared.jsx` — Echte Hash-Routes statt `href="#"`, Footer mit funktionierenden Legal-Links
4. `_app.jsx` — Hash-Router, ProductionApp, dynamische `<head>`-Updates pro Route
5. `build.mjs` — Production-Build ohne Design-Canvas / Tweaks; SEO-Files generiert; SPA-`_redirects`; Beacon-Slot
6. `assets/og-image.png` — 1200×630, Brand-konform
7. `robots.txt` + `sitemap.xml` — beide statisch im Repo-Patch + build-time generiert

## Offen (Folge-Tasks)

1. **Visuelle FAQ-Sektion** im DOM auf Landing (für AI Overviews)
2. **Copy-Pass** H2 → Fragen (Plattform, KMU, Anbieter)
3. **Cloudflare Web Analytics** im Dashboard aktivieren + Beacon-Snippet einsetzen
4. **HTTPS / www-Redirect** in Cloudflare Pages konfigurieren
5. **Validierung** nach Deploy: schema.org + Rich Results Test
6. **Subpage-spezifisches `og:image`** sobald Custom-Visuals existieren
