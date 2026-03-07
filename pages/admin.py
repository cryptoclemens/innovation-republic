"""
Innovation Republic – Admin-Interface
=====================================
Passwortgeschütztes Interface zur Moderation eingreichter Startup-Profile.
Freischaltung → Profil wandert in startups-Tabelle
Ablehnung → Status auf 'rejected' gesetzt

Zugang: ADMIN_PASSWORD in .env konfigurieren
"""

import os
import subprocess
import sys

import streamlit as st
from psycopg2.extras import RealDictCursor
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

st.set_page_config(
    page_title="Admin – Innovation Republic",
    page_icon="🔐",
    layout="wide",
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

# ---- Authentifizierung ----
if "admin_eingeloggt" not in st.session_state:
    st.session_state.admin_eingeloggt = False


def zeige_login():
    """Zeigt das Login-Formular."""
    st.title("🔐 Admin-Zugang")
    st.markdown("Bitte melden Sie sich an um das Admin-Interface zu nutzen.")

    with st.form("login_form"):
        passwort = st.text_input("Passwort", type="password")
        einloggen = st.form_submit_button("Anmelden", type="primary")

    if einloggen:
        if passwort == ADMIN_PASSWORD:
            st.session_state.admin_eingeloggt = True
            logger.info("Admin-Login erfolgreich")
            st.rerun()
        else:
            st.error("Falsches Passwort")


def lade_pending_startups():
    """Lädt alle Startups mit Status 'pending' aus der Datenbank."""
    try:
        from db import get_db
        with get_db() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT
                        id, name, beschreibung, branchen_tags,
                        loesung_kategorie, website, ansprechpartner_email,
                        status, eingereicht_am
                    FROM startups_pending
                    WHERE status = 'pending'
                    ORDER BY eingereicht_am DESC
                """)
                return [dict(r) for r in cur.fetchall()]
    except Exception as e:
        st.error(f"Datenbankfehler: {e}")
        return []


def schalte_frei(pending_id: int):
    """Verschiebt einen Eintrag aus startups_pending nach startups."""
    try:
        from db import get_db
        with get_db() as conn:
            register_vector(conn)
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Eintrag aus pending laden
                cur.execute(
                    "SELECT * FROM startups_pending WHERE id = %s",
                    (pending_id,),
                )
                eintrag = cur.fetchone()
                if not eintrag:
                    st.error("Eintrag nicht gefunden")
                    return

                # In startups einfügen
                cur.execute(
                    """
                    INSERT INTO startups
                        (name, beschreibung, branchen_tags, loesung_kategorie,
                         quelle, embedding, website, demo_only)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        eintrag["name"],
                        eintrag["beschreibung"],
                        eintrag["branchen_tags"],
                        eintrag["loesung_kategorie"],
                        "self-onboarding",
                        eintrag["embedding"],
                        eintrag["website"],
                        False,
                    ),
                )

                # Status in pending aktualisieren
                cur.execute(
                    "UPDATE startups_pending SET status = 'approved' WHERE id = %s",
                    (pending_id,),
                )

        logger.info(
            f"Startup '{eintrag['name']}' (ID: {pending_id}) freigeschaltet"
        )
        return True

    except Exception as e:
        logger.error(f"Freischaltung fehlgeschlagen: {e}")
        st.error(f"Fehler: {e}")
        return False


def lehne_ab(pending_id: int):
    """Setzt den Status eines Eintrags auf 'rejected'."""
    try:
        from db import get_db
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE startups_pending SET status = 'rejected' WHERE id = %s",
                    (pending_id,),
                )
        logger.info(f"Startup ID {pending_id} abgelehnt")
        return True
    except Exception as e:
        st.error(f"Fehler: {e}")
        return False


