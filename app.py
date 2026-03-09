"""
Innovation Republic – Streamlit Haupt-Interface
================================================
Semantisches Matching-System für KMU-Problembeschreibungen.
Findet passende Startups über pgvector cosine similarity.

Starten lokal:  streamlit run app.py
Cloud-Hosting:  Streamlit Cloud + Supabase (pgvector)
"""

import os
from pathlib import Path

import streamlit as st
from loguru import logger

# ---- Seitenkonfiguration ----
st.set_page_config(
    page_title="Innovation Republic – Startup Matching",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ============================================================
# AUTO-INIT: Läuft einmalig pro Server-Start (Streamlit Cloud)
# Richtet DB-Schema, Migration und Basisdaten automatisch ein.
# ============================================================
@st.cache_resource(show_spinner=False)
def _initialisiere_system():
    """
    Einmalige Systeminitialisierung beim App-Start.
    Sicher bei Mehrfachaufrufen (alle DDL-Statements nutzen IF NOT EXISTS).
    """
    import psycopg2
    from pgvector.psycopg2 import register_vector

    # Streamlit Cloud Secrets haben Vorrang vor .env
    db_url = os.getenv(
        "DATABASE_URL",
        "postgresql://ir_user:ir_password@localhost:5432/innovation_republic"
    )
    if hasattr(st, "secrets") and "DATABASE_URL" in st.secrets:
        db_url = st.secrets["DATABASE_URL"]
    if hasattr(st, "secrets") and "ANTHROPIC_API_KEY" in st.secrets:
        os.environ["ANTHROPIC_API_KEY"] = st.secrets["ANTHROPIC_API_KEY"]

    try:
        conn = psycopg2.connect(db_url)
        register_vector(conn)
    except Exception as e:
        return False, f"Datenbankverbindung fehlgeschlagen: {e}"

    # 1. Schema einrichten (IF NOT EXISTS – sicher bei Wiederholung)
    schema_sql = (Path(__file__).parent / "db" / "schema.sql").read_text()
    try:
        with conn.cursor() as cur:
            cur.execute(schema_sql)
        conn.commit()
    except Exception:
        conn.rollback()

    # 2. Migration 002 (website_verifiziert) – falls noch nicht vorhanden
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT column_name FROM information_schema.columns
                WHERE table_name = 'startups'
                  AND column_name = 'website_verifiziert'
            """)
            if not cur.fetchone():
                migration_sql = (
                    Path(__file__).parent
                    / "db" / "migrations" / "002_website_verification.sql"
                ).read_text()
                cur.execute(migration_sql)
                conn.commit()
                logger.info("Migration 002 (website_verifiziert) eingespielt")
    except Exception as e:
        conn.rollback()
        logger.warning(f"Migration 002 übersprungen: {e}")

    # 3. Ingestion wenn noch keine echten Daten vorhanden
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM startups WHERE demo_only = FALSE")
            echte_startups = cur.fetchone()[0]
        conn.close()

        if echte_startups == 0:
            logger.info("Keine echten Startups – starte Erstbefüllung...")
            from ingestion import starte_alle_quellen
            starte_alle_quellen()
    except Exception as e:
        logger.warning(f"Ingestion beim Start übersprungen: {e}")

    return True, "OK"


# Initialisierung ausführen (cached – läuft nur einmal pro Deploy)
_init_ok, _init_msg = _initialisiere_system()
if not _init_ok:
    st.error(f"⚠️ Datenbankfehler: {_init_msg}")
    st.info("Bitte **DATABASE_URL** in den App-Secrets konfigurieren (Supabase-URI).")
    st.stop()


# ---- Übersetzungen (Deutsch/Englisch) ----
TEXTE = {
    "de": {
        "titel": "🚀 Innovation Republic",
        "untertitel": "Semantisches Startup-Matching für den Mittelstand",
        "eingabe_label": "Beschreiben Sie Ihr Problem in eigenen Worten",
        "eingabe_placeholder": (
            "Beispiel: Wir verlieren zu viel Zeit bei der Einarbeitung neuer "
            "Mitarbeiter und finden kaum Fachkräfte..."
        ),
        "button": "Matching starten",
        "ergebnisse_titel": "🎯 Beste Startup-Matches",
        "score_label": "Übereinstimmung",
        "diagnose_titel": "🔍 Problemdiagnose",
        "diagnose_kategorie": "Erkannte Kategorie",
        "diagnose_loesung": "Empfohlene Lösungsrichtung",
        "aehnliche_faelle": "Ähnliche Fälle aus dem Mittelstand",
        "seitenleiste_titel": "📊 Datenbankstatistik",
        "seitenleiste_gesamt": "Startups gesamt",
        "seitenleiste_aktualisieren": "🔄 Daten aktualisieren",
        "aktualisierung_laeuft": "Ingestion-Pipeline läuft...",
        "aktualisierung_fertig": "Daten erfolgreich aktualisiert!",
        "keine_ergebnisse": "Keine Startups gefunden. Bitte starten Sie zuerst setup.py.",
        "verifiziert_badge": "✓ Verifiziert",
        "demo_badge": "Demo",
        "quelle_badge": "Quelle",
        "sprache_button": "🇬🇧 English",
        "website_label": "Website",
        "website_verifiziert_tooltip": "Website geprüft und erreichbar",
        "konfidenz": "Konfidenz",
        "eingabe_zu_kurz": "Bitte beschreiben Sie Ihr Problem ausführlicher (mind. 20 Zeichen).",
        "laden": "Analysiere Problem und suche passende Startups...",
    },
    "en": {
        "titel": "🚀 Innovation Republic",
        "untertitel": "Semantic Startup Matching for SMEs",
        "eingabe_label": "Describe your problem in your own words",
        "eingabe_placeholder": (
            "Example: We lose too much time onboarding new employees "
            "and can barely find skilled workers..."
        ),
        "button": "Start Matching",
        "ergebnisse_titel": "🎯 Best Startup Matches",
        "score_label": "Match Score",
        "diagnose_titel": "🔍 Problem Diagnosis",
        "diagnose_kategorie": "Detected Category",
        "diagnose_loesung": "Recommended Solution Direction",
        "aehnliche_faelle": "Similar Cases from SMEs",
        "seitenleiste_titel": "📊 Database Statistics",
        "seitenleiste_gesamt": "Total Startups",
        "seitenleiste_aktualisieren": "🔄 Update Data",
        "aktualisierung_laeuft": "Ingestion pipeline running...",
        "aktualisierung_fertig": "Data successfully updated!",
        "keine_ergebnisse": "No startups found. Please run setup.py first.",
        "verifiziert_badge": "✓ Verified",
        "demo_badge": "Demo",
        "quelle_badge": "Source",
        "sprache_button": "🇩🇪 Deutsch",
        "website_label": "Website",
        "konfidenz": "Confidence",
        "eingabe_zu_kurz": "Please describe your problem in more detail (at least 20 characters).",
        "laden": "Analyzing problem and searching for matching startups...",
    },
}

# ---- Session-State initialisieren ----
if "sprache" not in st.session_state:
    st.session_state.sprache = "de"

if "matching_ergebnisse" not in st.session_state:
    st.session_state.matching_ergebnisse = []

if "diagnose" not in st.session_state:
    st.session_state.diagnose = None

# ---- Aktive Sprache ----
T = TEXTE[st.session_state.sprache]

# ---- Quellen-Farben und Badges ----
QUELLEN_FARBEN = {
    "dealroom": "#2563EB",       # Blau
    "eu_startup_monitor": "#059669",  # Grün
    "angellist": "#7C3AED",     # Lila
    "crunchbase": "#D97706",    # Orange
    "demo_seed": "#6B7280",     # Grau
    "self-onboarding": "#DC2626",  # Rot
    "mehrere": "#374151",       # Dunkelgrau
}

QUELLEN_NAMEN = {
    "dealroom": "Dealroom",
    "eu_startup_monitor": "EU Startup Monitor",
    "angellist": "AngelList",
    "crunchbase": "Crunchbase",
    "demo_seed": "Demo",
    "self-onboarding": "Self-Onboarding",
    "mehrere": "Mehrere Quellen",
}


def zeige_startup_kachel(match: dict, rang: int, T: dict):
    """Rendert eine Startup-Kachel mit Score-Balken und Quellen-Badge."""
    score = float(match.get("similarity_score", 0))
    quelle = match.get("quelle", "unbekannt")
    ist_dealroom = quelle == "dealroom"
    ist_demo = match.get("demo_only", False)

    # Kachel-Container
    with st.container():
        # Rang + Name + Badges in einer Zeile
        col_name, col_badge = st.columns([3, 1])

        with col_name:
            rang_emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][min(rang - 1, 4)]
            st.markdown(f"### {rang_emoji} {match['name']}")

        with col_badge:
            # Dealroom bekommt Verifiziert-Badge (höchste Datenqualität)
            if ist_dealroom:
                st.success(T["verifiziert_badge"])
            elif ist_demo:
                st.warning(T["demo_badge"])
            else:
                farbe = QUELLEN_FARBEN.get(quelle, "#6B7280")
                name = QUELLEN_NAMEN.get(quelle, quelle)
                st.markdown(
                    f'<span style="background:{farbe};color:white;padding:3px 8px;'
                    f'border-radius:4px;font-size:0.8em;">{name}</span>',
                    unsafe_allow_html=True,
                )

        # Beschreibung
        beschreibung = match.get("beschreibung", "")
        if beschreibung:
            st.markdown(f"_{beschreibung[:250]}{'...' if len(beschreibung) > 250 else ''}_")

        # Score-Balken
        col_score, col_pct = st.columns([4, 1])
        with col_score:
            st.progress(min(score, 1.0))
        with col_pct:
            st.markdown(f"**{score:.0%}**")
        st.caption(f"{T['score_label']}: {score:.3f}")

        # Meta-Infos
        meta_cols = st.columns(3)
        with meta_cols[0]:
            kategorie = match.get("loesung_kategorie")
            if kategorie:
                st.caption(f"📂 {kategorie}")
        with meta_cols[1]:
            land = match.get("land")
            if land:
                st.caption(f"📍 {land}")
        with meta_cols[2]:
            website = match.get("website")
            website_verifiziert = match.get("website_verifiziert")
            if website:
                # Verifikationsstatus-Indikator neben dem Link
                if website_verifiziert is True:
                    status_icon = "✅ "   # Geprüft & erreichbar
                elif website_verifiziert is None:
                    status_icon = "🔗 "  # Noch nicht geprüft
                else:
                    status_icon = "⚠️ "  # Sollte durch Filter ausgeblendet sein
                st.caption(f"{status_icon}[{T['website_label']}]({website})")

        st.divider()


def zeige_diagnose(diagnose, T: dict):
    """Rendert die Diagnose-Box mit Kategorie und Lösungsrichtung."""
    if not diagnose:
        return

    with st.expander(T["diagnose_titel"], expanded=True):
        col_kat, col_konfidenz = st.columns([2, 1])

        with col_kat:
            st.markdown(f"**{T['diagnose_kategorie']}:** {diagnose.kategorie}")
        with col_konfidenz:
            st.metric(
                T["konfidenz"],
                f"{diagnose.konfidenz:.0%}",
            )

        st.info(f"💡 **{T['diagnose_loesung']}**\n\n{diagnose.loesung}")

        # Ähnliche KMU-Fälle
        if diagnose.aehnliche_faelle:
            st.markdown(f"**{T['aehnliche_faelle']}:**")
            for fall in diagnose.aehnliche_faelle:
                aehnlichkeit = fall.get("aehnlichkeit", 0)
                st.markdown(
                    f"- *{fall.get('name', '')}* ({fall.get('branche', '')}): "
                    f'"{fall.get("problem_beschreibung", "")[:120]}..." '
                    f"– {aehnlichkeit:.0%} ähnlich"
                )

        # Alle Kategorien als Mini-Balkendiagramm
        if diagnose.alle_kategorien:
            st.markdown("**Kategorie-Verteilung:**")
            for kat, score in sorted(
                diagnose.alle_kategorien.items(),
                key=lambda x: x[1],
                reverse=True,
            )[:4]:
                col_k, col_b, col_v = st.columns([2, 3, 1])
                with col_k:
                    st.caption(kat)
                with col_b:
                    st.progress(min(score, 1.0))
                with col_v:
                    st.caption(f"{score:.0%}")


# ============================================================
# LAYOUT
# ============================================================

# ---- Seitenleiste ----
with st.sidebar:
    st.markdown(T["seitenleiste_titel"])

    # Datenbankstatistik
    try:
        from db import zaehle_startups_pro_quelle, zaehle_gesamt_startups
        gesamt = zaehle_gesamt_startups()
        pro_quelle = zaehle_startups_pro_quelle()

        st.metric(T["seitenleiste_gesamt"], gesamt)
        st.divider()

        for quelle, anzahl in pro_quelle.items():
            name = QUELLEN_NAMEN.get(quelle, quelle)
            st.caption(f"**{name}:** {anzahl}")

    except Exception:
        st.caption("Datenbank nicht verbunden. Bitte setup.py ausführen.")

    st.divider()

    # Ingestion-Button
    if st.button(T["seitenleiste_aktualisieren"], use_container_width=True):
        with st.spinner(T["aktualisierung_laeuft"]):
            try:
                from ingestion import starte_alle_quellen
                starte_alle_quellen()
                st.success(T["aktualisierung_fertig"])
                st.rerun()
            except Exception as e:
                st.error(f"Fehler: {e}")

    st.divider()

    # Sprachumschalter (oben rechts in der Seitenleiste)
    if st.button(T["sprache_button"], use_container_width=True):
        st.session_state.sprache = "en" if st.session_state.sprache == "de" else "de"
        st.rerun()

# ---- Hauptbereich ----
st.title(T["titel"])
st.markdown(f"*{T['untertitel']}*")
st.divider()

# Eingabefeld
problem_text = st.text_area(
    T["eingabe_label"],
    placeholder=T["eingabe_placeholder"],
    height=120,
    key="problem_eingabe",
)

# Matching-Button
col_btn, col_space = st.columns([1, 3])
with col_btn:
    matching_geklickt = st.button(
        T["button"],
        type="primary",
        use_container_width=True,
    )

# ---- Matching ausführen ----
if matching_geklickt:
    if not problem_text or len(problem_text.strip()) < 20:
        st.warning(T["eingabe_zu_kurz"])
    else:
        with st.spinner(T["laden"]):
            try:
                from core.matching import match_startup_to_kmu
                from core.diagnosis import diagnose_problem

                ergebnisse = match_startup_to_kmu(problem_text, limit=5)
                diagnose = diagnose_problem(problem_text)

                st.session_state.matching_ergebnisse = ergebnisse
                st.session_state.diagnose = diagnose
                st.session_state.letzter_suchtext = problem_text

            except Exception as e:
                st.error(f"Fehler beim Matching: {e}")
                logger.error(f"Matching-Fehler: {e}")

# ---- Ergebnisse anzeigen ----
if st.session_state.matching_ergebnisse:
    st.divider()

    # Diagnose-Box
    zeige_diagnose(st.session_state.diagnose, T)

    # Top-3 Startup-Kacheln (prominenter)
    st.subheader(T["ergebnisse_titel"])

    ergebnisse = st.session_state.matching_ergebnisse
    top3 = ergebnisse[:3]
    rest = ergebnisse[3:]

    # Top 3 nebeneinander
    cols = st.columns(3)
    for i, (col, match) in enumerate(zip(cols, top3)):
        with col:
            zeige_startup_kachel(match, i + 1, T)

    # Plätze 4 und 5 untereinander (falls vorhanden)
    if rest:
        st.markdown("---")
        for i, match in enumerate(rest, start=4):
            zeige_startup_kachel(match, i, T)

elif matching_geklickt and not st.session_state.matching_ergebnisse:
    st.info(T["keine_ergebnisse"])

# ---- Footer ----
st.divider()
st.caption(
    "Innovation Republic e.V. | Semantisches Matching-System | "
    "Powered by sentence-transformers + pgvector"
)
