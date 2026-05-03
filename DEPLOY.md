# Build & Deploy

Production-Build und Deploy auf Cloudflare Pages.

## Lokal entwickeln

Für die täglichen Design-Iterationen reicht **`index.html`** im Browser (Babel-Standalone, hot-reload via Editor). Kein Build nötig.

## Production-Build (vor Deploy)

```bash
npm install      # einmalig
npm run build    # → dist/
```

`dist/` enthält:
- `index.html` — ohne Babel-Standalone, mit gebundeltem `bundle.js`
- `bundle.js` — alle JSX-Files via esbuild minifiziert (~50–80 KB statt 200+ KB Babel-Overhead)
- `assets/`, `directionA/style.css`, `directionA/check.css`, `shared/tokens.css`
- `_headers`, `_redirects` — Cloudflare-Pages-Konfiguration

Lokal testen:
```bash
npm run dev      # → http://localhost:8080 mit Watch-Mode
```

## Deploy auf Cloudflare Pages

### Variante A — Git-basiert (empfohlen)

1. Repo bei GitHub/GitLab anlegen, push.
2. In Cloudflare-Dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Repo auswählen, dann:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node-Version**: `20`
4. Custom Domain hinzufügen (`innovation-republic.de`) → DNS automatisch via Cloudflare.

→ Jeder Push auf `main` deployt automatisch.
→ Preview-URLs für jeden Branch (z. B. für Stakeholder-Reviews).

### Variante B — Direkt-Upload (für Einmal-Deploys)

```bash
npm run build
npx wrangler pages deploy dist --project-name innovation-republic
```

## Mail-Versand für Check-Reports (später)

Im Free-Plan über einen Cloudflare Worker:

1. Worker anlegen mit `wrangler init`
2. POST-Endpoint, der die Check-Antworten entgegennimmt
3. Mail-Versand via [Resend](https://resend.com) (3.000 Mails/Monat free)
4. Im `CheckResult`-Component statt `mailto:` einen `fetch('/api/check-report', …)` aufrufen

Ich baue diesen Worker, sobald wir uns dazu entscheiden.

## Kosten-Übersicht

| Posten | Anbieter | Kosten |
|---|---|---|
| Hosting | Cloudflare Pages | 0 € |
| Bandbreite | Cloudflare | 0 € (unbegrenzt) |
| SSL | Cloudflare | 0 € |
| Mail-Versand | Resend (free) | 0 € (bis 3.000/Monat) |
| Worker | Cloudflare | 0 € (bis 100k Req/Tag) |
| **Domain** | INWX / Cloudflare Registrar | **~10 €/Jahr** |

→ **~10 €/Jahr** Gesamtkosten.
