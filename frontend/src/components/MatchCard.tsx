import type { Locale } from "@/lib/i18n";
import type { MatchResponseItem } from "@/app/api/match/route";

interface MatchCardProps {
  item: MatchResponseItem;
  locale: Locale;
}

const FLAGS: Record<string, string> = {
  Deutschland: "\u{1F1E9}\u{1F1EA}",
  Germany: "\u{1F1E9}\u{1F1EA}",
  "\u00D6sterreich": "\u{1F1E6}\u{1F1F9}",
  Austria: "\u{1F1E6}\u{1F1F9}",
  Schweiz: "\u{1F1E8}\u{1F1ED}",
  Switzerland: "\u{1F1E8}\u{1F1ED}",
  USA: "\u{1F1FA}\u{1F1F8}",
  "United States": "\u{1F1FA}\u{1F1F8}",
  UK: "\u{1F1EC}\u{1F1E7}",
  "United Kingdom": "\u{1F1EC}\u{1F1E7}",
  Frankreich: "\u{1F1EB}\u{1F1F7}",
  France: "\u{1F1EB}\u{1F1F7}",
  Niederlande: "\u{1F1F3}\u{1F1F1}",
  Netherlands: "\u{1F1F3}\u{1F1F1}",
  Schweden: "\u{1F1F8}\u{1F1EA}",
  Sweden: "\u{1F1F8}\u{1F1EA}",
  Israel: "\u{1F1EE}\u{1F1F1}",
  Finnland: "\u{1F1EB}\u{1F1EE}",
  Finland: "\u{1F1EB}\u{1F1EE}",
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 65) return "text-amber-500 dark:text-amber-400";
  return "text-slate-500 dark:text-slate-400";
}

function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 65) return "bg-amber-400";
  return "bg-slate-400";
}

export default function MatchCard({ item, locale }: MatchCardProps) {
  const v = item.verification;
  const url = v.finale_url || item.website;
  const flag = FLAGS[item.land] || "\u{1F30D}";
  const foundedLabel = locale === "de" ? "Gegr." : "Est.";

  const googleQuery = encodeURIComponent(`${item.name} official website`);
  const googleUrl = `https://www.google.com/search?q=${googleQuery}`;

  let linkBlock: React.ReactNode;
  if (url) {
    const display = url
      .replace("https://", "")
      .replace("http://", "")
      .replace(/\/$/, "");
    const truncated =
      display.length > 42 ? display.slice(0, 39) + "\u2026" : display;

    if (v.erreichbar) {
      linkBlock = (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-600 hover:underline dark:text-green-400"
        >
          {truncated}
        </a>
      );
    } else {
      linkBlock = (
        <span className="flex flex-wrap items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:underline dark:text-slate-400"
          >
            {truncated}
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Google
          </a>
        </span>
      );
    }
  } else {
    linkBlock = (
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        Google – {item.name}
      </a>
    );
  }

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-5"
      aria-label={`${item.name} – Score ${item.match_score}/100`}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Score */}
        <div className="flex min-w-[56px] flex-col items-center pt-0.5 sm:min-w-[68px]" aria-hidden="true">
          <span
            className={`text-2xl font-extrabold leading-none sm:text-3xl ${scoreColor(item.match_score)}`}
          >
            {item.match_score}
          </span>
          <span className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            / 100
          </span>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className={`h-1.5 rounded-full transition-all ${scoreBgColor(item.match_score)}`}
              style={{ width: `${item.match_score}%` }}
              role="progressbar"
              aria-valuenow={item.match_score}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {item.name}
          </h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
            {item.tagline}
          </p>

          {item.match_begruendung && (
            <p className="mt-2 rounded-r border-l-[3px] border-slate-300 bg-slate-50 px-3 py-1.5 text-sm italic text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
              {item.match_begruendung}
            </p>
          )}

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {item.land && (
              <span>
                {flag} {item.land}
              </span>
            )}
            {item.gruendungsjahr && (
              <span>
                {foundedLabel} {item.gruendungsjahr}
              </span>
            )}
            {item.teamgroesse && (
              <span>Team: {item.teamgroesse}</span>
            )}
            {item.quelle === "graph" && (
              <span
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                title={locale === "de" ? "Aus verifiziertem Wissensgraphen" : "From verified knowledge graph"}
              >
                {locale === "de" ? "Wissensgraph" : "Knowledge Graph"}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
            {linkBlock}
            {item.kontakt_email && (
              <a
                href={`mailto:${item.kontakt_email}`}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {item.kontakt_email}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
