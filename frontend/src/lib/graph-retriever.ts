/**
 * Innovation Republic · Graph-RAG Retriever
 *
 * Durchsucht den In-Memory-Graph nach relevanten Startups für eine Suchanfrage.
 * Kombiniert Keyword-Matching auf Problem-/Branchen-Knoten mit Graph-Traversierung.
 */

import { buildGraph, type GraphNode } from "./graph";

export interface RetrievedStartup {
  name: string;
  beschreibung: string;
  land: string;
  website: string | null;
  gruendungsjahr: number | null;
  quelle: "graph-seed" | "graph-onboarding";
  relevanzGrund: string;
}

export interface GraphContext {
  startups: RetrievedStartup[];
  verwandteProbleme: string[];
  hatKontext: boolean;
}

const STOP_WORDS = new Set([
  "ich", "wir", "ein", "eine", "einer", "eines", "einem", "einen",
  "der", "die", "das", "des", "dem", "den",
  "und", "oder", "aber", "für", "mit", "bei", "von", "zu", "auf",
  "im", "ist", "sind", "haben", "hatte", "wird", "wird", "werden",
  "brauche", "suche", "suchen", "problem", "herausforderung", "lösung",
  "hilfe", "bitte", "wie", "kann", "können", "unser", "unsere",
  "gibt", "gibt", "auch", "noch", "mehr", "sehr", "viel",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\wäöüß\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function nodeMatchesKeywords(node: GraphNode, keywords: string[]): boolean {
  const haystack = `${node.label} ${node.beschreibung ?? ""}`.toLowerCase();
  return keywords.some((kw) => haystack.includes(kw));
}

/**
 * Sucht im Graph nach Startups, die zur gegebenen Herausforderung passen.
 * Gibt Kontext zurück, der als Prompt-Erweiterung für Claude verwendet wird.
 */
export function retrieveGraphContext(herausforderung: string): GraphContext {
  const graph = buildGraph();
  const keywords = tokenize(herausforderung);

  if (keywords.length === 0) {
    return { startups: [], verwandteProbleme: [], hatKontext: false };
  }

  // 1. Finde passende Nicht-Startup-Knoten (Probleme, Branchen, Technologien)
  const matchedNodeIds = new Set<string>();
  for (const [id, node] of graph.nodes) {
    if (node.type !== "startup" && nodeMatchesKeywords(node, keywords)) {
      matchedNodeIds.add(id);
      // Verwandte Probleme mit einbeziehen (1-Hop)
      graph.edges
        .filter((edge) => edge.from === id && edge.type === "VERWANDT_MIT")
        .forEach((edge) => matchedNodeIds.add(edge.to));
    }
  }

  // 2. Finde Startups, die mit den gematchten Knoten verbunden sind
  const startupScores = new Map<string, { score: number; gruende: string[] }>();

  for (const edge of graph.edges) {
    if (matchedNodeIds.has(edge.to)) {
      const node = graph.nodes.get(edge.from);
      if (node?.type === "startup") {
        const entry = startupScores.get(edge.from) ?? { score: 0, gruende: [] };
        entry.score += 1;
        const zielLabel = graph.nodes.get(edge.to)?.label;
        if (zielLabel && !entry.gruende.includes(zielLabel)) {
          entry.gruende.push(zielLabel);
        }
        startupScores.set(edge.from, entry);
      }
    }
  }

  // 3. Direktes Keyword-Matching auf Startup-Label und -Beschreibung (Bonus)
  for (const [id, node] of graph.nodes) {
    if (node.type === "startup" && nodeMatchesKeywords(node, keywords)) {
      const entry = startupScores.get(id) ?? { score: 0, gruende: [] };
      entry.score += 2;
      startupScores.set(id, entry);
    }
  }

  // 4. Sortieren und Top-Startups extrahieren
  const sorted = [...startupScores.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 6);

  const startups: RetrievedStartup[] = sorted.map(([id, { gruende }]) => {
    const node = graph.nodes.get(id)!;
    return {
      name: node.label,
      beschreibung: node.beschreibung ?? "",
      land: node.metadata?.land ?? "",
      website: node.metadata?.website ?? null,
      gruendungsjahr: node.metadata?.gruendungsjahr ?? null,
      quelle:
        node.metadata?.quelle === "onboarding"
          ? "graph-onboarding"
          : "graph-seed",
      relevanzGrund: gruende.join(", "),
    };
  });

  // 5. Verwandte Probleme als Kontext für Claude sammeln
  const verwandteProbleme = [...matchedNodeIds]
    .map((id) => graph.nodes.get(id))
    .filter((n): n is GraphNode => n?.type === "problem")
    .map((n) => n.label);

  return {
    startups,
    verwandteProbleme,
    hatKontext: startups.length > 0,
  };
}

/**
 * Formatiert den Graph-Kontext als Prompt-Abschnitt für Claude.
 */
export function formatGraphContextForPrompt(
  kontext: GraphContext,
  sprache: "de" | "en" = "de",
): string {
  if (!kontext.hatKontext) return "";

  if (sprache === "en") {
    const lines = [
      "VERIFIED PROVIDERS FROM KNOWLEDGE GRAPH (prioritize these):",
      ...kontext.startups.map(
        (s) =>
          `- ${s.name} (${s.land}${s.gruendungsjahr ? ", est. " + s.gruendungsjahr : ""}): ${s.beschreibung}` +
          (s.website ? ` | ${s.website}` : "") +
          ` [relevant for: ${s.relevanzGrund}]`,
      ),
    ];
    if (kontext.verwandteProbleme.length > 0) {
      lines.push(
        `\nRelated problem areas: ${kontext.verwandteProbleme.join(", ")}`,
      );
    }
    return lines.join("\n");
  }

  const lines = [
    "VERIFIZIERTE ANBIETER AUS DEM WISSENSGRAPHEN (bevorzugt berücksichtigen):",
    ...kontext.startups.map(
      (s) =>
        `- ${s.name} (${s.land}${s.gruendungsjahr ? ", gegr. " + s.gruendungsjahr : ""}): ${s.beschreibung}` +
        (s.website ? ` | ${s.website}` : "") +
        ` [relevant für: ${s.relevanzGrund}]`,
    ),
  ];
  if (kontext.verwandteProbleme.length > 0) {
    lines.push(`\nVerwandte Problemfelder: ${kontext.verwandteProbleme.join(", ")}`);
  }
  return lines.join("\n");
}
