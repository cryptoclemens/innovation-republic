# CLAUDE.md — Innovation Republic Web

> Diese Datei wird von Claude Code beim Start automatisch gelesen.
> Sie enthält Kontext, Konventionen und To-Dos, die jede Claude-Session kennen muss.
> Quelle: ursprünglich entworfen in Claude.ai (Design-Tool), dann in dieses Repo überführt.

## Projekt in einem Satz

Marketing-Website für **Innovation Republic** — gemeinnützige Initiative, die Innovations-Vorhaben für KMU kuratiert (Robert / Konrad / SpinIn / James / Roland / Fördergeld-Check). Statisch, deployed auf Cloudflare Pages, Domain `innovation-republic.de`.

## Stack

- **React 18** über CDN (UMD-Build, kein `react`-npm-Package)
- **JSX** wird beim Production-Build via **esbuild** transpiliert
- **Vanilla CSS** mit CSS-Custom-Properties (keine Tailwind, kein CSS-in-JS)
- **Cloudflare Pages** als Host, statisch
- Kein SSR, kein Framework, keine TypeScript (bewusst minimal gehalten)

## Wichtige Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Dev-Entry. Lädt Babel-Standalone für sofortiges JSX-Rendering ohne Build. Schnell iterieren. |
| `build.mjs` | Production-Build. Bündelt JSX → `dist/bundle.js`, kopiert Assets, schreibt `dist/index.html`. |
| `directionA/home.jsx` | Landing-Page (Hero, Prozess, Tools, Personas, Manifesto, Stats, CTA, Footer) |
| `directionA/check.jsx` | **Innovations-Check** — 6-Schritt-Wizard im Modal, Score-Berechnung, Roadmap, Mail/PDF |
| `directionA/check.css` | Styles für das Check-Modal (eigenständig, weil Modal außerhalb `.dirA`-Wrapper rendert) |
| `directionA/style.css` | Design-System Direction A — IR-Stoneground (`#F6F5F1`), Inter Tight + JetBrains Mono |
| `directionA/shared.jsx` | Nav, Footer, CTA-Strip, Phasen-Daten, Tool-Liste |
| `directionA/subpages.jsx` | Plattform, Für Auftraggeber, Für Anbieter, Förderung, Über uns/Kontakt |
| `shared/tokens.css` | Logo-Brand-Tokens (`--ir-red`, `--ir-gold` etc.) |
| `design-canvas.jsx` | Multi-Artboard-Viewer für Reviews — **NICHT in Production**, später entfernen |
| `tweaks-panel.jsx` | In-Page Tweaks-Panel — **NICHT in Production**, später entfernen |

## Konventionen

### JSX / React
- **Globale Komponenten** statt Imports: jede `.jsx`-Datei hängt am Ende `Object.assign(window, {Foo, Bar})` an. Andere Files greifen direkt auf `Foo`/`Bar` zu. Hintergrund: das Setup stammt aus Babel-Standalone, wo jeder `<script>`-Tag eigenen Scope hat. Beim esbuild-Build bleibt's konsistent.
- **Kein TypeScript** — bewusst. Bei Bedarf später migrieren, aber nicht ad-hoc.
- **Keine externen UI-Libraries** — alles handgebaut, damit Brand-Konsistenz garantiert ist.

### CSS
- Klassen-Präfix `dirA-` für alle Komponenten von Direction A.
- Design-Tokens als CSS-Variablen in `:root`/`.dirA`. Das Modal überschreibt sie explizit nochmal, weil es außerhalb des `.dirA`-Wrappers rendert.
- **Keine Tailwind / Atomic CSS** — handschriftliches CSS pro Komponente.

### State / Persistenz
- Check-Status in `localStorage`:
  - `ir_check_seen_v1` — Auto-Open-Sperre (Modal nur 1× automatisch)
  - `ir_check_result_v1` — letztes Check-Ergebnis (für Resume-Button auf Sticky-Pill)
- Wenn neue Versionen des Checks kommen: Suffix `_v2` etc., damit alte Browser-States nicht stören.

## Aktuelles Feature: Innovations-Check

6-Schritt-Wizard im Modal. Triggers:
1. **Auto-Open** nach **15 Sek + >50% Scroll-Tiefe** (beide Bedingungen müssen erfüllt sein, einmalig pro Browser)
2. **Hero-CTA** "Innovations-Check starten" (dispatcht `CustomEvent('ir-open-check')`)
3. **Sticky-Pill** unten rechts (immer sichtbar)
4. **Resume-Button** auf Sticky-Pill (nur wenn `ir_check_result_v1` existiert)

