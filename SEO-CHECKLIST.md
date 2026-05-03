# SEO & GEO Checklist — Innovation Republic

> Innovation-Republic-spezifische Adaption des allgemeinen SEO-GEO-Guides aus `cryptoclemens/innoacta/SEO-GEO-Guide.md`.
> Stack: Vanilla HTML + esbuild auf Cloudflare Pages (kein Next.js). Domain: `innovation-republic.de`.
> Status-Marker: `[x]` erledigt, `[ ]` offen, `[~]` teilweise.

---

## 1. Technisches Fundament

- [ ] **`<title>`** auf jeder Seite, max. 60 Zeichen, primäres Keyword vorne
- [ ] **`<meta name="description">`** max. 155 Zeichen, mit Handlungsaufforderung
- [ ] **Canonical-URL** auf jeder Seite — auch Startseite
- [ ] **`<meta name="theme-color" content="#0E0E10">`** für Mobile-Browser-Chrome
- [ ] **OG Image** als PNG (nicht SVG!), 1200×630, in `assets/og-image.png`
- [ ] **`metadataBase`-Äquivalent**: alle URLs absolut auf `https://innovation-republic.de`
- [ ] **`<meta property="og:locale" content="de_DE">`**
- [ ] **`<meta name="robots" content="index, follow">`** (default; Impressum/Datenschutz: `index, nofollow`)
- [ ] **kein hreflang** — Seite ist nur Deutsch

## 2. Strukturierte Daten (JSON-LD)

Alle als `<script type="application/ld+json">` direkt im `<head>` der jeweiligen Seite.

### Pflicht für Landing
- [ ] **Organization / NGO** (Träger ist aktuell vencly GmbH; wenn e.V. gegründet → `NGO`)
- [ ] **WebSite** mit `potentialAction` (SearchAction später, falls Suche kommt)
- [ ] **FAQPage** mit den 5–8 häufigsten Fragen (echte Nutzerfragen!)
- [ ] **BreadcrumbList** (auch für Landing → einzeiliger Eintrag)

### Bei Subpages-Routing
- [ ] **Service** je Tool (Robert, Konrad, James, SpinIn, Roland, Fördergeld-Check)
- [ ] **BreadcrumbList** mehrstufig
- [ ] **FAQPage** auf Tool- und Persona-Seiten

### Wenn Team-Sektion aktiv
- [ ] **Person** + `sameAs` LinkedIn

### Validierung
- [ ] https://validator.schema.org/ — alle Schemas grün
- [ ] https://search.google.com/test/rich-results — Rich-Results-Test bestanden

## 3. robots.txt + sitemap.xml

- [ ] `dist/robots.txt` mit Verweis auf Sitemap
- [ ] `dist/sitemap.xml` — bei statischer Site händisch in `build.mjs` generieren oder einchecken
- [ ] In `build.mjs` als zu kopierende Assets eintragen

## 4. GEO — Generative Engine Optimization

### Copy-Prinzipien
- [ ] H2-Überschriften als **vollständige Fragen** ("Wie läuft ein Innovations-Sprint ab?" statt "Prozess")
- [ ] Erster Satz jedes Abschnitts = Kernaussage (Inverted Pyramid)
- [ ] FAQ-Sektion auf Landing — Pflicht für AI Overviews
- [ ] Vollständige Sätze in Listen (nicht nur Stichworte)
- [ ] Zahlen, Zeitrahmen, Ortsangaben statt Marketing-Floskeln

### Was AI-Suchmaschinen besonders gut indexieren
| Element | Warum |
|---|---|
| `FAQPage` Schema | Direkte Q&A-Extraktion |
| Klare H2/H3-Hierarchie | Semantische Struktur |
| Vollständige Sätze in Listen | Besser zitierfähig |
| Statisches HTML | Vollständige Indexierung (wir liefern HTML, kein SSR-only — passt) |

## 5. Rechtliches (DACH / Deutschland)

