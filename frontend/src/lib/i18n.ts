export type Locale = "de" | "en";

export const translations = {
  de: {
    title: "Innovation Republic",
    subtitle: "Kostenloser Startup-Matchmaker für KMUs im DACH-Raum",
    badge_free: "Kostenlos",
    badge_no_reg: "Keine Anmeldung",
    badge_live: "Live-Verifikation",
    placeholder: "z. B. Drohnen-Inventur für C-Teile im Lager",
    btn_search: "Passende Lösungen finden",
    hint: "Schildern Sie die Herausforderung in einem Satz – je konkreter, desto besser.",
    searching: "Suche läuft …",
    step_ai: "Analysiere Herausforderung …",
    step_verify: "Anbieter gefunden – prüfe Websites …",
    results_for: "Ergebnisse für:",
    founded: "Gegr.",
    team: "Team:",
    no_site: "Keine Website bekannt",
    caption:
      "Ergebnisse basieren auf Claude AI. Websites wurden live geprüft.",
    err_search: "Fehler bei der Suche",
    score_label: "/ 100",
    verified: "Verifiziert",
    unverified: "Nicht verifiziert",
    footer_text: "Ein Projekt von Innovation Republic e.V.",
    footer_powered: "Powered by Claude AI · Next.js · Tailwind CSS",
    lang_toggle: "English",
  },
  en: {
    title: "Innovation Republic",
    subtitle: "Free Startup Matchmaker for SMEs in the DACH Region",
    badge_free: "Free",
    badge_no_reg: "No registration",
    badge_live: "Live verification",
    placeholder: "e.g. Drone inventory for C-parts in warehouse",
    btn_search: "Find matching solutions",
    hint: "Describe your challenge in one sentence – the more specific, the better.",
    searching: "Searching …",
    step_ai: "Analysing challenge …",
    step_verify: "providers found – verifying websites …",
    results_for: "Results for:",
    founded: "Est.",
    team: "Team:",
    no_site: "No website known",
    caption:
      "Results are based on Claude AI. Websites were verified live today.",
    err_search: "Search error",
    score_label: "/ 100",
    verified: "Verified",
    unverified: "Unverified",
    footer_text: "A project by Innovation Republic e.V.",
    footer_powered: "Powered by Claude AI · Next.js · Tailwind CSS",
    lang_toggle: "Deutsch",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["de"];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}
