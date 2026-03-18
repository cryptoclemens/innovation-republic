"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("de");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function toggleLocale() {
    setLocale((prev) => (prev === "de" ? "en" : "de"));
  }

  function handleSearch() {
    if (!query.trim()) return;
    setIsLoading(true);
    // TODO: Meilenstein 2 – API Route anbinden
    setTimeout(() => setIsLoading(false), 1500);
  }

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

        {/* TODO: Meilenstein 2 – Ergebniskarten hier rendern */}
      </main>

      <Footer locale={locale} />
    </div>
  );
}
