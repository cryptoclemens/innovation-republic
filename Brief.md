# Innovation Republic – Projekt-Brief

> Zuletzt aktualisiert: 2026-03-17

---

## Vision

Innovation Republic verbindet KMUs im DACH-Raum mit passenden Startups und Lösungsanbietern – kostenlos, ohne Anmeldung, in natürlicher Sprache. Statt Schlagwortsuche versteht das System das eigentliche Problem und findet die richtigen Partner.

---

## Was die Seite heute macht

### Kernfunktion: Startup-Matching
- KMU-Mitarbeiter beschreibt seine Herausforderung in einem Satz
- Claude API analysiert die Herausforderung und findet real existierende Lösungsanbieter
- Websites werden live verifiziert (HTTP-Check)
- Ergebnisse werden als Karten mit Match-Score (0–100), Begründung und verifizierten Links angezeigt

### Bestehende Features
- **Zweisprachig** (DE/EN) mit Sprachwahl
- **Live-Website-Verifikation** mit Google-Fallback bei nicht erreichbaren URLs
- **Match-Score & Begründung** – transparente Bewertung, warum ein Anbieter passt
- **Keine Registrierung** erforderlich
- **DACH-Fokus** mit internationaler Ergänzung
- **Startup-Self-Onboarding** – Formular zur Selbstregistrierung von Lösungsanbietern
- **Admin-Panel** – passwortgeschützte Moderation eingegangener Registrierungen
- **FastAPI-Backend** – REST-Endpoint für externe Integrationen

### Aktueller Tech-Stack
| Komponente | Technologie |
|---|---|
| Frontend | Streamlit (Python) |
| Backend/API | FastAPI + Uvicorn |
| AI | Claude Sonnet 4.6 (Anthropic API) |
| Website-Check | httpx (async) |
| Deployment | Streamlit Cloud + Render.com |
| Demo-Seite | Statisches HTML (GitHub Pages) |

---

## Geplante Migration: Next.js

Das Frontend soll von Streamlit auf **Next.js** (React/TypeScript) migriert werden, um folgende strategische Ziele zu erreichen:

- **SEO**: Server-Side Rendering für Sichtbarkeit bei Google
- **Professionelles UI**: Volle Gestaltungsfreiheit statt Streamlit-Widgets
- **Vereinfachte Architektur**: Frontend + API in einer Anwendung (API Routes)
- **Performance**: Inkrementelle Updates statt Full-Page-Rerenders
- **Skalierbarkeit**: Stateless, horizontal skalierbar
- **Mobile-First**: Vollständig responsive

---

## Zukünftige Features (Backlog)

### Kurzfristig (nächste Meilensteine)
- [ ] Next.js-Grundgerüst mit Matching-Seite
- [ ] API Route für Claude-Matching (ersetzt FastAPI)
- [ ] Website-Verifikation server-side
- [ ] Responsive Ergebniskarten mit Tailwind CSS

### Mittelfristig
- [ ] Startup-Self-Onboarding als Next.js-Formular
- [ ] Admin-Dashboard für Moderation
- [ ] Such-Historie / Favoriten (LocalStorage oder DB)
- [ ] Erweiterte Filter (Land, Branche, Teamgröße)

### Langfristig / Ideen
- [ ] Nutzerkonto & gespeicherte Suchen
- [ ] Startup-Profile mit detaillierten Seiten
- [ ] Bewertungen & Erfahrungsberichte von KMUs
- [ ] Newsletter / Benachrichtigung bei neuen passenden Anbietern
- [ ] API für Drittanbieter-Integration
- [ ] Mehrsprachigkeit über DE/EN hinaus

---

## Zielgruppen

| Zielgruppe | Bedürfnis |
|---|---|
| **KMU-Mitarbeiter** | Schnell passende Lösungsanbieter für konkrete Herausforderungen finden |
| **Startups / Lösungsanbieter** | Sichtbarkeit bei potenziellen Kunden im Mittelstand |
| **Innovation Republic e.V.** | Plattform zur Förderung von Startup-Mittelstand-Kooperationen |

---

## Innovationskategorien

Das System klassifiziert automatisch in 7 Bereiche:

1. **Prozessautomatisierung** – RPA, Workflow, ERP-Integration
2. **Predictive Maintenance** – IoT, Maschinenwartung, Industrie 4.0
3. **Nachhaltige Logistik** – Routenoptimierung, CO2, Supply Chain
4. **Digitale Qualitätssicherung** – Computer Vision, Inspektion
5. **Energieeffizienz** – Smart Energy, Lastoptimierung
6. **HR-Tech** – Recruiting, Onboarding, Wissensmanagement
7. **Zirkulärwirtschaft** – Recycling, Sekundärrohstoffe
