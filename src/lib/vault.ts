import fs from "node:fs";
import path from "node:path";

export type VaultRow = {
  rel: string;
  size: number;
  mtime: number;
};

export const VAULT_ROOT = "/Users/jasper/.openclaw/workspace/vault";

export function walkVault(dir: string, out: VaultRow[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkVault(abs, out);
      continue;
    }
    const st = fs.statSync(abs);
    out.push({ rel: path.relative(VAULT_ROOT, abs), size: st.size, mtime: st.mtimeMs });
  }
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export function getVaultFiles(prefix?: string) {
  const files: VaultRow[] = [];
  if (fs.existsSync(VAULT_ROOT)) walkVault(VAULT_ROOT, files);
  files.sort((a, b) => b.mtime - a.mtime);
  if (!prefix) return files;
  return files.filter((f) => f.rel.startsWith(prefix));
}
