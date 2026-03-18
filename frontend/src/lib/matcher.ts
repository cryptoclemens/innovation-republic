/**
 * Innovation Republic · Suche via Claude API (portiert aus core/searcher.py)
 *
 * Claude liefert passende B2B-Lösungsanbieter direkt aus seinem Wissen –
 * priorisiert DACH, ergänzt international.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Locale } from "./i18n";

export interface MatchResult {
  name: string;
  tagline: string;
  match_score: number;
  match_begruendung: string;
  land: string;
  website: string | null;
  kontakt_email: string | null;
  gruendungsjahr: number | null;
  teamgroesse: string | null;
}

const SYSTEM_DE = `Du bist ein führender Experte für B2B-Lösungsanbieter, Startups und
etablierte Softwareunternehmen, mit Schwerpunkt auf dem DACH-Raum (Deutschland,
Österreich, Schweiz).

Aufgabe: Ein KMU-Mitarbeiter nennt eine berufliche Herausforderung. Du findest
die real existierenden Unternehmen, die diese Herausforderung am direktesten lösen.

Regeln:
1. Nenne nur REAL EXISTIERENDE Unternehmen – niemals erfundene Namen.
2. Priorisiere DACH-Anbieter (DE, AT, CH). Ergänze internationale Marktführer
   (USA, UK, EU), wenn kein gleichwertiger DACH-Anbieter existiert.
3. match_score (0–100): Bewertet wie DIREKT der Anbieter die spezifische
   Herausforderung löst – nicht die allgemeine Branchennähe.
4. website: STRENGE REGEL – gib NUR die URL an, die du mit Sicherheit kennst
   (z.B. celonis.com, personio.de). Bei der geringsten Unsicherheit: null setzen.
   NIEMALS eine URL raten oder konstruieren. Falsche URLs schaden den Nutzern.
5. kontakt_email: Nur wenn du die offizielle Kontakt-E-Mail sicher kennst, sonst null.
6. Antworte AUSSCHLIESSLICH mit einem validen JSON-Array. Kein Markdown. Kein Text.

Schema jedes Objekts:
{
  "name":              "Exakter Unternehmensname",
  "tagline":           "Ein Satz was das Unternehmen macht",
  "match_score":       85,
  "match_begruendung": "1-2 Sätze warum dieses Unternehmen passt",
  "land":              "Deutschland",
  "website":           "https://www.beispiel.de",
  "kontakt_email":     "info@beispiel.de oder null",
  "gruendungsjahr":    2018,
  "teamgroesse":       "50-200"
}`;

const SYSTEM_EN = `You are a leading expert on B2B solution providers, startups and
established software companies, with a focus on the DACH region (Germany, Austria,
Switzerland) and international markets.

Task: A professional at an SME describes a workplace challenge. You find the real
companies that most directly solve this challenge.

Rules:
1. Only name REAL, EXISTING companies – never invented names.
2. Prioritize DACH providers (DE, AT, CH). Add international leaders (USA, UK, EU)
   when no equivalent DACH provider exists.
3. match_score (0–100): Rates how DIRECTLY the provider solves this specific
   challenge – not general industry proximity.
4. website: STRICT RULE – only provide a URL you know with certainty (e.g. celonis.com).
   If there is any doubt about the exact URL, set it to null. NEVER guess or construct
   a URL. Wrong URLs harm users.
5. kontakt_email: Only if you know the official contact email with certainty, else null.
6. Respond ONLY with a valid JSON array. No markdown. No text.

Schema of each object:
{
  "name":              "Exact company name",
  "tagline":           "One sentence describing what the company does",
  "match_score":       85,
  "match_begruendung": "1-2 sentences why this company fits",
  "land":              "Germany",
  "website":           "https://www.example.com",
  "kontakt_email":     "info@example.com or null",
  "gruendungsjahr":    2018,
  "teamgroesse":       "50-200"
}`;

const USER_DE = (challenge: string, n: number) =>
  `Herausforderung eines KMU-Mitarbeiters:\n"${challenge}"\n\nFinde ${n} real existierende Unternehmen, die diese Herausforderung lösen.\nSortiere nach match_score absteigend. Nur JSON-Array:`;

const USER_EN = (challenge: string, n: number) =>
  `Challenge described by an SME professional:\n"${challenge}"\n\nFind ${n} real companies that solve this challenge.\nSort by match_score descending. JSON array only:`;

export async function sucheLoesungsanbieter(
  herausforderung: string,
  apiKey: string,
  sprache: Locale = "de",
  anzahl: number = 8,
): Promise<MatchResult[]> {
  const client = new Anthropic({ apiKey });

  const system = sprache === "en" ? SYSTEM_EN : SYSTEM_DE;
  const userMsg =
    sprache === "en"
      ? USER_EN(herausforderung.trim(), anzahl)
      : USER_DE(herausforderung.trim(), anzahl);

  const nachricht = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: userMsg }],
  });

  let raw =
    nachricht.content[0].type === "text" ? nachricht.content[0].text : "";
  raw = raw.replace(/^```(?:json)?\s*\n?/m, "");
  raw = raw.replace(/\n?```\s*$/m, "");
  raw = raw.trim();

  const ergebnisse: MatchResult[] = JSON.parse(raw);

  for (const e of ergebnisse) {
    e.match_score = Math.max(0, Math.min(100, Math.round(e.match_score ?? 0)));
    e.name = e.name ?? "—";
    e.tagline = e.tagline ?? "";
    e.match_begruendung = e.match_begruendung ?? "";
    e.land = e.land ?? "";
    e.website = e.website ?? null;
    e.kontakt_email = e.kontakt_email ?? null;
    e.gruendungsjahr = e.gruendungsjahr ?? null;
    e.teamgroesse = e.teamgroesse ?? null;
  }

  ergebnisse.sort((a, b) => b.match_score - a.match_score);
  return ergebnisse;
}
