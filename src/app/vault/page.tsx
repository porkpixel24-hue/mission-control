import VaultFileTable from "@/components/VaultFileTable";
import { getVaultFiles } from "@/lib/vault";

export default function VaultPage() {
  const files = getVaultFiles();

  const groups = {
    Inbox: files.filter((f) => f.rel.startsWith("00-inbox/")),
    "Pork Pixel": files.filter((f) => f.rel.startsWith("clients/pork-pixel/")),
    "FLS Auction": files.filter((f) => f.rel.startsWith("clients/fls-auction/")),
    Shared: files.filter((f) => f.rel.startsWith("shared/")),
    Ops: files.filter((f) => f.rel.startsWith("ops/")),
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Mission Control</p>
        <h1 className="text-2xl font-semibold">Vault</h1>
        <p className="mt-1 text-sm text-zinc-400">Organized storage for decks, invoices, imagery, strategy docs, proposals, and ops files.</p>
      </header>

      <section className="mb-6 grid gap-3 md:grid-cols-5">
        {Object.entries(groups).map(([name, list]) => (
          <div key={name} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-sm text-zinc-400">{name}</p>
            <p className="mt-1 text-2xl font-semibold">{list.length}</p>
            <p className="text-xs text-zinc-500">files</p>
          </div>
        ))}
      </section>

      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
        <p className="font-medium">Workflow</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-300">
          <li>Drop incoming files into <span className="font-mono">vault/00-inbox</span>.</li>
          <li>Sort into client folders during daily review.</li>
          <li>Use consistent filenames: <span className="font-mono">YYYY-MM-DD__client__title.ext</span>.</li>
        </ol>
      </section>

      <VaultFileTable files={files} />
    </main>
  );
}
