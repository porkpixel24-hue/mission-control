import VaultFileTable from "@/components/VaultFileTable";
import { getVaultFiles } from "@/lib/vault";

export default function VaultInboxPage() {
  const files = getVaultFiles("00-inbox/");
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <h1 className="mb-2 text-2xl font-semibold">Vault · Inbox</h1>
      <p className="mb-6 text-sm text-zinc-400">New files land here first before being sorted.</p>
      <VaultFileTable files={files} />
    </main>
  );
}
