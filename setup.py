"""
Innovation Republic – Setup-Skript
====================================
Initialisiert das Datenbankschema, befüllt Seed-Daten und startet
optional den ersten Ingestion-Lauf.

Aufruf: python setup.py
"""

import os
import sys
import subprocess
from pathlib import Path

import psycopg2
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

# Pfad zur Schema-Datei
SCHEMA_PFAD = Path(__file__).parent / "db" / "schema.sql"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ir_user:ir_password@localhost:5432/innovation_republic"
)


def initialisiere_schema():
    """Spielt das SQL-Schema in die Datenbank ein."""
    logger.info("Initialisiere Datenbankschema...")
    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    try:
        with conn.cursor() as cur:
            schema_sql = SCHEMA_PFAD.read_text(encoding="utf-8")
            cur.execute(schema_sql)
        conn.commit()
        logger.success("Schema erfolgreich eingespielt")
    except Exception as e:
        conn.rollback()
        logger.error(f"Schema-Fehler: {e}")
        raise
    finally:
        conn.close()


def befuelle_kmu_seed_daten():
    """
    Befüllt kmu_profile mit 8 typischen Mittelstands-Problemformulierungen.
    Diese sind bewusst unspezifisch und ohne Fachjargon formuliert,
    um das natürliche Suchverhalten von KMU-Vertretern abzubilden.
    """
    from core.embedding import erstelle_embedding

    kmu_profile = [
        {
            "name": "Mustermann Metallbau GmbH",
            "branche": "Metallverarbeitung",
            "problem": (
                "Wir verlieren zu viel Zeit bei der Einarbeitung neuer Mitarbeiter "
                "und finden kaum Fachkräfte. Die Fluktuation ist hoch und das Wissen "
                "geht verloren wenn jemand das Unternehmen verlässt."
            ),
        },
        {
            "name": "Becker Logistics KG",
            "branche": "Logistik",
            "problem": (
                "Unsere Lieferungen kommen oft zu spät weil wir nicht wissen wo "
                "unsere Fahrer gerade sind. Sprit und Zeit werden verschwendet weil "
                "die Routen nicht optimal geplant werden."
            ),
        },
        {
            "name": "Schreiber Maschinenbau AG",
            "branche": "Maschinenbau",
            "problem": (
                "Maschinen fallen ohne Vorwarnung aus und der Produktionsstopp "
                "kostet uns jeden Monat Zehntausende Euro. Wir wissen nie wann "
                "eine Wartung wirklich nötig ist – entweder zu früh oder zu spät."
            ),
        },
        {
            "name": "Huber Textil GmbH",
            "branche": "Textilproduktion",
            "problem": (
                "Bei der Qualitätsprüfung unserer Produkte schleichen sich immer "
                "wieder Fehler durch die dann beim Kunden ankommen. Die manuelle "
                "Sichtkontrolle ist zu langsam und unzuverlässig."
            ),
        },
        {
            "name": "Weber Bäckerei & Konditorei",
            "branche": "Lebensmittelproduktion",
            "problem": (
                "Unsere Energiekosten sind in den letzten zwei Jahren explodiert. "
                "Wir wissen nicht genau wo der meiste Strom verbraucht wird und "
                "können deshalb nicht gezielt sparen."
            ),
        },
        {
            "name": "Zimmermann Elektronik GmbH",
            "branche": "Elektronikmontage",
            "problem": (
                "Wir produzieren jeden Monat Tonnen von Abfall durch Ausschuss "
                "und verbrauchte Materialien. Das kostet Geld und ist schlecht "
                "für die Umwelt – aber wir wissen nicht wie wir das ändern sollen."
            ),
        },
        {
            "name": "Fischer Autoteile GmbH",
            "branche": "Automobilzulieferer",
            "problem": (
                "Unsere Buchhaltung und Auftragsabwicklung laufen noch großteils "
                "auf Papier. Jede Rechnung wird zweimal getippt und Fehler passieren "
                "ständig. Das kostet uns wertvolle Mitarbeiterstunden täglich."
            ),
        },
        {
            "name": "Braun Pharmaverpackung GmbH",
            "branche": "Verpackungsindustrie",
            "problem": (
                "Wir können keine guten Leute mehr finden weil unser Bewerbungsprozess "
                "ewig dauert und wir oft erst nach Wochen zurückmelden. Bis wir uns "
                "entschieden haben sind die besten Kandidaten schon weg."
            ),
        },
    ]

    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    try:
        with conn.cursor() as cur:
            # Prüfe ob bereits Daten vorhanden
            cur.execute("SELECT COUNT(*) FROM kmu_profile")
            if cur.fetchone()[0] > 0:
                logger.info("KMU-Seed-Daten bereits vorhanden – überspringe")
                return

            logger.info(f"Füge {len(kmu_profile)} KMU-Profile ein...")
            for kmu in kmu_profile:
                embedding = erstelle_embedding(kmu["problem"])
                cur.execute(
                    """
                    INSERT INTO kmu_profile (name, branche, problem_beschreibung, embedding)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (kmu["name"], kmu["branche"], kmu["problem"], embedding.tolist()),
                )
        conn.commit()
        logger.success(f"{len(kmu_profile)} KMU-Profile erfolgreich eingefügt")
    except Exception as e:
        conn.rollback()
        logger.error(f"KMU-Seed-Fehler: {e}")
        raise
    finally:
        conn.close()


def befuelle_startup_seed_daten():
    """
    Befüllt startups mit 15 synthetischen Demo-Profilen (demo_only=true).
    Wird nur ausgeführt wenn noch keine Startups in der Datenbank sind.
    Dient als Fallback falls keine externen APIs verfügbar sind.
    """
    from core.embedding import erstelle_embedding

    # 15 realistische synthetische Startups aus allen 7 Kategorien
    demo_startups = [
        # Prozessautomatisierung
        {
            "name": "AutoFlow GmbH",
            "beschreibung": (
                "AutoFlow automatisiert wiederkehrende Geschäftsprozesse für "
                "mittelständische Produktionsunternehmen mithilfe von KI-gestützter "
                "Robotic Process Automation. Nahtlose Integration in bestehende "
                "ERP-Systeme ohne Programmieraufwand."
            ),
            "tags": ["Automatisierung", "RPA", "ERP-Integration"],
            "kategorie": "Prozessautomatisierung",
            "land": "Deutschland",
        },
        {
            "name": "WorkflowAI AG",
            "beschreibung": (
                "Intelligente Workflow-Plattform die manuelle Prozesse in der "
                "Verwaltung und Auftragsabwicklung vollständig digitalisiert. "
                "Besonders geeignet für Unternehmen mit 50–500 Mitarbeitern."
            ),
            "tags": ["Workflow", "Digitalisierung", "KMU"],
            "kategorie": "Prozessautomatisierung",
            "land": "Österreich",
        },
        {
            "name": "PaperFree Solutions GmbH",
            "beschreibung": (
                "Eliminiert papierbasierte Prozesse durch intelligente Dokumenten-"
                "erkennung und automatische Weiterleitung. Reduziert Bearbeitungszeiten "
                "um bis zu 80 Prozent bei Eingangsrechnungen und Lieferscheinen."
            ),
            "tags": ["Dokumentenmanagement", "OCR", "Automatisierung"],
            "kategorie": "Prozessautomatisierung",
            "land": "Deutschland",
        },
        # Predictive Maintenance
        {
            "name": "SensorGuard GmbH",
            "beschreibung": (
                "IoT-Plattform für vorausschauende Maschinenwartung. Sensoren "
                "überwachen Vibration, Temperatur und Lautstärke in Echtzeit und "
                "sagen Ausfälle bis zu 14 Tage im Voraus vorher."
            ),
            "tags": ["IoT", "Predictive Maintenance", "Maschinenbau"],
            "kategorie": "Predictive Maintenance",
            "land": "Deutschland",
        },
        {
            "name": "MaintenanceAI GmbH",
            "beschreibung": (
                "KI-basiertes Wartungsmanagement-System das Maschinendaten aus "
                "bestehenden SCADA-Systemen analysiert. Keine zusätzliche Hardware "
                "nötig – Plug-and-Play-Integration."
            ),
            "tags": ["KI", "Wartung", "SCADA", "Industrie 4.0"],
            "kategorie": "Predictive Maintenance",
            "land": "Schweiz",
        },
        # Nachhaltige Logistik
        {
            "name": "GreenRoute GmbH",
            "beschreibung": (
                "CO2-optimierte Routenplanung für Liefer- und Transportunternehmen. "
                "KI berechnet täglich die effizientesten Routen unter Berücksichtigung "
                "von Stau, Ladegewicht und Emissionen."
            ),
            "tags": ["Logistik", "CO2", "Routenoptimierung", "Nachhaltigkeit"],
            "kategorie": "Nachhaltige Logistik",
            "land": "Deutschland",
        },
        {
            "name": "EcoLogix AG",
            "beschreibung": (
                "Nachhaltige Lieferkettenoptimierung mit Echtzeit-Tracking und "
                "CO2-Bilanzierung pro Sendung. Ermöglicht Unternehmen ihren Kunden "
                "transparente Klimabilanzen für jede Lieferung bereitzustellen."
            ),
            "tags": ["Supply Chain", "Tracking", "Nachhaltigkeit"],
            "kategorie": "Nachhaltige Logistik",
            "land": "Österreich",
        },
        # Digitale Qualitätssicherung
        {
            "name": "QualityVision GmbH",
            "beschreibung": (
                "Automatische Sichtprüfung durch Computer Vision erkennt Produktfehler "
                "in der laufenden Produktion mit höherer Genauigkeit als menschliche "
                "Kontrolle. Echtzeit-Alarmierung bei Qualitätsabweichungen."
            ),
            "tags": ["Computer Vision", "Qualitätssicherung", "Produktion"],
            "kategorie": "Digitale Qualitätssicherung",
            "land": "Deutschland",
        },
        {
            "name": "InspectAI AG",
            "beschreibung": (
                "KI-gestützte Qualitätskontrolle für Serienproduktion. Das System "
                "lernt aus Fehlern und verbessert sich kontinuierlich. Integration "
                "in bestehende Kamerainfrastruktur möglich."
            ),
            "tags": ["KI", "Inspektion", "Automatisierung"],
            "kategorie": "Digitale Qualitätssicherung",
            "land": "Schweiz",
        },
        # Energieeffizienz
        {
            "name": "EnergySense GmbH",
            "beschreibung": (
                "Smart-Energy-Management-System das den Energieverbrauch in "
                "Produktionshallen auf Maschinenebene überwacht und Einsparpotenziale "
                "automatisch identifiziert. Amortisation typisch nach 18 Monaten."
            ),
            "tags": ["Energie", "Smart Building", "IoT", "Einsparung"],
            "kategorie": "Energieeffizienz",
            "land": "Deutschland",
        },
        {
            "name": "PowerOptimize GmbH",
            "beschreibung": (
                "Optimiert industriellen Energieverbrauch durch intelligente "
                "Laststeuerung und Spitzenlastmanagement. Reduziert Energiekosten "
                "um durchschnittlich 23 Prozent ohne Investitionen in neue Anlagen."
            ),
            "tags": ["Lastmanagement", "Energieoptimierung", "Industrie"],
            "kategorie": "Energieeffizienz",
            "land": "Österreich",
        },
        # HR-Tech
        {
            "name": "TalentBridge GmbH",
            "beschreibung": (
                "KI-gestütztes Recruiting-System das Stellenanzeigen automatisch "
                "optimiert und eingehende Bewerbungen vorqualifiziert. Verkürzt "
                "den Einstellungsprozess von 8 Wochen auf unter 2 Wochen."
            ),
            "tags": ["Recruiting", "HR", "KI", "Bewerbungsmanagement"],
            "kategorie": "HR-Tech",
            "land": "Deutschland",
        },
        {
            "name": "SkillMatch AG",
            "beschreibung": (
                "Digitale Wissensmanagement- und Onboarding-Plattform die "
                "Unternehmenswissen strukturiert und neue Mitarbeiter schnell "
                "einarbeitet. Reduziert Einarbeitungszeit um bis zu 60 Prozent."
            ),
            "tags": ["Onboarding", "Wissensmanagement", "HR", "E-Learning"],
            "kategorie": "HR-Tech",
            "land": "Schweiz",
        },
        # Zirkulärwirtschaft
        {
            "name": "CircularFlow GmbH",
            "beschreibung": (
                "Kreislaufwirtschafts-Plattform für die Industrie: vernetzt "
                "Unternehmen um Abfälle als Rohstoffe weiterzuverwenden. "
                "Automatisches Matching von Materialangebot und -nachfrage."
            ),
            "tags": ["Kreislaufwirtschaft", "Recycling", "B2B", "Nachhaltigkeit"],
            "kategorie": "Zirkulärwirtschaft",
            "land": "Deutschland",
        },
        {
            "name": "ReUseIt AG",
            "beschreibung": (
                "Digitaler Marktplatz für industrielle Sekundärrohstoffe und "
                "Restmaterialien. Hilft Unternehmen Entsorgungskosten zu senken "
                "und gleichzeitig neue Einnahmequellen aus Abfallströmen zu erschließen."
            ),
            "tags": ["Materialrückgewinnung", "Marktplatz", "Kreislaufwirtschaft"],
            "kategorie": "Zirkulärwirtschaft",
            "land": "Österreich",
        },
    ]

    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    try:
        with conn.cursor() as cur:
            # Prüfe ob bereits Startups vorhanden
            cur.execute("SELECT COUNT(*) FROM startups")
            if cur.fetchone()[0] > 0:
                logger.info("Startup-Seed-Daten bereits vorhanden – überspringe")
                return

            logger.info(f"Füge {len(demo_startups)} Demo-Startups ein...")
            for i, startup in enumerate(demo_startups):
                embedding = erstelle_embedding(
                    f"{startup['name']} {startup['beschreibung']}"
                )
                cur.execute(
                    """
                    INSERT INTO startups
                        (name, beschreibung, branchen_tags, loesung_kategorie,
                         quelle, externe_id, embedding, land, demo_only)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        startup["name"],
                        startup["beschreibung"],
                        startup["tags"],
                        startup["kategorie"],
                        "demo_seed",
                        f"demo_{i+1:03d}",
                        embedding.tolist(),
                        startup["land"],
                        True,  # demo_only = true → wird via cleanup_demo_data.py entfernt
                    ),
                )
        conn.commit()
        logger.success(f"{len(demo_startups)} Demo-Startups erfolgreich eingefügt")
    except Exception as e:
        conn.rollback()
        logger.error(f"Startup-Seed-Fehler: {e}")
        raise
    finally:
        conn.close()


