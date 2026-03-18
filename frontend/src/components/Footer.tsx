import { type Locale, translations } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const tx = translations[locale];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
        <p className="font-medium text-slate-600">{tx.footer_text}</p>
        <p className="mt-1">{tx.footer_powered}</p>
      </div>
    </footer>
  );
}
