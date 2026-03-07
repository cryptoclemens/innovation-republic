# Innovation Republic – Semantisches Startup-Matching

**Wer findet die richtigen Startups für den Mittelstand?**
Dieses System verbindet KMU-Problembeschreibungen in natürlicher Sprache mit passenden Startups über semantische Vektorähnlichkeit (pgvector + sentence-transformers). Keine Schlagwort-Suche – das System versteht das eigentliche Problem.

---

## Schnellstart (lokale Entwicklung)

### 1. Voraussetzungen

- Docker & Docker Compose
- Python 3.11+
- Git

### 2. Repository klonen

```bash
git clone https://github.com/innovation-republic/matching-system.git
cd matching-system
```

### 3. Umgebungsvariablen einrichten

```bash
cp .env.example .env
# .env öffnen und Werte eintragen (mindestens ADMIN_PASSWORD)
```

### 4. Datenbank starten

```bash
docker-compose up -d
# Warten bis PostgreSQL bereit ist (ca. 10 Sekunden)
docker-compose logs postgres | grep "ready to accept connections"
```

### 5. Python-Abhängigkeiten installieren

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 6. Setup ausführen

Dieser Schritt:
- Erstellt das Datenbankschema
- Lädt das Sprachmodell herunter (~120 MB, einmalig)
- Befüllt 8 KMU-Seed-Profile
- Befüllt 15 Demo-Startups als Fallback (falls keine API-Keys vorhanden)
- Startet die Ingestion-Pipeline (wenn API-Keys konfiguriert)

```bash
python setup.py
```

### 7. App starten

```bash
streamlit run app.py
```

Die App ist nun erreichbar unter: **http://localhost:8501**

---

## Verfügbare Seiten

| URL | Beschreibung |
|-----|-------------|
| `http://localhost:8501` | Haupt-Matching-Interface |
| `http://localhost:8501/startup_onboarding` | Self-Onboarding für Startups |
| `http://localhost:8501/admin` | Admin-Moderation (passwortgeschützt) |

---

## API-Keys beantragen

### Dealroom (Primärquelle – empfohlen)
1. Besuche [dealroom.co/api](https://dealroom.co/api)
2. Wähle "Non-Profit / Research" für kostenlosen Zugang
3. API-Key in `.env` als `DEALROOM_API_KEY` eintragen
4. Ziel: ~50.000 verifizierte DACH-Startups

### AngelList (Early-Stage, kostenlos)
1. Account erstellen auf [angel.co](https://angel.co)
2. API-Zugang unter [angel.co/api](https://angel.co/api) beantragen
3. API-Key in `.env` als `ANGELLIST_API_KEY` eintragen

### EU Startup Monitor (kein Key erforderlich)
- Wird automatisch genutzt – kein API-Key nötig
- Open Data: [startupmonitor.eu](https://startupmonitor.eu)

### Crunchbase (nur für Demo)
> ⚠️ Nur für den initialen Demo-Betrieb. Nach der Demo deaktivieren!

1. Besuche [data.crunchbase.com](https://data.crunchbase.com/docs/crunchbase-basic-getting-started)
2. Registriere dich für den kostenlosen Basic-Tier
3. API-Key in `.env` als `CRUNCHBASE_API_KEY` eintragen
4. `CRUNCHBASE_ENABLED=true` in `.env` setzen

---

## Nach der Demo: Crunchbase abschalten

Die Crunchbase ToS erlauben **keine dauerhafte Persistenz** in eigenen Datenbanken. Nach der Demo:

### Schritt 1: Crunchbase deaktivieren
```bash
# In .env ändern:
CRUNCHBASE_ENABLED=false
```

### Schritt 2: Demo-Daten entfernen
```bash
python cleanup_demo_data.py
```

Dieser Befehl löscht alle Einträge mit `demo_only=true` (Crunchbase + Demo-Seed-Daten).

### Schritt 3: Verifizieren
```bash
python cleanup_demo_data.py --dry-run
# Sollte: "Keine Demo-Daten vorhanden" ausgeben
```

---

## Systemarchitektur

```
┌─────────────────────────────────────────────────┐
│                  Streamlit Frontend              │
│    app.py          onboarding.py    admin.py    │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                  Core-Module                     │
│    matching.py      diagnosis.py   embedding.py │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│           PostgreSQL + pgvector                  │
│  startups  kmu_profile  match_history  pending  │
└─────────────────────▲───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│               Ingestion-Pipeline                 │
│  Dealroom  EU-Monitor  AngelList  Crunchbase*   │
│              normalize.py                       │
└─────────────────────────────────────────────────┘
* nur Demo-Betrieb
```

### Datenfluss

1. **Ingestion**: Externe APIs → Rohdaten → `pipeline/normalize.py`
2. **Normalisierung**: Übersetzung (DE), Kategorisierung, Deduplizierung
3. **Embedding**: `paraphrase-multilingual-MiniLM-L12-v2` → 384-dim Vektor
4. **Speicherung**: PostgreSQL/pgvector mit IVFFlat-Index
5. **Matching**: KMU-Problem → Embedding → cosine similarity → Top-5

---

## Datenquellen-Strategie

| Quelle | Status | Abdeckung | Qualität |
|--------|--------|-----------|----------|
| Dealroom | Primär | DACH, B2B | ⭐⭐⭐⭐⭐ Verifiziert |
| EU Startup Monitor | Ergänzung | EU, Early-Stage | ⭐⭐⭐ Open Data |
| AngelList | Ergänzung | Global, Seed/Angel | ⭐⭐⭐⭐ |
| Self-Onboarding | Zielarchitektur | Direkt | ⭐⭐⭐⭐⭐ |
| Crunchbase | Nur Demo | Global | ⭐⭐⭐ ToS-Einschränkungen |

---

## Innovationskategorien

Das System klassifiziert automatisch in 7 Kategorien:

- **Prozessautomatisierung** – RPA, Workflow, ERP-Integration
- **Predictive Maintenance** – IoT, Maschinenwartung, Industrie 4.0
- **Nachhaltige Logistik** – Routenoptimierung, CO2, Supply Chain
- **Digitale Qualitätssicherung** – Computer Vision, Inspektion
- **Energieeffizienz** – Smart Energy, Lastoptimierung
- **HR-Tech** – Recruiting, Onboarding, Wissensmanagement
- **Zirkulärwirtschaft** – Recycling, Sekundärrohstoffe

---

## Offline-Betrieb

Nach dem ersten Setup (inkl. Modell-Download) funktioniert das System vollständig offline:
- Kein OpenAI-API erforderlich
- sentence-transformers läuft lokal
- PostgreSQL läuft im Docker-Container

```bash
# Offline starten (nach initialem Setup)
docker-compose up -d
streamlit run app.py
```

---

## Nützliche Befehle

```bash
# Datenbank zurücksetzen
docker-compose down -v && docker-compose up -d && python setup.py

# Nur Ingestion neu starten
python -c "from ingestion import starte_alle_quellen; starte_alle_quellen()"

# Demo-Daten bereinigen (vor Produktiveinsatz)
python cleanup_demo_data.py

# Logs anzeigen
docker-compose logs -f postgres
```

---

## Lizenz & Datenschutz

Entwickelt für **Innovation Republic e.V.**
Alle Startup-Daten werden ausschließlich intern verwendet.
Self-Onboarding-Profile sind jederzeit widerrufbar.

---

*Powered by: sentence-transformers · pgvector · Streamlit · FastAPI · PostgreSQL*
