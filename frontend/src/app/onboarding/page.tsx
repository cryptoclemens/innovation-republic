"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  onboardingTexts,
  INNOVATION_CATEGORIES,
} from "@/lib/onboarding-i18n";

export default function OnboardingPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "de") setLocale(saved);
  }, []);

  const tx = onboardingTexts[locale];

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!name.trim()) errs.push(tx.err_required);
    if (!beschreibung.trim()) errs.push(tx.err_required);
    if (beschreibung.length > 500) errs.push(tx.err_description_long);
    if (tags.length === 0) errs.push(tx.err_required);
    if (!email.trim() || !email.includes("@")) errs.push(tx.err_email);
    if (!consent) errs.push(tx.err_consent);
    return [...new Set(errs)];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          beschreibung: beschreibung.trim(),
          tags,
          email: email.trim(),
          website: website.trim() || null,
        }),
      });

      if (!res.ok) {
        setErrors([tx.err_server]);
        return;
      }

      setSuccess(true);
    } catch {
      setErrors([tx.err_server]);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setName("");
    setBeschreibung("");
    setTags([]);
    setEmail("");
    setWebsite("");
    setConsent(false);
    setErrors([]);
    setSuccess(false);
  }

  const charColor =
    beschreibung.length > 480
      ? "text-red-500"
      : "text-slate-400 dark:text-slate-500";

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {tx.success_title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {tx.success_text}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={resetForm}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              {tx.success_another}
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {tx.back_home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {tx.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tx.subtitle}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {tx.back_home}
        </Link>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/30"
        >
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700 dark:text-red-300">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="startup-name"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {tx.field_name} <span className="text-red-500">*</span>
          </label>
          <input
            id="startup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={255}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="startup-description"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {tx.field_description} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="startup-description"
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
            maxLength={500}
            rows={4}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className={`mt-1 text-xs ${charColor}`}>
            {beschreibung.length}/500 {tx.chars}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {tx.description_help}
          </p>
        </div>

        {/* Tags */}
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            {tx.field_tags} <span className="text-red-500">*</span>
          </legend>
          <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">
            {tx.tags_help}
          </p>
          <div className="flex flex-wrap gap-2">
            {INNOVATION_CATEGORIES.map((cat) => {
              const selected = tags.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleTag(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-sky-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500"
                  }`}
                  aria-pressed={selected}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Email */}
        <div>
          <label
            htmlFor="startup-email"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {tx.field_email} <span className="text-red-500">*</span>
          </label>
          <input
            id="startup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kontakt@mein-startup.de"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {tx.email_help}
          </p>
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="startup-website"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {tx.field_website}
          </label>
          <input
            id="startup-website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://mein-startup.de"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Consent */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {tx.consent_text}
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-600"
        >
          {isSubmitting ? tx.submitting : tx.button}
        </button>
      </form>

      {/* Privacy footer */}
      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        {tx.privacy}
      </p>
    </div>
  );
}
