import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "/Users/jasper/.openclaw/workspace/vault";
const SCRIPT = "/Users/jasper/.openclaw/workspace/ops/text_to_pdf.py";

function safeResolve(rel: string) {
  const decoded = decodeURIComponent(rel || "");
  const abs = path.resolve(ROOT, decoded);
  if (!abs.startsWith(path.resolve(ROOT) + path.sep) && abs !== path.resolve(ROOT)) {
    throw new Error("Invalid path");
  }
  return abs;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rel = searchParams.get("path") || "";
    const abs = safeResolve(rel);
    const ext = path.extname(abs).toLowerCase();
    if (![".txt", ".md", ".json", ".csv"].includes(ext)) {
      return new Response("Unsupported file type for PDF conversion", { status: 400 });
    }
    if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      return new Response("Not found", { status: 404 });
    }

    const out = abs.replace(new RegExp(`${ext}$`), "") + ".pdf";
    execFileSync("python3", [SCRIPT, abs, out], { stdio: "pipe" });

    const relOut = path.relative(ROOT, out);
    const viewUrl = `/api/vault/file?path=${encodeURIComponent(relOut)}`;
    return Response.redirect(new URL(viewUrl, req.url), 302);
  } catch {
    return new Response("Conversion failed", { status: 500 });
  }
}
