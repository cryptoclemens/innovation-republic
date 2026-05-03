# Setup für Claude Code

So überführst du dieses Projekt in eine lokale Claude-Code-Session.

## 1. Lokal klonen

```bash
git clone https://github.com/cryptoclemens/innovation-republic.git
cd innovation-republic
npm install
```

## 2. Claude Code installieren (falls noch nicht da)

```bash
# Anthropic CLI
npm install -g @anthropic-ai/claude-code
```

(Aktuelle Anleitung: https://docs.anthropic.com/claude/docs/claude-code)

## 3. Erste Session starten

```bash
cd innovation-republic
claude
```

Claude liest beim Start automatisch:
- `CLAUDE.md` — Projekt-Kontext, Konventionen, To-Dos
- Repo-Struktur
- Recent Git-History

## 4. Erste sinnvolle Prompts

```
"Lies CLAUDE.md und gib mir eine Zusammenfassung des Projekts."

"Setze das Production-Cleanup um:
 1. Entferne directionB/
 2. Entferne design-canvas.jsx und tweaks-panel.jsx aus build.mjs
 3. Baue index.html so um, dass direkt ADirectionAHome gemountet wird statt
    Design-Canvas-Wrapper.
 Lass index.html (Dev-Variante mit Babel) intakt — wir brauchen sie für Reviews."

"Implementiere echte PDF-Generierung im Check-Modal mit jsPDF.
 Behalte das Layout des aktuellen .txt-Stubs als Vorlage."

"Lege einen Cloudflare Worker an, der POSTs auf /api/check-report
 entgegennimmt und via Resend eine Mail schickt. Wrangler-Setup inklusive."

"Füge Hash-Routing hinzu, sodass alle Subpages erreichbar sind:
 #/platform, #/kmu, #/anbieter, #/spenden, #/ueber"
```

## 5. Was du in Claude.ai (dem Web-Tool) lassen solltest

Claude.ai (wo wir bisher gearbeitet haben) ist ideal für:
- Schnelle visuelle Iterationen mit dem Design-Canvas
- Side-by-side Variations-Reviews
- Stakeholder-Walkthroughs

→ **Workflow-Empfehlung:**
- **Visual / Design-Explorationen** weiterhin in Claude.ai (öffne dieses Projekt einfach erneut)
- **Code / Build / Deploy / Backend** in Claude Code lokal

Beide Sessions arbeiten am selben Git-Repo. Pull/Push schließt den Loop.

## 6. Empfohlene Setup-Tasks für die erste Claude-Code-Session

1. ✅ Repo verifizieren (`npm run build` läuft sauber durch)
2. ✅ Cloudflare Pages mit dem Repo verbinden (siehe `DEPLOY.md`)
3. 🔲 Production-Cleanup (siehe Prompts oben)
4. 🔲 Hash-Routing
5. 🔲 PDF-Export
6. 🔲 Mail-Worker
7. 🔲 SEO + Analytics

Reihenfolge spielt keine Rolle, aber **Production-Cleanup zuerst** macht Sinn —
sonst lädst du in Production unnötigen Design-Canvas-Code mit.