def starte_ingestion():
    """Startet den ersten Datenimport aus allen verfügbaren Quellen."""
    logger.info("Starte Ingestion-Pipeline...")
    try:
        from ingestion import starte_alle_quellen
        starte_alle_quellen()
    except Exception as e:
        logger.warning(
            f"Ingestion fehlgeschlagen (Demo-Daten bleiben verfügbar): {e}"
        )


def main():
    logger.info("=" * 60)
    logger.info("Innovation Republic – Setup wird gestartet")
    logger.info("=" * 60)

    # 1. Datenbankschema einrichten
    initialisiere_schema()

    # 2. Sprachmodell vorab herunterladen (cached lokal)
    logger.info("Lade Sprachmodell (paraphrase-multilingual-MiniLM-L12-v2)...")
    try:
        from core.embedding import get_model
        get_model()
        logger.success("Sprachmodell erfolgreich geladen")
    except Exception as e:
        logger.error(f"Sprachmodell konnte nicht geladen werden: {e}")
        sys.exit(1)

    # 3. KMU-Seed-Daten einfügen
    befuelle_kmu_seed_daten()

    # 4. Startup-Seed-Daten als Fallback einfügen
    befuelle_startup_seed_daten()

    # 5. Ersten Ingestion-Lauf starten (optional, schlägt fehl falls kein API-Key)
    starte_ingestion()

    logger.info("=" * 60)
    logger.success("Setup abgeschlossen! System ist einsatzbereit.")
    logger.info("Starte die App mit: streamlit run app.py")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
