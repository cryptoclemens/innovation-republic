# Innovation Republic — Web

Marketing-Website für Innovation Republic. Statisch, deployed via Cloudflare Pages.

**Repo:** https://github.com/cryptoclemens/innovation-republic
**Production:** _(folgt nach erstem Deploy)_

## Quick Start

```bash
npm install
npm run dev      # http://localhost:8080 mit Watch-Mode
npm run build    # Production-Build → dist/
```

## Stack

- **React 18** via CDN (UMD-Build, gecached durch Cloudflare)
- **esbuild** für JSX-Bundling
- **Vanilla CSS** mit Design-Tokens in `shared/tokens.css`
- Keine Framework-Magie, kein SSR, kein Backend (außer optionalem Mail-Worker)

## Struktur

```
.
├── index.html           ← Dev-Entry (Babel-Standalone, schnell iterieren)
├── build.mjs            ← Production-Build-Skript
├── package.json
│
├── directionA/          ← Aktuelles Design (Direction A "InnovationOS")
│   ├── style.css
│   ├── check.css        ← Innovations-Check Modal
│   ├── shared.jsx       ← Nav, Footer, gemeinsame Komponenten
│   ├── home.jsx         ← Landing-Page
│   ├── check.jsx        ← 6-Schritt-Wizard mit Score + Roadmap + Mail/PDF
│   └── subpages.jsx     ← Plattform, KMU, Anbieter, Förderung, Über uns
│
├── shared/tokens.css    ← Brand-Tokens (Logo-Farben)
├── assets/              ← Logo, Bilder
│
├── design-canvas.jsx    ← Multi-Artboard-Viewer (nur für Design-Reviews)
└── tweaks-panel.jsx     ← In-Page-Tweaks (nur für Design-Reviews)
```

## Deployment

Siehe [DEPLOY.md](./DEPLOY.md).

## Lizenz

© Innovation Republic. Alle Rechte vorbehalten (i.Gr.).
