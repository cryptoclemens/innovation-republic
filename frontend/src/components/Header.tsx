"use client";

import { type Locale, translations } from "@/lib/i18n";
import DarkModeToggle from "./DarkModeToggle";

interface HeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
}

export default function Header({ locale, onToggleLocale }: HeaderProps) {
  const tx = translations[locale];

  return (
    <header className="w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white"
            aria-hidden="true"
          >
            IR
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
              {tx.title}
            </h1>
            <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
              {tx.subtitle}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={onToggleLocale}
            aria-label={locale === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            {tx.lang_toggle}
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
        {(["badge_free", "badge_no_reg", "badge_live"] as const).map((key) => (
          <span
            key={key}
            className="whitespace-nowrap rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
          >
            {tx[key]}
          </span>
        ))}
      </div>
    </header>
  );
}
