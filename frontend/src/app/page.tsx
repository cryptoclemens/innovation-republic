"use client";

import { useState } from "react";
import type { Locale, TranslationKey } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import type { MatchResponseItem } from "@/app/api/match/route";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";
import MatchCard from "@/components/MatchCard";
import MatchSkeleton from "@/components/MatchSkeleton";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("de");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchResponseItem[]>([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const tx = translations[locale];

  function toggleLocale() {
    setLocale((prev) => (prev === "de" ? "en" : "de"));
  }

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchedQuery(trimmed);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge: trimmed, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || tx.err_search);
        return;
      }

      setResults(data.results);
    } catch {
      setError(tx.err_search);
    } finally {
      setIsLoading(false);
    }
  }

  const verifiedCount = results.filter(
    (r) => r.verification.erreichbar,
  ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} onToggleLocale={toggleLocale} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <SearchBox
          locale={locale}
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-slate-500">{tx.step_ai}</p>
            {Array.from({ length: 3 }).map((_, i) => (
              <MatchSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {tx.results_for}{" "}
                <span className="italic text-slate-600">{searchedQuery}</span>
              </h2>
              <span className="text-sm text-slate-500">
                {results.length}{" "}
                {locale === "de" ? "Anbieter" : "providers"}
                {" · "}
                {verifiedCount}{" "}
                {locale === "de" ? "verifiziert" : "verified"}
              </span>
            </div>

            <div className="space-y-4">
              {results.map((item, i) => (
                <MatchCard key={`${item.name}-${i}`} item={item} locale={locale} />
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              {tx.caption}
            </p>
          </div>
        )}
      </main>

      <Footer locale={locale} />
    </div>
  );
}
