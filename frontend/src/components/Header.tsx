"use client";

import { type Locale, translations } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
}

export default function Header({ locale, onToggleLocale }: HeaderProps) {
  const tx = translations[locale];

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white">
            IR
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              {tx.title}
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              {tx.subtitle}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={onToggleLocale}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          {tx.lang_toggle}
        </button>
      </div>

      {/* Badges */}
      <div className="mx-auto flex max-w-4xl gap-2 px-4 pb-3 sm:px-6">
        {(["badge_free", "badge_no_reg", "badge_live"] as const).map((key) => (
          <span
            key={key}
            className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
          >
            {tx[key]}
          </span>
        ))}
      </div>
    </header>
  );
}
