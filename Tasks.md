# Innovation Republic – Umsetzungsplan Next.js-Migration

> Zuletzt aktualisiert: 2026-03-18 (Meilenstein 5 abgeschlossen)

---

## Meilenstein 1: Projekt-Setup & Grundgerüst ✅

- [x] Next.js-Projekt initialisieren (TypeScript, App Router) → `frontend/` mit Next.js 16.1.7
- [x] Tailwind CSS einrichten → Tailwind v4 via `@tailwindcss/postcss`
- [x] Projektstruktur anlegen (`app/`, `components/`, `lib/`) → `src/app/`, `src/components/`, `src/lib/`
- [x] ESLint & Prettier konfigurieren → `.eslintrc.json` (next), `.prettierrc`
- [x] Environment-Variablen (.env.local) für `ANTHROPIC_API_KEY` einrichten → `.env.example`
- [x] Basis-Layout mit Header, Footer, Sprachwahl (DE/EN) → `Header.tsx`, `Footer.tsx`, `SearchBox.tsx`, `i18n.ts`

**Ergebnis:** Lauffähiges Next.js-Projekt mit Basis-Layout – Build erfolgreich ✅

---

## Meilenstein 2: Kern-Feature – Matching-Seite ✅

- [x] Eingabefeld für Herausforderung (Client Component) → `SearchBox.tsx` mit Enter-Support
- [x] API Route `POST /api/match` – Claude API anbinden → `app/api/match/route.ts` + `lib/matcher.ts`
- [x] Server-seitige Website-Verifikation → `lib/verifier.ts` (URL-Varianten-Fallback, HEAD→GET)
- [x] Ergebniskarten-Komponente (`MatchCard`) mit Score, Begründung, Links → `MatchCard.tsx`
- [x] Ladeanimation / Skeleton während der Suche → `MatchSkeleton.tsx`
- [x] Fehlerbehandlung (kein API-Key, API-Fehler, leere Ergebnisse) → Error-Banner + API-Validierung

**Ergebnis:** Funktionales Matching wie bisher, aber als Next.js-App – Build erfolgreich ✅

---

## Meilenstein 3: UI/UX & Responsive Design ✅

- [x] Responsive Layout – SearchBox stackt auf Mobile, MatchCard kompakter, Badges scrollen
- [x] Score-Visualisierung – Fortschrittsbalken + Farbkodierung (grün/amber/grau) (in M2)
- [x] Google-Fallback-Link bei nicht verifizierten URLs (in M2)
- [x] Flaggen-Icons für Länder (in M2)
- [x] Dark Mode – `DarkModeToggle.tsx`, CSS-Variablen, localStorage-Persistenz, FOUC-Schutz
- [x] Barrierefreiheit – ARIA-Labels, role="search/alert/status/progressbar", sr-only Labels, focus-visible

**Ergebnis:** Professionelles, mobiltaugliches UI mit Dark Mode und Barrierefreiheit ✅

---

## Meilenstein 4: Internationalisierung (i18n) ✅

- [x] i18n-Setup – eigene Lösung via `lib/i18n.ts` (leichtgewichtig, kein next-intl nötig)
- [x] Deutsche Übersetzungen – vollständig (Suche + Onboarding)
- [x] Englische Übersetzungen – vollständig (Suche + Onboarding)
- [x] Sprachwahl im Header mit localStorage-Persistenz + html `lang`-Attribut

**Ergebnis:** Vollständige Zweisprachigkeit DE/EN ✅

---

## Meilenstein 5: Startup-Self-Onboarding ✅

- [x] Formular-Seite `/onboarding` – Name, Beschreibung, Tags (Toggle), E-Mail, Website, Consent
- [x] API Route `POST /api/onboarding` – Server-Validierung + JSON-Datei-Speicher
- [x] Datenspeicher via `data/startups_pending.json` (leicht austauschbar gegen DB)
- [x] Bestätigungsseite mit Checkmark-Animation + "Weiteres Startup eintragen"
- [ ] E-Mail-Benachrichtigung an Admin (offen – benötigt SMTP-/Sendgrid-Konfiguration)

**Ergebnis:** Startups können sich selbst registrieren ✅

---

## Meilenstein 6: Admin-Dashboard

- [ ] Authentifizierung (Passwort oder NextAuth)
- [ ] Dashboard-Seite `/admin`
- [ ] Pending-Einreichungen anzeigen, genehmigen, ablehnen
- [ ] Statistiken (Anzahl Suchen, Top-Kategorien)

**Ergebnis:** Administrationsoberfläche für Moderation

---

## Meilenstein 7: SEO & Performance

- [ ] Meta-Tags & Open Graph für alle Seiten
- [ ] Structured Data (JSON-LD) für Organisation
- [ ] Sitemap generieren
- [ ] Lighthouse-Optimierung (Core Web Vitals)
- [ ] Caching-Strategie für häufige Suchanfragen

**Ergebnis:** Optimale Auffindbarkeit und Ladezeiten

---

## Meilenstein 8: Deployment & Go-Live

- [ ] Vercel-Deployment einrichten
- [ ] Environment-Variablen auf Vercel konfigurieren
- [ ] Custom Domain einrichten
- [ ] Monitoring & Error-Tracking (z.B. Sentry)
- [ ] Alte Streamlit-App ablösen
- [ ] README.md aktualisieren

**Ergebnis:** Produktive Next.js-App unter eigener Domain

---

## Zukünftige Meilensteine (nach Go-Live)

### Meilenstein 9: Erweiterte Features
- [ ] Such-Historie (LocalStorage)
- [ ] Favoriten-Funktion
- [ ] Filter nach Land, Branche, Teamgröße
- [ ] Detailseiten für Startups (`/startup/[slug]`)

### Meilenstein 10: Nutzerkonten & Personalisierung
- [ ] Registrierung / Login
- [ ] Gespeicherte Suchen
- [ ] Benachrichtigungen bei neuen passenden Anbietern

### Meilenstein 11: Community & Bewertungen
- [ ] KMU-Erfahrungsberichte zu Anbietern
- [ ] Bewertungssystem
- [ ] Newsletter-Integration

---

## Technologie-Entscheidungen

| Bereich | Entscheidung | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | SSR, API Routes, moderne Architektur |
| Styling | Tailwind CSS + shadcn/ui | Schnelle Entwicklung, konsistentes Design |
| Sprache | TypeScript | Typsicherheit, bessere DX |
| AI | Anthropic SDK (server-side) | Bestehende Logik, API-Key bleibt server-side |
| Deployment | Vercel | Optimiert für Next.js, Edge Functions |
| DB (optional) | Supabase / PostgreSQL | Für Onboarding & Admin, wenn benötigt |
