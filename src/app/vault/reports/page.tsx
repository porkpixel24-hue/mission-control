import VaultFileTable from "@/components/VaultFileTable";
import { getVaultFiles } from "@/lib/vault";

export default function VaultReportsPage() {
  const files = getVaultFiles("ops/reports/");
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">Vault · Reports</h1>
      <p className="mb-6 text-sm text-zinc-400">Performance reports, diagnostics, and audit outputs.</p>
      <VaultFileTable files={files} />
    </main>
  );
}
