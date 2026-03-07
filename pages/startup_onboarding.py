"""
Innovation Republic – Startup Self-Onboarding
==============================================
Formular für Startups um sich selbst im Matching-System einzutragen.
Eingereichte Profile landen in startups_pending (Moderationswarteschlange)
und werden erst nach Admin-Freischaltung aktiv.

Starten: streamlit run app.py (als Unterseite automatisch verfügbar)
"""

import streamlit as st
from loguru import logger

st.set_page_config(
    page_title="Startup-Onboarding – Innovation Republic",
    page_icon="📝",
    layout="centered",
)

# ---- Mehrsprachigkeit ----
TEXTE = {
    "de": {
        "titel": "📝 Startup-Onboarding",
        "untertitel": "Tragen Sie Ihr Startup in das Innovation Republic Matching-System ein",
        "pflicht_name": "Startup-Name *",
        "pflicht_beschreibung": "Kurzbeschreibung Ihrer Lösung *",
        "beschreibung_hilfe": "In eigenen Worten – max. 500 Zeichen. Keine Fachbegriffe nötig.",
        "pflicht_tags": "Innovationsbereiche *",
        "tags_hilfe": "Wählen Sie alle zutreffenden Bereiche",
        "pflicht_email": "Ansprechpartner E-Mail *",
        "email_hilfe": "Wird nicht öffentlich angezeigt, nur intern verwendet",
        "optional_website": "Website (optional)",
        "checkbox_text": (
            "Ich stimme zu, dass mein Profil im Innovation Republic "
            "Matching-System gelistet wird (jederzeit widerrufbar)"
        ),
        "button": "Profil einreichen",
        "erfolg": (
            "✅ Danke! Ihr Profil wurde eingereicht und wird nach Prüfung freigeschaltet. "
            "Sie erhalten eine Benachrichtigung per E-Mail."
        ),
        "fehler_pflichtfelder": "Bitte füllen Sie alle Pflichtfelder aus.",
        "fehler_zustimmung": "Bitte bestätigen Sie die Datenschutzerklärung.",
        "fehler_beschreibung_lang": "Die Beschreibung darf maximal 500 Zeichen lang sein.",
        "fehler_email": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        "datenschutz": (
            "Ihre Daten werden ausschließlich für das Innovation Republic "
            "Matching verwendet und nicht an Dritte weitergegeben."
        ),
        "zeichen_zaehler": "Zeichen",
        "sprache_button": "🇬🇧 English",
        "laden": "Profil wird verarbeitet...",
    },
    "en": {
        "titel": "📝 Startup Onboarding",
        "untertitel": "Register your startup in the Innovation Republic matching system",
        "pflicht_name": "Startup Name *",
        "pflicht_beschreibung": "Brief description of your solution *",
        "beschreibung_hilfe": "In your own words – max. 500 characters. No jargon needed.",
        "pflicht_tags": "Innovation Areas *",
        "tags_hilfe": "Select all applicable areas",
        "pflicht_email": "Contact E-Mail *",
        "email_hilfe": "Not displayed publicly, used internally only",
        "optional_website": "Website (optional)",
        "checkbox_text": (
            "I agree that my profile will be listed in the Innovation Republic "
            "matching system (revocable at any time)"
        ),
        "button": "Submit Profile",
        "erfolg": (
            "✅ Thank you! Your profile has been submitted and will be activated after review. "
            "You will receive a notification by email."
        ),
        "fehler_pflichtfelder": "Please fill in all required fields.",
        "fehler_zustimmung": "Please confirm the privacy statement.",
        "fehler_beschreibung_lang": "Description must be max. 500 characters.",
        "fehler_email": "Please enter a valid email address.",
        "datenschutz": (
            "Your data is used exclusively for Innovation Republic matching "
            "and will not be shared with third parties."
        ),
        "zeichen_zaehler": "characters",
        "sprache_button": "🇩🇪 Deutsch",
        "laden": "Processing profile...",
    },
}

INNOVATIONSKATEGORIEN = [
    "Prozessautomatisierung",
    "Predictive Maintenance",
    "Nachhaltige Logistik",
    "Digitale Qualitätssicherung",
    "Energieeffizienz",
    "HR-Tech",
    "Zirkulärwirtschaft",
]

# ---- Session-State ----
if "onboarding_sprache" not in st.session_state:
    st.session_state.onboarding_sprache = "de"

if "onboarding_erfolgreich" not in st.session_state:
    st.session_state.onboarding_erfolgreich = False

