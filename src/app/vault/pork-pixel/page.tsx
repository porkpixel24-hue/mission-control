import VaultFileTable from "@/components/VaultFileTable";
import { getVaultFiles } from "@/lib/vault";

export default function VaultPorkPixelPage() {
  const files = getVaultFiles("clients/pork-pixel/");
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">Vault · Pork Pixel</h1>
      <p className="mb-6 text-sm text-zinc-400">Decks, invoices, imagery, proposals, and strategy docs for Pork Pixel.</p>
      <VaultFileTable files={files} />
    </main>
  );
}
