import { NextRequest, NextResponse } from "next/server";
import { sucheLoesungsanbieter, type MatchResult } from "@/lib/matcher";
import { verifziereWebsite, type VerificationResult } from "@/lib/verifier";
import type { Locale } from "@/lib/i18n";

export interface MatchResponseItem extends MatchResult {
  verification: VerificationResult;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY nicht konfiguriert" },
      { status: 500 },
    );
  }

  let body: { challenge: string; locale?: Locale };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 },
    );
  }

  const challenge = body.challenge?.trim();
  if (!challenge) {
    return NextResponse.json(
      { error: "Herausforderung darf nicht leer sein" },
      { status: 400 },
    );
  }

  const locale: Locale = body.locale === "en" ? "en" : "de";

  try {
    // 1. Claude API – Lösungsanbieter finden
    const ergebnisse = await sucheLoesungsanbieter(
      challenge,
      apiKey,
      locale,
    );

    // 2. Websites parallel verifizieren
    const mitVerifikation: MatchResponseItem[] = await Promise.all(
      ergebnisse.map(async (e) => ({
        ...e,
        verification: await verifziereWebsite(e.website),
      })),
    );

    return NextResponse.json({ results: mitVerifikation });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
