"""
Innovation Republic · Startup Matchmaker v2
============================================
Schlanke Web-App ohne Datenbank:
  User beschreibt Herausforderung → Claude API findet Lösungsanbieter
  → Websites werden live verifiziert → Ergebniskarten werden angezeigt.

Deployment: Streamlit Cloud
Secrets:    ANTHROPIC_API_KEY
"""

import concurrent.futures
import urllib.parse

import streamlit as st

from core.searcher import suche_loesungsanbieter
from core.verifier import verifiziere_website

# ── Seitenconfig ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Innovation Republic · Startup Matchmaker",
    page_icon="🔍",
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={
        "About": (
            "Innovation Republic – Kostenloser Startup-Matchmaker für KMUs.\n"
            "github.com/cryptoclemens/innovation-republic"
        ),
    },
)

# ── Übersetzungen ─────────────────────────────────────────────────────────────
T = {
    "de": {
        "title":        "Innovation Republic",
        "subtitle":     "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum",
        "badge_free":   "✓ Kostenlos",
        "badge_no_reg": "✓ Keine Anmeldung",
        "badge_live":   "✓ Live-Verifikation",
        "placeholder":  "z. B. Drohnen-Inventur für C-Teile im Lager",
        "btn_search":   "Passende Lösungen finden →",
        "hint":         "Schildern Sie die Herausforderung in einem Satz – je konkreter, desto besser.",
        "searching":    "Suche läuft …",
        "step_ai":      "🤖 Analysiere Herausforderung …",
        "step_verify":  " Anbieter gefunden – prüfe Websites …",
        "results_for":  "Ergebnisse für:",
        "founded":      "Gegr.",
        "team":         "Team:",
        "no_site":      "Keine Website bekannt",
        "caption":      (
            "ℹ️ Ergebnisse basieren auf Claude AI (Wissensstand bis Mai 2025). "
            "Websites wurden heute live geprüft. Für aktuellere Daten: "
            "[Dealroom](https://dealroom.co) · [Crunchbase](https://crunchbase.com)"
        ),
        "err_no_key":   "⚠️ Kein ANTHROPIC_API_KEY konfiguriert.",
        "err_search":   "Fehler bei der Suche",
        "score_label":  "/ 100",
        "match_hint":   "💡",
        "verified":     "✅",
        "unverified":   "🔗",
    },
    "en": {
        "title":        "Innovation Republic",
        "subtitle":     "Free Startup Matchmaker for SMEs in the DACH Region",
        "badge_free":   "✓ Free",
        "badge_no_reg": "✓ No registration",
        "badge_live":   "✓ Live verification",
        "placeholder":  "e.g. Drone inventory for C-parts in warehouse",
        "btn_search":   "Find matching solutions →",
        "hint":         "Describe your challenge in one sentence – the more specific, the better.",
        "searching":    "Searching …",
        "step_ai":      "🤖 Analysing challenge …",
        "step_verify":  " providers found – verifying websites …",
        "results_for":  "Results for:",
        "founded":      "Est.",
        "team":         "Team:",
        "no_site":      "No website known",
        "caption":      (
            "ℹ️ Results are based on Claude AI (knowledge up to May 2025). "
            "Websites were verified live today. For more current data: "
            "[Dealroom](https://dealroom.co) · [Crunchbase](https://crunchbase.com)"
        ),
        "err_no_key":   "⚠️ No ANTHROPIC_API_KEY configured.",
        "err_search":   "Search error",
        "score_label":  "/ 100",
        "match_hint":   "💡",
        "verified":     "✅",
        "unverified":   "🔗",
    },
}

