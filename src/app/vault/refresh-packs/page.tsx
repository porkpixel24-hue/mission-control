import VaultFileTable from "@/components/VaultFileTable";
import { getVaultFiles } from "@/lib/vault";

export default function VaultRefreshPacksPage() {
  const files = getVaultFiles("ops/refresh-packs/");
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">Vault · Refresh Packs</h1>
      <p className="mb-6 text-sm text-zinc-400">Bi-weekly packs, creative bundles, and approval-ready campaign docs.</p>
      <VaultFileTable files={files} />
    </main>
  );
}
