import type { Locale } from "./i18n";

export const onboardingTexts = {
  de: {
    title: "Startup-Onboarding",
    subtitle:
      "Tragen Sie Ihr Startup in das Innovation Republic Matching-System ein",
    field_name: "Startup-Name",
    field_description: "Kurzbeschreibung Ihrer Lösung",
    description_help: "In eigenen Worten – max. 500 Zeichen.",
    field_tags: "Innovationsbereiche",
    tags_help: "Wählen Sie alle zutreffenden Bereiche",
    field_email: "Ansprechpartner E-Mail",
    email_help: "Wird nicht öffentlich angezeigt, nur intern verwendet",
    field_website: "Website (optional)",
    consent_text:
      "Ich stimme zu, dass mein Profil im Innovation Republic Matching-System gelistet wird (jederzeit widerrufbar)",
    button: "Profil einreichen",
    submitting: "Profil wird verarbeitet…",
    success_title: "Profil eingereicht!",
    success_text:
      "Danke! Ihr Profil wurde eingereicht und wird nach Prüfung freigeschaltet. Sie erhalten eine Benachrichtigung per E-Mail.",
    success_another: "Weiteres Startup eintragen",
    err_required: "Bitte füllen Sie alle Pflichtfelder aus.",
    err_consent: "Bitte bestätigen Sie die Datenschutzerklärung.",
    err_description_long: "Die Beschreibung darf maximal 500 Zeichen lang sein.",
    err_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    err_server: "Fehler beim Speichern. Bitte versuchen Sie es erneut.",
    privacy:
      "Ihre Daten werden ausschließlich für das Innovation Republic Matching verwendet und nicht an Dritte weitergegeben.",
    chars: "Zeichen",
    required: "Pflichtfeld",
    back_home: "Zurück zur Suche",
  },
  en: {
    title: "Startup Onboarding",
    subtitle:
      "Register your startup in the Innovation Republic matching system",
    field_name: "Startup Name",
    field_description: "Brief description of your solution",
    description_help: "In your own words – max. 500 characters.",
    field_tags: "Innovation Areas",
    tags_help: "Select all applicable areas",
    field_email: "Contact E-Mail",
    email_help: "Not displayed publicly, used internally only",
    field_website: "Website (optional)",
    consent_text:
      "I agree that my profile will be listed in the Innovation Republic matching system (revocable at any time)",
    button: "Submit Profile",
    submitting: "Processing profile…",
    success_title: "Profile submitted!",
    success_text:
      "Thank you! Your profile has been submitted and will be activated after review. You will receive a notification by email.",
    success_another: "Register another startup",
    err_required: "Please fill in all required fields.",
    err_consent: "Please confirm the privacy statement.",
    err_description_long: "Description must be max. 500 characters.",
    err_email: "Please enter a valid email address.",
    err_server: "Error saving. Please try again.",
    privacy:
      "Your data is used exclusively for Innovation Republic matching and will not be shared with third parties.",
    chars: "characters",
    required: "Required",
    back_home: "Back to search",
  },
} as const;

export const INNOVATION_CATEGORIES = [
  "Prozessautomatisierung",
  "Predictive Maintenance",
  "Nachhaltige Logistik",
  "Digitale Qualitätssicherung",
  "Energieeffizienz",
  "HR-Tech",
  "Zirkulärwirtschaft",
];

export type OnboardingTextKey = keyof (typeof onboardingTexts)["de"];
