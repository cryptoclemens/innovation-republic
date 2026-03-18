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
    <div className="w-full">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tx.placeholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
        />
        <button
          onClick={onSearch}
          disabled={!query.trim() || isLoading}
          className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? tx.searching : tx.btn_search}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-500">{tx.hint}</p>
    </div>
  );
}
