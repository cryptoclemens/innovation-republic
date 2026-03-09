-- ============================================================
-- Migration 002: Website-Verifikation
-- Innovation Republic – Startup-Existenzprüfung via HTTP-Check
-- ============================================================
-- Ausführen mit:
--   psql $DATABASE_URL -f db/migrations/002_website_verification.sql
-- ============================================================

-- Neue Spalten für Website-Verifikationsstatus
ALTER TABLE startups
    ADD COLUMN IF NOT EXISTS website_verifiziert     BOOLEAN   DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS website_zuletzt_geprueft TIMESTAMP DEFAULT NULL;

-- Index für effizienten Filter nach Verifikationsstatus im Matching-Query
CREATE INDEX IF NOT EXISTS idx_startups_website_verifiziert
    ON startups (website_verifiziert)
    WHERE website IS NOT NULL;

-- Kommentar zur Semantik der Spalte
COMMENT ON COLUMN startups.website_verifiziert IS
    'NULL = noch nicht geprüft | TRUE = HTTP < 400 (erreichbar) | FALSE = Timeout/4xx/5xx (tot)';

COMMENT ON COLUMN startups.website_zuletzt_geprueft IS
    'Zeitstempel der letzten HTTP-Prüfung (UTC)';
