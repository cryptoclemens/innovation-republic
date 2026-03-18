import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PENDING_FILE = path.join(process.cwd(), "data", "startups_pending.json");

interface PendingEntry {
  id: string;
  name: string;
  beschreibung: string;
  tags: string[];
  email: string;
  website: string | null;
  status: "pending" | "approved" | "rejected";
  eingereicht_am: string;
  quelle: string;
}

function checkAuth(req: NextRequest): boolean {
  const adminPw = process.env.ADMIN_PASSWORD || "admin123";
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === adminPw;
}

async function loadEntries(): Promise<PendingEntry[]> {
  try {
    const raw = await fs.readFile(PENDING_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveEntries(entries: PendingEntry[]): Promise<void> {
  await fs.writeFile(PENDING_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

// GET /api/admin – Liste aller Einreichungen + Statistiken
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await loadEntries();

  const stats = {
    total: entries.length,
    pending: entries.filter((e) => e.status === "pending").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  // Tag-Statistiken
  const tagCounts: Record<string, number> = {};
  for (const e of entries) {
    for (const tag of e.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return NextResponse.json({ entries, stats, topTags });
}

// PATCH /api/admin – Status ändern (approve/reject)
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string; action: "approve" | "reject" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.id || !["approve", "reject"].includes(body.action)) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  const entries = await loadEntries();
  const entry = entries.find((e) => e.id === body.id);

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  entry.status = body.action === "approve" ? "approved" : "rejected";
  await saveEntries(entries);

  return NextResponse.json({ success: true, entry });
}
