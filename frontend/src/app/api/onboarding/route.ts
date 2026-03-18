import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export interface OnboardingPayload {
  name: string;
  beschreibung: string;
  tags: string[];
  email: string;
  website: string | null;
}

interface PendingEntry extends OnboardingPayload {
  id: string;
  status: "pending" | "approved" | "rejected";
  eingereicht_am: string;
  quelle: "self-onboarding";
}

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "startups_pending.json");

async function ensureDataFile(): Promise<PendingEntry[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(PENDING_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  let body: OnboardingPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 },
    );
  }

  // Server-side validation
  const errors: string[] = [];

  if (!body.name?.trim()) errors.push("name");
  if (!body.beschreibung?.trim()) errors.push("beschreibung");
  if (body.beschreibung && body.beschreibung.length > 500) errors.push("beschreibung_lang");
  if (!body.tags || body.tags.length === 0) errors.push("tags");
  if (!body.email?.trim() || !body.email.includes("@")) errors.push("email");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validierungsfehler", fields: errors },
      { status: 400 },
    );
  }

  const entry: PendingEntry = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    beschreibung: body.beschreibung.trim(),
    tags: body.tags,
    email: body.email.trim(),
    website: body.website?.trim() || null,
    status: "pending",
    eingereicht_am: new Date().toISOString(),
    quelle: "self-onboarding",
  };

  try {
    const entries = await ensureDataFile();
    entries.push(entry);
    await fs.writeFile(PENDING_FILE, JSON.stringify(entries, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const entries = await ensureDataFile();
  return NextResponse.json({ entries });
}