### Impressum (§ 5 TMG) — **bestehender Stand übernehmen**
Quelle: https://www.innovationrepublic.de/impressum (Stand vor Redesign)

- Träger: **vencly GmbH**, Leopoldstraße 31, 80802 München
- Vertreten durch: Clemens Eugen Theodor Pompeÿ
- E-Mail: hello@vencly.com
- HRB 290524 (AG München), USt-ID: DE367131457
- Streitbeilegung: keine Teilnahme
- Standardbausteine: Haftung für Inhalte / Links / Urheberrecht

> Hinweis im Impressum behalten: "Bis zur Gründung eines eigenen Innovation Republic e.V. übernimmt die vencly GmbH …"

### Datenschutz
- [ ] **Verlinken** auf bestehende vencly-Datenschutzerklärung (https://www.vencly.com/datenschutzerklarung) — wie auf der alten Seite
- [ ] **Oder eigene minimal** schreiben, wenn neuer Verantwortlicher (e.V.) — dann:
  - Hosting (Cloudflare, USA → DPF erwähnen)
  - Mail-Kontakt (Speicherdauer 3 Jahre / 10 Jahre bei steuerlicher Relevanz)
  - **kein Tracking** → kein Cookie-Banner nötig
  - Art. 22 DSGVO explizit: keine automatisierte Entscheidungsfindung
  - Betroffenenrechte (Art. 15–21)
  - Aufsichtsbehörde: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Ansbach

## 6. Analytics / Tracking

- [ ] **Cloudflare Web Analytics** aktivieren (Privacy-friendly, kein Cookie-Banner nötig)
- [ ] **kein GA4** ohne explizite Freigabe (CLAUDE.md: gemeinnützig, Datenschutz = Markenversprechen)
- [ ] Falls je GA4 kommt: Consent Mode v2 wie im Original-Guide implementieren

## 7. Schnell-Checkliste vor Go-Live

### Technisch
- [ ] Alle Seiten haben Canonical-URL
- [ ] OG Image ist PNG, 1200×630, aussagekräftig
- [ ] Title < 60 Z., Description < 155 Z. überall
- [ ] `/robots.txt` und `/sitemap.xml` erreichbar
- [ ] Keine doppelten H1s
- [ ] Cloudflare Pages: HTTPS forciert, www-Redirect zu apex (oder umgekehrt — eine Variante)

### Strukturierte Daten
- [ ] Organization/NGO + WebSite im `<head>` der Landing
- [ ] FAQPage auf Landing
- [ ] BreadcrumbList überall
- [ ] schema.org-Validator grün

### Rechtliches
- [ ] Impressum vollständig übernommen, Träger vencly GmbH benannt
- [ ] Datenschutz-Link funktioniert
- [ ] Footer: Impressum + Datenschutz auf jeder Seite sichtbar

### GEO
- [ ] H2s auf Landing als Fragen
- [ ] FAQ-Sektion (5–8 echte Fragen) sichtbar im DOM, nicht hinter Click-to-Expand allein
- [ ] Erste Sätze fassen Kernaussage zusammen

---

## Reihenfolge-Empfehlung für Claude Code

1. **`<head>`-Pass** auf `index.html` (bzw. dem produktiven Entry-File nach Cleanup) — Meta-Tags + JSON-LD + OG
2. **`assets/og-image.png`** generieren (1200×630, IR-Logo + Claim auf Stoneground)
3. **`robots.txt` + `sitemap.xml`** anlegen, in `build.mjs` einbinden
4. **Impressum-Seite** als `/impressum` (Hash- oder Subpath-Routing) — Inhalte aus Stand vor Redesign übernehmen
5. **Datenschutz-Verweis** → vencly-Datenschutzerklärung verlinken
6. **Cloudflare Web Analytics** in Cloudflare Pages aktivieren (Dashboard-Klick, kein Code)
7. **Validierung**: schema.org + Rich-Results-Test