Steps: Unternehmen → Abteilung → 4 Reife-Dimensionen (Strategy/Process/Tech/People, je 1–5) → Bedarf (Multi) → Horizont → Mail (optional).

Score = `Math.round((sum / 20) * 100)`. Stufen: 0–34 Startaufstellung, 35–59 Im Anlauf, 60–79 Auf Kurs, 80+ Vorbild-Niveau.

Roadmap-Variation: nach schwächster Dimension. Mappt auf Robert (Bedarf), Konrad (Anbieter-Matching), James (Sprint-Begleitung).

## Bekannte To-Dos

- [ ] **PDF-Export ist aktuell ein `.txt`-Stub** in `check.jsx` → `downloadPdf()`. Für Production: client-seitig mit `pdfmake` oder `jsPDF`, oder Cloudflare Worker mit `puppeteer-core` + `chrome-aws-lambda`.
- [ ] **Mail-Versand** für Check-Reports nicht implementiert. Empfehlung: Cloudflare Worker + Resend (3.000 Mails/Monat free). Endpoint `/api/check-report` POST.
- [ ] **Team-Sektion** in `subpages.jsx` (`ADirectionAUeber`) ist via `{false && …}` ausgeblendet. Reaktivieren, sobald 2–3 Personen / Beirat öffentlich kommunizierbar sind.
- [ ] **`design-canvas.jsx` und `tweaks-panel.jsx` aus Production entfernen** — sind nur für Design-Reviews. In `build.mjs → ENTRY_FILES` rausnehmen, `index.html` umbauen, sodass direkt `<ADirectionAHome />` gemountet wird.
- [ ] **Subpages routen** — aktuell nur via Design-Canvas sichtbar. Echtes Routing: entweder Hash-Routing (kein Server nötig) oder File-basiert (`platform.html`, `kmu.html`, …). Hash ist einfacher.
- [ ] **Richtung B-Code löschen** (`directionB/`) — wurde verworfen, liegt aber noch im Repo.
- [ ] **SEO** — OG-Tags, Sitemap, robots.txt fehlen.
- [ ] **Analytics** — Cloudflare Web Analytics aktivieren (Privacy-friendly, kein Cookie-Banner nötig).

## Workflows für Claude Code

### Lokal entwickeln
```bash
npm install
npm run dev      # http://localhost:8080, Watch-Mode
```

Oder Babel-Standalone-Variante (kein Build, schnellster Iterations-Cycle):
```bash
python3 -m http.server 8000
# → http://localhost:8000/index.html
```

### Deploy
```bash
git push origin main
# Cloudflare Pages baut automatisch (verbunden via Dashboard)
```

### Wenn der Build kaputt ist
- esbuild meldet Syntax-Fehler mit Datei + Zeile
- Häufigster Fehler: globaler Component-Name kollidiert (z. B. `const styles` in mehreren Files). Lösung: präfixieren (`checkStyles`, `homeStyles`).

## Don'ts

- **Keine Build-Tools tauschen ohne Grund.** esbuild reicht. Vite/Next sind Overkill für eine 5-Seiten-Marketing-Site.
- **Keine UI-Libraries einführen.** Alles ist bewusst handgemacht, um Brand-Kontrolle zu behalten.
- **Keine Tracking-/Marketing-Skripte ohne explizite Freigabe.** Gemeinnützige Initiative — Datenschutz ist Teil des Markenversprechens.
- **Keine emoji** im UI (außer wo Tokens explizit Symbole sind, z. B. ✓ in Listen).
- **Keine generierten/AI-aussehenden Stock-Bilder** ohne Rücksprache.

## Brand

- Logo: `assets/logo-ir.png` (in Footer invert, sonst original)
- Primärfarbe Black: `#0E0E10`
- Akzent Rot: `#DC2626` (slightly tuned), Logo-Original `#E30613`
- Akzent Gold: `#F4B83C` (slightly tuned), Logo-Original `#FFCC00`
- Hintergrund: Stoneground `#F6F5F1`
- Type: **Inter Tight** (UI/Body), **JetBrains Mono** (Mono-Labels, Eyebrow, Stats)

## Kontakt

- Verantwortlich: Clemens Pompeÿ
- Mail: hello@innovationrepublic.de
- Repo: https://github.com/cryptoclemens/innovation-republic
