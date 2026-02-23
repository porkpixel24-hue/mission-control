import type { VaultRow } from "@/lib/vault";

function canConvert(rel: string) {
  return [".txt", ".md", ".json", ".csv"].some((ext) => rel.toLowerCase().endsWith(ext));
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export default function VaultFileTable({ files }: { files: VaultRow[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-300">
          <tr>
            <th className="px-3 py-2">File</th>
            <th className="px-3 py-2">Size</th>
            <th className="px-3 py-2">Updated</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.slice(0, 300).map((f) => {
            const filePath = encodeURIComponent(f.rel);
            return (
              <tr key={f.rel} className="border-t border-zinc-800 bg-zinc-950/70">
                <td className="px-3 py-2 font-mono text-xs text-zinc-200">{f.rel}</td>
                <td className="px-3 py-2 text-zinc-400">{formatBytes(f.size)}</td>
                <td className="px-3 py-2 text-zinc-400">{new Date(f.mtime).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <a
                      href={`/api/vault/file?path=${filePath}`}
                      target="_blank"
                      className="rounded border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
                      rel="noreferrer"
                    >
                      View
                    </a>
                    {canConvert(f.rel) ? (
                      <a
                        href={`/api/vault/convert?path=${filePath}`}
                        target="_blank"
                        className="rounded border border-blue-400/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-300"
                        rel="noreferrer"
                      >
                        Convert → PDF
                      </a>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
