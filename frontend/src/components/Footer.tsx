import { type Locale, translations } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const tx = translations[locale];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-6">
        <p className="font-medium text-slate-600 dark:text-slate-300">{tx.footer_text}</p>
        <p className="mt-1">{tx.footer_powered}</p>
      </div>
    </footer>
  );
}