# ── CSS ───────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
[data-testid="stAppViewContainer"] { background: #f8fafc; }
[data-testid="stHeader"]           { background: transparent; }

.ir-header      { text-align: center; padding: 1.6rem 0 0.8rem; }
.ir-title       { font-size: 2.1rem; font-weight: 800; color: #1e293b;
                  margin: 0 0 0.25rem; letter-spacing: -0.5px; }
.ir-subtitle    { color: #64748b; font-size: 1rem; margin: 0 0 0.7rem; }
.ir-badges      { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.ir-badge       { background: #e0f2fe; color: #0369a1; font-size: 0.78rem;
                  border-radius: 9999px; padding: 3px 12px; font-weight: 500; }

.ir-card        { background: #ffffff; border: 1px solid #e2e8f0;
                  border-radius: 16px; padding: 18px 22px; margin-bottom: 14px;
                  box-shadow: 0 1px 3px rgba(0,0,0,.06);
                  transition: box-shadow .18s ease; }
.ir-card:hover  { box-shadow: 0 4px 14px rgba(0,0,0,.10); }

.ir-score-wrap  { min-width: 68px; text-align: center; padding-top: 2px; }
.ir-score-num   { font-size: 2.1rem; font-weight: 800; line-height: 1; }
.ir-score-label { font-size: 0.78rem; color: #94a3b8; font-weight: 500; margin-top: 1px; }
.ir-bar-bg      { background: #f1f5f9; border-radius: 99px; height: 7px;
                  width: 100%; margin-top: 7px; }
.ir-bar-fill    { border-radius: 99px; height: 7px; }

.ir-name        { font-size: 1.12rem; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.ir-tagline     { color: #475569; font-size: 0.92rem; margin: 0 0 8px; }
.ir-reason      { color: #64748b; font-size: 0.86rem; font-style: italic;
                  background: #f8fafc; border-left: 3px solid #cbd5e1;
                  padding: 5px 10px; border-radius: 0 6px 6px 0; margin: 4px 0 10px; }
.ir-meta        { display: flex; flex-wrap: wrap; gap: 8px;
                  align-items: center; font-size: 0.83rem; color: #64748b; }
.ir-sep         { border: none; border-top: 1px solid #f1f5f9; margin: 10px 0 8px; }

.ir-link-ok     { color: #16a34a !important; font-weight: 500; font-size: 0.88rem;
                  text-decoration: none !important; }
.ir-link-ok:hover { text-decoration: underline !important; }
.ir-link-un     { color: #64748b !important; font-size: 0.88rem;
                  text-decoration: none !important; }
.ir-link-un:hover { text-decoration: underline !important; }
.ir-link-mail   { color: #2563eb !important; font-size: 0.85rem;
                  text-decoration: none !important; margin-left: 14px; }
.ir-link-mail:hover { text-decoration: underline !important; }
.ir-no-site     { color: #94a3b8; font-size: 0.85rem; }
.ir-link-google { color: #6b7280 !important; font-size: 0.82rem;
                  text-decoration: none !important; margin-left: 10px;
                  border: 1px solid #e2e8f0; border-radius: 6px;
                  padding: 2px 8px; }
.ir-link-google:hover { background: #f1f5f9 !important; text-decoration: none !important; }
</style>
""", unsafe_allow_html=True)

# ── State ─────────────────────────────────────────────────────────────────────
if "sprache" not in st.session_state:
    st.session_state.sprache = "de"

# ── API-Key ───────────────────────────────────────────────────────────────────
try:
    API_KEY = st.secrets["ANTHROPIC_API_KEY"]
except Exception:
    API_KEY = None

# ── Header + Sprach-Toggle ────────────────────────────────────────────────────
lang = st.session_state.sprache
tx   = T[lang]

col_head, col_lang = st.columns([5, 1])
with col_head:
    st.markdown(f"""
<div class="ir-header">
  <div class="ir-title">🔍 {tx['title']}</div>
  <div class="ir-subtitle">{tx['subtitle']}</div>
  <div class="ir-badges">
    <span class="ir-badge">{tx['badge_free']}</span>
    <span class="ir-badge">{tx['badge_no_reg']}</span>
    <span class="ir-badge">{tx['badge_live']}</span>
  </div>
</div>
""", unsafe_allow_html=True)

with col_lang:
    st.markdown("<div style='padding-top:1.5rem'></div>", unsafe_allow_html=True)
    c1, c2 = st.columns(2)
    with c1:
        if st.button("🇩🇪", help="Deutsch", use_container_width=True,
                     type="primary" if lang == "de" else "secondary"):
            st.session_state.sprache = "de"
            st.rerun()
    with c2:
        if st.button("🇬🇧", help="English", use_container_width=True,
                     type="primary" if lang == "en" else "secondary"):
            st.session_state.sprache = "en"
            st.rerun()

st.markdown("")

# ── Eingabe ───────────────────────────────────────────────────────────────────
herausforderung = st.text_input(
    "challenge",
    placeholder=tx["placeholder"],
    label_visibility="collapsed",
)
col_btn, col_hint = st.columns([2, 3])
with col_btn:
    suchen = st.button(tx["btn_search"], type="primary", use_container_width=True)
with col_hint:
    st.caption(tx["hint"])


# ── Hilfsfunktionen ───────────────────────────────────────────────────────────

def score_farbe(score: int) -> str:
    if score >= 80:
        return "#16a34a"
    if score >= 65:
        return "#f59e0b"
    return "#64748b"


FLAGGEN = {
    "Deutschland": "🇩🇪", "Germany": "🇩🇪",
    "Österreich": "🇦🇹",  "Austria": "🇦🇹",
    "Schweiz": "🇨🇭",     "Switzerland": "🇨🇭",
    "USA": "🇺🇸",         "United States": "🇺🇸",
    "UK": "🇬🇧",          "United Kingdom": "🇬🇧",
    "Frankreich": "🇫🇷",  "France": "🇫🇷",
    "Niederlande": "🇳🇱", "Netherlands": "🇳🇱",
    "Schweden": "🇸🇪",    "Sweden": "🇸🇪",
    "Dänemark": "🇩🇰",    "Denmark": "🇩🇰",
    "Israel": "🇮🇱",      "Finnland": "🇫🇮", "Finland": "🇫🇮",
    "Kanada": "🇨🇦",      "Canada": "🇨🇦",
    "Spanien": "🇪🇸",     "Spain": "🇪🇸",
    "Belgien": "🇧🇪",     "Belgium": "🇧🇪",
}


def render_karte(e: dict, tx: dict, lang: str = "de") -> None:
    score   = e["match_score"]
    farbe   = score_farbe(score)
    verif   = e.get("_v", {})
    url     = verif.get("finale_url") or e.get("website")
    ok      = verif.get("erreichbar")
    land    = e.get("land", "")
    jahr    = e.get("gruendungsjahr")
    groesse = e.get("teamgroesse")
    email   = e.get("kontakt_email")

    # Google-Fallback-URL (immer verfügbar als Backup)
    firma_encoded = urllib.parse.quote_plus(f'{e["name"]} official website')
    google_url    = f"https://www.google.com/search?q={firma_encoded}"
    google_label  = "🔍 Google" if lang == "de" else "🔍 Google"

    # Website-Link
    if url:
        disp = url.replace("https://", "").replace("http://", "").rstrip("/")
        if len(disp) > 42:
            disp = disp[:39] + "…"
        cls  = "ir-link-ok" if ok else "ir-link-un"
        icon = tx["verified"] if ok else tx["unverified"]
        link_html = f'<a href="{url}" target="_blank" class="{cls}">{icon} {disp} ↗</a>'
        # Bei nicht verifizierbarer URL: Google-Fallback daneben zeigen
        if not ok:
            link_html += f' &nbsp;<a href="{google_url}" target="_blank" class="ir-link-google">{google_label}</a>'
    else:
        # Keine URL bekannt → nur Google-Suche anbieten
        link_html = f'<a href="{google_url}" target="_blank" class="ir-link-google">{google_label} – {e["name"]}</a>'

    mail_html = ""
    if email:
        mail_html = f'<a href="mailto:{email}" class="ir-link-mail">📧 {email}</a>'

    meta_parts = []
    if land:
        flag = FLAGGEN.get(land, "🌍")
        meta_parts.append(f"{flag} {land}")
    if jahr:
        meta_parts.append(f'{tx["founded"]} {jahr}')
    if groesse:
        meta_parts.append(f'{tx["team"]} {groesse}')
    meta_html = " &nbsp;·&nbsp; ".join(meta_parts)

    reason_html = ""
    if e.get("match_begruendung"):
        reason_html = f'<div class="ir-reason">{tx["match_hint"]} {e["match_begruendung"]}</div>'

    st.markdown(f"""
<div class="ir-card">
  <div style="display:flex;gap:18px;align-items:flex-start;">
    <div class="ir-score-wrap">
      <div class="ir-score-num" style="color:{farbe};">{score}</div>
      <div class="ir-score-label">{tx["score_label"]}</div>
      <div class="ir-bar-bg">
        <div class="ir-bar-fill" style="width:{score}%;background:{farbe};"></div>
      </div>
    </div>
    <div style="flex:1;min-width:0;">
      <div class="ir-name">{e['name']}</div>
      <div class="ir-tagline">{e.get('tagline','')}</div>
      {reason_html}
      <div class="ir-meta">{meta_html}</div>
      <hr class="ir-sep">
      <div>{link_html}{mail_html}</div>
    </div>
  </div>
</div>
""", unsafe_allow_html=True)


# ── Suche & Ausgabe ───────────────────────────────────────────────────────────
if suchen and herausforderung.strip():

    if not API_KEY:
        st.error(tx["err_no_key"])
        st.stop()

    with st.status(tx["searching"], expanded=True) as status:
        st.write(tx["step_ai"])
        try:
            ergebnisse = suche_loesungsanbieter(
                herausforderung.strip(),
                API_KEY,
                sprache=lang,
            )
        except Exception as exc:
            st.error(f"{tx['err_search']}: {exc}")
            st.stop()

        st.write(f"{len(ergebnisse)}{tx['step_verify']}")

        def _v(e: dict) -> dict:
            e["_v"] = verifiziere_website(e.get("website"))
            return e

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
            ergebnisse = list(pool.map(_v, ergebnisse))

        ok_count = sum(1 for e in ergebnisse if e.get("_v", {}).get("erreichbar"))
        label = (
            f"✅ {len(ergebnisse)} Anbieter · {ok_count} Websites verifiziert"
            if lang == "de" else
            f"✅ {len(ergebnisse)} providers · {ok_count} websites verified"
        )
        status.update(label=label, state="complete", expanded=False)

    st.markdown(f"### {tx['results_for']} *{herausforderung}*")
    st.markdown("---")

    for e in ergebnisse:
        render_karte(e, tx, lang=lang)

    st.caption(tx["caption"])
