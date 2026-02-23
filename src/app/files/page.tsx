import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type FileRow = {
  rel: string;
  abs: string;
  size: number;
  mtime: string;
};

const ROOT = "/Users/jasper/.openclaw/workspace";
const SCAN_DIRS = ["ops", "integrations", "memory", "mission-control"];

function walk(dir: string, out: FileRow[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(e.name)) continue;
      walk(abs, out);
      continue;
    }
    const st = fs.statSync(abs);
    out.push({
      abs,
      rel: path.relative(ROOT, abs),
      size: st.size,
      mtime: st.mtime.toISOString(),
    });
  }
}

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export default function FilesPage() {
  const files: FileRow[] = [];
  for (const d of SCAN_DIRS) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) walk(abs, files);
  }

  files.sort((a, b) => (a.mtime < b.mtime ? 1 : -1));

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Mission Control</p>
          <h1 className="text-2xl font-semibold">File Hub</h1>
          <p className="mt-1 text-sm text-zinc-400">Organized view of active workspace files</p>
        </div>
        <Link href="/" className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-200">Back to Dashboard</Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.rel} className="border-t border-zinc-800 bg-zinc-950/70">
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{f.rel}</td>
                <td className="px-3 py-2 text-zinc-400">{bytes(f.size)}</td>
                <td className="px-3 py-2 text-zinc-400">{new Date(f.mtime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
