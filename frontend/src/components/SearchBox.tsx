"use client";

import { type Locale, translations } from "@/lib/i18n";

interface SearchBoxProps {
  locale: Locale;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function SearchBox({
  locale,
  query,
  onQueryChange,
  onSearch,
  isLoading,
}: SearchBoxProps) {
  const tx = translations[locale];

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      onSearch();
    }
  }

  return (
    <div className="w-full" role="search" aria-label={locale === "de" ? "Lösungssuche" : "Solution search"}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="challenge-input" className="sr-only">
          {tx.placeholder}
        </label>
        <input
          id="challenge-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tx.placeholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400"
        />
        <button
          onClick={onSearch}
          disabled={!query.trim() || isLoading}
          aria-busy={isLoading}
          className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-600"
        >
          {isLoading ? tx.searching : tx.btn_search}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{tx.hint}</p>
    </div>
  );
}
