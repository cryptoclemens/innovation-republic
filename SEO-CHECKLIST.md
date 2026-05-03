# SEO & GEO Checklist — Innovation Republic

> Status nach SEO-Pass v2 2026-05-03 (FAQ + Copy — Claude Design + Claude Code).
> Status-Marker: `[x]` erledigt, `[ ]` offen, `[~]` teilweise / Deployment nötig.

---

## 1. Technisches Fundament

- [x] **`<title>`** auf Landing, Subpages erhalten dynamischen Titel via Hash-Route (`_app.jsx → applyHeadForRoute`)
- [x] **`<meta name="description">`** Landing — < 155 Z.
- [x] **Canonical-URL** Landing statisch, Subpages dynamisch via Router gesetzt
- [x] **`<meta name="theme-color" content="#0E0E10">`**
- [x] **OG Image** PNG 1200×630 → `assets/og-image.png` (Stoneground + IR-Mark + Claim)
- [x] **Alle URLs absolut** auf `https://innovation-republic.eu` (Staging) / `.de` (Production via `SITE_URL`)
- [x] **`<meta property="og:locale" content="de_DE">`**
- [x] **`<meta name="robots">`** default `index, follow`; Impressum/Datenschutz: `index, nofollow` via Router
- [x] **kein hreflang** — bleibt deutsch-only

## 2. Strukturierte Daten (JSON-LD)

### Pflicht für Landing
- [x] **Organization** mit Adresse + parentOrganization (vencly GmbH bis e.V. gegründet)
- [x] **WebSite** mit `dateModified`
- [x] **FAQPage** mit 6 Fragen (Was/Für wen/Kosten/Sprint-Ablauf/Förderung/Trägerschaft)
- [x] **BreadcrumbList** dynamisch per Route via `applyHeadForRoute()` in `_app.jsx`

### Bei Subpages-Routing
- [x] **Service**-Schema für Plattform, KMU, Anbieter, Förderung — dynamisch per Route via `applyHeadForRoute()`
- [x] **BreadcrumbList** mehrstufig — dynamisch injiziert pro Subpage
- [x] **FAQPage Microdata** auf Subpages via `AFAQBlock` (Microdata + JSON-LD, doppelte Absicherung)
- [ ] **Subpage-spezifische FAQPage JSON-LD im `<head>`** — sobald File-basiertes Routing kommt

### Wenn Team-Sektion aktiv
- [ ] **Person** + `sameAs` LinkedIn — wartet auf Reaktivierung der Team-Sektion

### Validierung
- [~] https://validator.schema.org/ — **nach Deploy laufen lassen**
- [~] https://search.google.com/test/rich-results — **nach Deploy laufen lassen**

## 3. robots.txt + sitemap.xml

- [x] `dist/robots.txt` (via `build.mjs → generateSeoFiles`)
- [x] `dist/sitemap.xml` (build-time generiert, inkl. `#/datenschutz`, mit aktuellem `lastmod`)
- [x] AI-Crawler explizit erlaubt (GPTBot, ClaudeBot, Google-Extended, PerplexityBot)

## 4. GEO — Generative Engine Optimization

### Copy-Prinzipien
- [x] **H2 als Fragen** — Landing + alle Subpages (SEO-Pass v2)
- [~] **Inverted Pyramid** — Fließtext-Pass noch ausstehend (erste Sätze als Kernaussagen)
- [x] **FAQ-Sektion auf Landing** — JSON-LD + visuell im DOM (`AHomeFAQ`, 6 Karten)
- [x] **FAQ-Sektionen auf Subpages** — `AFAQBlock` mit 4 Karten je Persona
- [~] **Vollständige Sätze in Listen** — Body-Listen noch prüfen
- [x] **Zahlen/Zeitrahmen** — 14 Tage, 100 WT, 4–12 Wochen drin
- [x] **Microdata FAQPage** zusätzlich zu JSON-LD — doppelte Absicherung für Google AI Overviews

## 5. Rechtliches

- [x] **Impressum** → `directionA/legal.jsx → ADirectionAImpressum`, Hash-Route `#/impressum`
  - vencly GmbH, Leopoldstraße 31, 80802 München
  - Vertretung: Clemens Eugen Theodor Pompeÿ
  - HRB 290524, USt-ID DE367131457
  - Hinweis zur Trägerschaft (Innovation Republic e.V. in Gründung)
- [x] **Datenschutz** → `ADirectionADatenschutz`, Hash-Route `#/datenschutz`
  - Kurzfassung im DOM: Hosting, kein Tracking, Speicherfristen, Art. 22, Betroffenenrechte, BayLDA
- [x] **Footer**: Impressum + Datenschutz auf jeder Seite (siehe `directionA/shared.jsx → AFooter`)

## 6. Analytics / Tracking

- [x] **Cloudflare Web Analytics** — aktiv auf `innovation-republic.eu`, `auto_install: true`, Beacon wird am Edge injiziert
- [x] **kein GA4** — bewusst weggelassen
- [x] **Kein Cookie-Banner** — kein Tracking, keine notwendige Einwilligung

## 7. Schnell-Checkliste vor Go-Live

### Technisch
- [x] Canonical-URL auf jeder Route
- [x] OG Image PNG 1200×630
- [x] Title < 60 Z., Description < 155 Z.
- [~] `/robots.txt` und `/sitemap.xml` — nach Deploy verifizieren
- [x] Keine doppelten H1s
- [ ] HTTPS forciert + www-Redirect — **Cloudflare-Pages-Einstellung pending**

### Strukturierte Daten
- [x] Organization + WebSite + FAQ + BreadcrumbList im Landing-`<head>`
- [x] Service-Schema + BreadcrumbList dynamisch auf Subpages
- [~] schema.org-Validator grün — **nach Deploy**

### Rechtliches
- [x] Impressum vollständig, Träger vencly GmbH benannt
- [x] Datenschutz-Link funktioniert (intern + extern auf vencly)
- [x] Footer: Impressum + Datenschutz auf jeder Seite sichtbar

### GEO
- [x] Visuelle FAQ-Sektion auf Landing (`AHomeFAQ`, 6 Q&A im DOM)
- [x] H2s auf Landing + Subpages als vollständige Fragen
- [ ] Fließtext-Pass: Inverted Pyramid, vollständige Sätze in Listen