def zeige_statistiken():
    """Zeigt Übersichtsstatistiken zur Datenbank."""
    try:
        from db import get_db, zaehle_startups_pro_quelle, zaehle_gesamt_startups
        with get_db() as conn:
            with conn.cursor() as cur:
                # Pending-Zahlen
                cur.execute(
                    "SELECT status, COUNT(*) FROM startups_pending GROUP BY status"
                )
                pending_stats = dict(cur.fetchall())

                # Demo-Daten
                cur.execute(
                    "SELECT COUNT(*) FROM startups WHERE demo_only = TRUE"
                )
                demo_anzahl = cur.fetchone()[0]

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Startups gesamt", zaehle_gesamt_startups())
        with col2:
            st.metric("Ausstehend", pending_stats.get("pending", 0))
        with col3:
            st.metric("Freigeschaltet", pending_stats.get("approved", 0))
        with col4:
            st.metric("Demo-Daten", demo_anzahl)

    except Exception as e:
        st.warning(f"Statistiken nicht verfügbar: {e}")


def zeige_admin_interface():
    """Haupt-Admin-Interface."""

    # Header
    col_titel, col_logout = st.columns([4, 1])
    with col_titel:
        st.title("🔐 Admin-Interface")
        st.markdown("*Innovation Republic – Startup-Moderation*")
    with col_logout:
        if st.button("Abmelden"):
            st.session_state.admin_eingeloggt = False
            st.rerun()

    st.divider()

    # Statistiken
    zeige_statistiken()
    st.divider()

    # Tabs
    tab_pending, tab_alle, tab_tools = st.tabs([
        "📥 Ausstehende Profile",
        "📋 Alle Einreichungen",
        "🛠️ Admin-Tools",
    ])

    # ---- Tab 1: Ausstehende Profile moderieren ----
    with tab_pending:
        st.subheader("Ausstehende Startup-Profile")

        pending = lade_pending_startups()

        if not pending:
            st.info("Keine ausstehenden Einreichungen – alles auf dem neuesten Stand! ✅")
        else:
            st.markdown(f"**{len(pending)} Profil(e) warten auf Freischaltung:**")

            for eintrag in pending:
                with st.expander(
                    f"📌 {eintrag['name']} – eingereicht am "
                    f"{eintrag['eingereicht_am'].strftime('%d.%m.%Y %H:%M') if eintrag['eingereicht_am'] else 'unbekannt'}",
                    expanded=False,
                ):
                    col_info, col_aktionen = st.columns([3, 1])

                    with col_info:
                        st.markdown(f"**Beschreibung:**\n{eintrag['beschreibung'] or '–'}")
                        st.markdown(
                            f"**Bereiche:** {', '.join(eintrag['branchen_tags'] or []) or '–'}"
                        )
                        if eintrag["website"]:
                            st.markdown(f"**Website:** {eintrag['website']}")
                        st.caption(
                            f"Kontakt: {eintrag['ansprechpartner_email'] or '–'} "
                            f"(intern, wird nicht angezeigt)"
                        )

                    with col_aktionen:
                        # Freischalten
                        if st.button(
                            "✅ Freischalten",
                            key=f"frei_{eintrag['id']}",
                            type="primary",
                            use_container_width=True,
                        ):
                            if schalte_frei(eintrag["id"]):
                                st.success(f"'{eintrag['name']}' wurde freigeschaltet!")
                                st.rerun()

                        # Ablehnen
                        if st.button(
                            "❌ Ablehnen",
                            key=f"ablehnen_{eintrag['id']}",
                            use_container_width=True,
                        ):
                            if lehne_ab(eintrag["id"]):
                                st.warning(f"'{eintrag['name']}' wurde abgelehnt.")
                                st.rerun()

    # ---- Tab 2: Alle Einreichungen ----
    with tab_alle:
        st.subheader("Alle Einreichungen (inkl. bearbeitet)")
        try:
            from db import get_db
            with get_db() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, name, status, eingereicht_am,
                               ansprechpartner_email
                        FROM startups_pending
                        ORDER BY eingereicht_am DESC
                        LIMIT 100
                    """)
                    alle = cur.fetchall()

            if alle:
                import pandas as pd
                df = pd.DataFrame(alle)
                df["eingereicht_am"] = pd.to_datetime(
                    df["eingereicht_am"]
                ).dt.strftime("%d.%m.%Y %H:%M")
                # E-Mail aus Sicherheitsgründen kürzen
                df["ansprechpartner_email"] = df["ansprechpartner_email"].apply(
                    lambda x: x[:3] + "***@***" if x else "–"
                )
                st.dataframe(df, use_container_width=True)
            else:
                st.info("Noch keine Einreichungen vorhanden.")
        except Exception as e:
            st.error(f"Fehler: {e}")

    # ---- Tab 3: Admin-Tools ----
    with tab_tools:
        st.subheader("🛠️ Administrative Werkzeuge")

        # Demo-Daten bereinigen
        st.markdown("### Demo-Daten bereinigen")
        st.warning(
            "⚠️ **Achtung:** Dieser Vorgang löscht alle Einträge mit `demo_only=true` "
            "aus der Datenbank (Crunchbase + Demo-Seed-Daten). "
            "Dies ist nicht rückgängig zu machen!"
        )

        col_check, col_leer = st.columns([2, 2])
        with col_check:
            # Vorschau
            if st.button("🔍 Vorschau (was würde gelöscht?)", use_container_width=True):
                try:
                    from db import get_db
                    with get_db() as conn:
                        with conn.cursor() as cur:
                            cur.execute(
                                "SELECT quelle, COUNT(*) FROM startups "
                                "WHERE demo_only = TRUE GROUP BY quelle"
                            )
                            demo_stats = cur.fetchall()

                    if demo_stats:
                        st.info("Würde gelöscht werden:")
                        for quelle, anzahl in demo_stats:
                            st.write(f"  - **{quelle}:** {anzahl} Einträge")
                    else:
                        st.success("Keine Demo-Daten vorhanden.")
                except Exception as e:
                    st.error(f"Fehler: {e}")

        with col_leer:
            if st.button(
                "🗑️ Demo-Daten jetzt löschen",
                type="primary",
                use_container_width=True,
            ):
                try:
                    from db import get_db
                    with get_db() as conn:
                        with conn.cursor() as cur:
                            cur.execute(
                                "DELETE FROM startups WHERE demo_only = TRUE"
                            )
                            geloescht = cur.rowcount
                    st.success(
                        f"✅ {geloescht} Demo-Einträge erfolgreich gelöscht. "
                        "Bitte CRUNCHBASE_ENABLED=false in .env setzen."
                    )
                    logger.info(f"Admin: {geloescht} Demo-Einträge gelöscht")
                    st.rerun()
                except Exception as e:
                    st.error(f"Fehler: {e}")

        st.divider()

        # Ingestion manuell starten
        st.markdown("### Daten-Ingestion")
        if st.button("🔄 Ingestion-Pipeline manuell starten", use_container_width=False):
            with st.spinner("Pipeline läuft..."):
                try:
                    from ingestion import starte_alle_quellen
                    ergebnisse = starte_alle_quellen()
                    gesamt = sum(ergebnisse.values())
                    st.success(f"✅ Ingestion abgeschlossen: {gesamt} neue Einträge")
                except Exception as e:
                    st.error(f"Fehler: {e}")

        # Ingestion-Log anzeigen
        st.markdown("### Ingestion-Protokoll")
        try:
            from db import get_db
            with get_db() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        SELECT quelle, anzahl_importiert, anzahl_fehler, timestamp
                        FROM ingestion_log
                        ORDER BY timestamp DESC
                        LIMIT 20
                    """)
                    log_eintraege = cur.fetchall()

            if log_eintraege:
                import pandas as pd
                df_log = pd.DataFrame(log_eintraege)
                df_log["timestamp"] = pd.to_datetime(
                    df_log["timestamp"]
                ).dt.strftime("%d.%m.%Y %H:%M")
                st.dataframe(df_log, use_container_width=True)
            else:
                st.info("Noch keine Ingestion-Protokolle vorhanden.")
        except Exception as e:
            st.error(f"Fehler: {e}")


# ---- Routing ----
if not st.session_state.admin_eingeloggt:
    zeige_login()
else:
    zeige_admin_interface()
