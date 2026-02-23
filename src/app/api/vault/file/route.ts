import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/jasper/.openclaw/workspace/vault";

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
    if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      return new Response("Not found", { status: 404 });
    }
    const buf = fs.readFileSync(abs);
    const ext = path.extname(abs).toLowerCase();
    const map: Record<string, string> = {
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".txt": "text/plain; charset=utf-8",
      ".md": "text/markdown; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".csv": "text/csv; charset=utf-8",
      ".html": "text/html; charset=utf-8",
    };
    const type = map[ext] ?? "application/octet-stream";
    return new Response(buf, {
      headers: {
        "content-type": type,
        "content-disposition": `inline; filename=\"${path.basename(abs)}\"`,
      },
    });
  } catch {
    return new Response("Bad request", { status: 400 });
  }
}
