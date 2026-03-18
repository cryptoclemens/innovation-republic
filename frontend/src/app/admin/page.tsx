"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PendingEntry {
  id: string;
  name: string;
  beschreibung: string;
  tags: string[];
  email: string;
  website: string | null;
  status: "pending" | "approved" | "rejected";
  eingereicht_am: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

type Tab = "pending" | "all";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topTags, setTopTags] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async (tok: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) {
        setToken(null);
        sessionStorage.removeItem("admin_token");
        return;
      }
      const data = await res.json();
      setEntries(data.entries);
      setStats(data.stats);
      setTopTags(data.topTags);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      fetchData(saved);
    }
  }, [fetchData]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const tok = password.trim();
    if (!tok) return;
    setToken(tok);
    sessionStorage.setItem("admin_token", tok);
    setLoginError(false);
    fetchData(tok).then(() => {
      // If fetchData clears token, show error
      setTimeout(() => {
        if (!sessionStorage.getItem("admin_token")) {
          setLoginError(true);
        }
      }, 500);
    });
  }

  function handleLogout() {
    setToken(null);
    setPassword("");
    sessionStorage.removeItem("admin_token");
    setEntries([]);
    setStats(null);
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        await fetchData(token);
      }
    } finally {
      setActionLoading(null);
    }
  }

  // Login screen
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              IR
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Admin-Zugang
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Innovation Republic – Startup-Moderation
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pw" className="sr-only">Passwort</label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                autoFocus
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            {loginError && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                Falsches Passwort
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Anmelden
            </button>
          </form>

          <p className="mt-4 text-center">
            <Link href="/" className="text-sm text-sky-600 hover:underline dark:text-sky-400">
              Zurück zur Suche
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const pendingEntries = entries.filter((e) => e.status === "pending");
  const displayEntries = tab === "pending" ? pendingEntries : entries;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Admin-Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Innovation Republic – Startup-Moderation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Zur Suche
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["Gesamt", stats.total, "bg-slate-100 dark:bg-slate-800"],
            ["Ausstehend", stats.pending, "bg-amber-50 dark:bg-amber-900/20"],
            ["Freigeschaltet", stats.approved, "bg-green-50 dark:bg-green-900/20"],
            ["Abgelehnt", stats.rejected, "bg-red-50 dark:bg-red-900/20"],
          ] as const).map(([label, value, bg]) => (
            <div key={label} className={`rounded-xl p-4 ${bg}`}>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div className="mb-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Top-Kategorien
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              >
                {tag} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {([
          ["pending", `Ausstehend (${pendingEntries.length})`],
          ["all", `Alle (${entries.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Laden…</div>
      ) : displayEntries.length === 0 ? (
        <div className="rounded-xl border border-slate-200 py-12 text-center dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tab === "pending"
              ? "Keine ausstehenden Einreichungen"
              : "Noch keine Einreichungen vorhanden"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {entry.name}
                    </h3>
                    <StatusBadge status={entry.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {entry.beschreibung}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
                    <span>{entry.email}</span>
                    {entry.website && <span>{entry.website}</span>}
                    <span>
                      {new Date(entry.eingereicht_am).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {entry.status === "pending" && (
                  <div className="flex gap-2 sm:flex-col">
                    <button
                      onClick={() => handleAction(entry.id, "approve")}
                      disabled={actionLoading === entry.id}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Freischalten
                    </button>
                    <button
                      onClick={() => handleAction(entry.id, "reject")}
                      disabled={actionLoading === entry.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Ablehnen
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const labels: Record<string, string> = {
    pending: "Ausstehend",
    approved: "Freigeschaltet",
    rejected: "Abgelehnt",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
}
