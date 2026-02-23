"use client";

import { useEffect, useMemo, useState } from "react";

const creatorHandles = [
  "alexfinn",
  "shawnryan762",
  "mikebenzcyber",
  "libsoftictok",
  "gregisenberg",
  "patrickbetdavid",
];

type Tweet = {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: { like_count?: number; retweet_count?: number; reply_count?: number };
};

type CreatorRow = { handle: string; tweets: Tweet[]; error?: string };

export default function CreatorsPage() {
  const [rows, setRows] = useState<CreatorRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mode, setMode] = useState<"x_api" | "fallback_rss" | "unknown">("unknown");
  const handlesQuery = useMemo(() => creatorHandles.join(","), []);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/x/creators?handles=${encodeURIComponent(handlesQuery)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (!json?.ok) {
          setStatus("error");
          return;
        }
        setRows(json.creators || []);
        setMode(json.mode || "unknown");
        setStatus("ready");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("error");
      });
    return () => {
      mounted = false;
    };
  }, [handlesQuery]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Signal Feed</p>
        <h1 className="text-2xl font-semibold">Top Creators</h1>
        <p className="mt-1 text-sm text-zinc-400">Live pull via X API (latest non-reply/non-retweet posts).</p>
      </header>

      {status === "loading" ? <p className="mb-4 text-sm text-zinc-400">Loading creator feed…</p> : null}
      {status === "error" ? (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          Feed unavailable right now.
        </div>
      ) : null}
      {status === "ready" && mode === "fallback_rss" ? (
        <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-200">
          Running in fallback mode (public RSS mirrors) while X API access tier is restricted.
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {(rows.length ? rows : creatorHandles.map((h) => ({ handle: h, tweets: [] }))).map((row) => (
          <article key={row.handle} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-lg font-semibold">@{row.handle}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <a
                href={`https://x.com/${row.handle}`}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-300"
              >
                Open profile
              </a>
            </div>

            <div className="mt-3 space-y-2">
              {row.error ? <p className="text-xs text-amber-300">{row.error}</p> : null}
              {!row.error && row.tweets.length === 0 ? (
                <p className="text-xs text-zinc-500">No recent tweets loaded.</p>
              ) : null}
              {row.tweets.slice(0, 2).map((t) => (
                <div key={t.id} className="rounded border border-zinc-800 bg-zinc-950/50 p-2">
                  <p className="line-clamp-3 text-xs text-zinc-200">{t.text}</p>
                  <a
                    href={`https://x.com/${row.handle}/status/${t.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    View tweet
                  </a>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
