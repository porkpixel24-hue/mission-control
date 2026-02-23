import fs from "node:fs";
import path from "node:path";

const REPORTS_DIR = "/Users/jasper/.openclaw/workspace/vault/ops/reports";
const ARCHIVE_DIR = "/Users/jasper/.openclaw/workspace/vault/ops/archive";

function listFiles(dir: string, matcher: (name: string) => boolean, out: string[] = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(abs, matcher, out);
    else if (matcher(e.name)) out.push(abs);
  }
  return out;
}

function relFromVault(abs: string) {
  return path.relative("/Users/jasper/.openclaw/workspace/vault", abs);
}

export default function BiweeklyReportsPage() {
  const current = listFiles(REPORTS_DIR, (n) => n.includes("__biweekly-")).sort().reverse();
  const archived = listFiles(ARCHIVE_DIR, (n) => n.includes("__biweekly-")).sort().reverse();

  const chartFiles = [...new Set([...current, ...archived])].filter((f) => f.endsWith(".png"));
  const docFiles = [...new Set([...current, ...archived])].filter((f) => f.endsWith(".pdf") || f.endsWith(".md"));

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Vault · Reports</p>
        <h1 className="text-2xl font-semibold">Biweekly Reports + Archive</h1>
        <p className="mt-1 text-sm text-zinc-400">Current reports and historical archives in one place.</p>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Current files</p>
          <p className="mt-1 text-2xl font-semibold">{current.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Archived files</p>
          <p className="mt-1 text-2xl font-semibold">{archived.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">Charts</p>
          <p className="mt-1 text-2xl font-semibold">{chartFiles.length}</p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-lg font-semibold">Charts</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {chartFiles.map((f) => {
            const rel = relFromVault(f);
            return (
              <a key={f} href={`/api/vault/file?path=${encodeURIComponent(rel)}`} target="_blank" rel="noreferrer" className="rounded border border-zinc-800 bg-zinc-950/60 p-3 hover:border-emerald-400/40">
                <p className="mb-2 text-xs text-zinc-400">{rel}</p>
                <img src={`/api/vault/file?path=${encodeURIComponent(rel)}`} alt={rel} className="h-48 w-full rounded object-contain bg-zinc-900" />
              </a>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-3 text-lg font-semibold">Report Files</h2>
        <ul className="space-y-2 text-sm">
          {docFiles.map((f) => {
            const rel = relFromVault(f);
            return (
              <li key={f} className="rounded border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                <a className="text-zinc-200 hover:text-emerald-300" href={`/api/vault/file?path=${encodeURIComponent(rel)}`} target="_blank" rel="noreferrer">
                  {rel}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