T = TEXTE[st.session_state.onboarding_sprache]

# ---- Sprachumschalter ----
col_titel, col_sprache = st.columns([4, 1])
with col_sprache:
    if st.button(T["sprache_button"]):
        st.session_state.onboarding_sprache = (
            "en" if st.session_state.onboarding_sprache == "de" else "de"
        )
        st.rerun()

# ---- Titel ----
with col_titel:
    st.title(T["titel"])
    st.markdown(f"*{T['untertitel']}*")

st.divider()

# ---- Erfolgsmeldung ----
if st.session_state.onboarding_erfolgreich:
    st.success(T["erfolg"])
    if st.button("Weiteres Startup eintragen"):
        st.session_state.onboarding_erfolgreich = False
        st.rerun()
    st.stop()

# ---- Onboarding-Formular ----
with st.form("onboarding_formular", clear_on_submit=False):

    # Pflichtfeld: Name
    name = st.text_input(
        T["pflicht_name"],
        max_chars=255,
    )

    # Pflichtfeld: Beschreibung mit Zeichenzähler
    beschreibung = st.text_area(
        T["pflicht_beschreibung"],
        help=T["beschreibung_hilfe"],
        max_chars=500,
        height=120,
    )
    zeichen = len(beschreibung)
    farbe = "red" if zeichen > 480 else "gray"
    st.markdown(
        f'<p style="color:{farbe};font-size:0.8em;">'
        f"{zeichen}/500 {T['zeichen_zaehler']}</p>",
        unsafe_allow_html=True,
    )

    # Pflichtfeld: Innovationsbereiche (Mehrfachauswahl)
    tags = st.multiselect(
        T["pflicht_tags"],
        options=INNOVATIONSKATEGORIEN,
        help=T["tags_hilfe"],
    )

    # Pflichtfeld: E-Mail
    email = st.text_input(
        T["pflicht_email"],
        help=T["email_hilfe"],
        placeholder="kontakt@mein-startup.de",
    )

    # Optionales Feld: Website
    website = st.text_input(
        T["optional_website"],
        placeholder="https://mein-startup.de",
    )

    st.divider()

    # Pflicht-Checkbox
    zustimmung = st.checkbox(T["checkbox_text"])

    # Absenden
    submitted = st.form_submit_button(
        T["button"],
        type="primary",
        use_container_width=True,
    )

# ---- Verarbeitung nach Formular-Absenden ----
if submitted:
    # Validierung
    fehler = []

    if not name.strip():
        fehler.append(T["fehler_pflichtfelder"])
    if not beschreibung.strip():
        fehler.append(T["fehler_pflichtfelder"])
    if len(beschreibung) > 500:
        fehler.append(T["fehler_beschreibung_lang"])
    if not tags:
        fehler.append(T["fehler_pflichtfelder"])
    if not email.strip() or "@" not in email:
        fehler.append(T["fehler_email"])
    if not zustimmung:
        fehler.append(T["fehler_zustimmung"])

    if fehler:
        for f in set(fehler):
            st.error(f)
    else:
        with st.spinner(T["laden"]):
            try:
                from core.embedding import erstelle_embedding
                from db import get_db
                from pgvector.psycopg2 import register_vector

                # Embedding sofort erstellen
                embedding_text = f"{name.strip()} {beschreibung.strip()}"
                embedding = erstelle_embedding(embedding_text)

                # In startups_pending eintragen
                with get_db() as conn:
                    register_vector(conn)
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            INSERT INTO startups_pending
                                (name, beschreibung, branchen_tags, loesung_kategorie,
                                 quelle, embedding, website, ansprechpartner_email,
                                 demo_only, status)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            """,
                            (
                                name.strip(),
                                beschreibung.strip(),
                                tags,
                                tags[0] if tags else None,  # Hauptkategorie
                                "self-onboarding",
                                embedding.tolist(),
                                website.strip() or None,
                                email.strip(),
                                False,          # Echtes Profil → demo_only=false
                                "pending",
                            ),
                        )

                st.session_state.onboarding_erfolgreich = True
                logger.info(
                    f"Neues Startup-Onboarding eingereicht: '{name}' von {email}"
                )
                st.rerun()

            except Exception as e:
                st.error(f"Fehler beim Speichern: {e}")
                logger.error(f"Onboarding-Fehler: {e}")

# ---- Datenschutz-Fußzeile ----
st.divider()
st.caption(f"🔒 {T['datenschutz']}")
st.caption("Innovation Republic e.V. | Datenschutz: datenschutz@innovation-republic.de")
