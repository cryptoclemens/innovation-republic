-- ============================================================
-- Innovation Republic – Datenbankschema
-- PostgreSQL mit pgvector-Erweiterung
-- ============================================================

-- pgvector-Erweiterung aktivieren (für semantisches Matching)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- Haupttabelle: Startups aus allen externen Quellen
-- ============================================================
CREATE TABLE IF NOT EXISTS startups (
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    beschreibung          TEXT,
    branchen_tags         TEXT[],
    loesung_kategorie     VARCHAR(100),       -- Eine der 7 internen Kategorien
    quelle                VARCHAR(50) NOT NULL, -- dealroom, angellist, eu_startup_monitor, crunchbase, self-onboarding, mehrere
    externe_id            VARCHAR(255),        -- Original-ID aus der Quelle
    embedding             vector(384),         -- paraphrase-multilingual-MiniLM-L12-v2
    zuletzt_aktualisiert  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    demo_only             BOOLEAN DEFAULT FALSE, -- true = nur für Demo, wird via cleanup_demo_data.py entfernt
    website               VARCHAR(500),
    land                  VARCHAR(100),
    gruendungsjahr        INTEGER,
    teamgroesse           VARCHAR(50),
    finanzierung_gesamt   DECIMAL(15, 2)       -- in EUR
);

-- Indizes für performante Vektorsuche und häufige Filter
CREATE INDEX IF NOT EXISTS idx_startups_embedding
    ON startups USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_startups_quelle
    ON startups(quelle);

CREATE INDEX IF NOT EXISTS idx_startups_demo_only
    ON startups(demo_only);

CREATE INDEX IF NOT EXISTS idx_startups_kategorie
    ON startups(loesung_kategorie);

-- Eindeutigkeitsbeschränkung: Kein Duplikat aus derselben Quelle
CREATE UNIQUE INDEX IF NOT EXISTS idx_startups_externe_id
    ON startups(quelle, externe_id) WHERE externe_id IS NOT NULL;


-- ============================================================
-- KMU-Profile für Matching-Tests und Demo-Betrieb
-- ============================================================
CREATE TABLE IF NOT EXISTS kmu_profile (
    id                   SERIAL PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    branche              VARCHAR(100),
    problem_beschreibung TEXT NOT NULL,
    embedding            vector(384),
    erstellt_am          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- Match-Historie: Welches KMU hat welches Startup gefunden?
-- ============================================================
CREATE TABLE IF NOT EXISTS match_history (
    id               SERIAL PRIMARY KEY,
    kmu_id           INTEGER REFERENCES kmu_profile(id) ON DELETE SET NULL,
    startup_id       INTEGER REFERENCES startups(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL,
    problem_text     TEXT,                    -- gespeicherter Suchtext (max. 500 Zeichen)
    timestamp        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_match_history_timestamp
    ON match_history(timestamp DESC);


-- ============================================================
-- Ingestion-Log: Übersicht über Datenimporte
-- ============================================================
CREATE TABLE IF NOT EXISTS ingestion_log (
    id                  SERIAL PRIMARY KEY,
    quelle              VARCHAR(50) NOT NULL,
    anzahl_importiert   INTEGER DEFAULT 0,
    anzahl_fehler       INTEGER DEFAULT 0,
    fehler_details      TEXT,
    timestamp           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- Self-Onboarding: Eingereichte Startups (Moderationswarteschlange)
-- ============================================================
CREATE TABLE IF NOT EXISTS startups_pending (
    id                    SERIAL PRIMARY KEY,
    name                  VARCHAR(255) NOT NULL,
    beschreibung          TEXT,
    branchen_tags         TEXT[],
    loesung_kategorie     VARCHAR(100),
    quelle                VARCHAR(50) DEFAULT 'self-onboarding',
    externe_id            VARCHAR(255),
    embedding             vector(384),
    zuletzt_aktualisiert  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    demo_only             BOOLEAN DEFAULT FALSE,
    website               VARCHAR(500),
    land                  VARCHAR(100),
    ansprechpartner_email VARCHAR(255),        -- intern, wird nicht angezeigt
    status                VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    eingereicht_am        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
