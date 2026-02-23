import fs from "node:fs";

const DEFAULT_HANDLES = [
  "alexfinn",
  "shawnryan762",
  "mikebenzcyber",
  "libsoftictok",
  "gregisenberg",
  "patrickbetdavid",
];

type TweetLite = {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: Record<string, number>;
};

function readEnvFallback(key: string): string | undefined {
  const envPath = "/Users/jasper/.openclaw/workspace/integrations/.env";
  if (!fs.existsSync(envPath)) return undefined;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [k, ...rest] = line.split("=");
    if (k.trim() === key) return rest.join("=").trim();
  }
  return undefined;
}

async function getUserId(handle: string, bearer: string): Promise<string | null> {
  const res = await fetch(`https://api.x.com/2/users/by/username/${handle}`, {
    headers: { Authorization: `Bearer ${bearer}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.id ?? null;
}

async function getTweets(userId: string, bearer: string): Promise<TweetLite[]> {
  const params = new URLSearchParams({
    max_results: "5",
    "tweet.fields": "created_at,public_metrics,text",
    exclude: "retweets,replies",
  });
  const res = await fetch(`https://api.x.com/2/users/${userId}/tweets?${params.toString()}`, {
    headers: { Authorization: `Bearer ${bearer}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return (json?.data ?? []) as TweetLite[];
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function getNitterFallback(handle: string): Promise<TweetLite[]> {
  const res = await fetch(`https://nitter.net/${handle}/rss`, { cache: "no-store" });
  if (!res.ok) return [];
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 4);
  return items.map((m) => {
    const block = m[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";
    const id = link.split("/").pop() || `${handle}-${Math.random()}`;
    return {
      id,
      text: decodeXml(title.replace(/<!\[CDATA\[|\]\]>/g, "")),
      created_at: pubDate,
      public_metrics: {},
    };
  });
}

export async function GET(req: Request) {
  const bearer = process.env.X_BEARER_TOKEN || readEnvFallback("X_BEARER_TOKEN");
  const { searchParams } = new URL(req.url);
  const handles = (searchParams.get("handles") || DEFAULT_HANDLES.join(","))
    .split(",")
    .map((h) => h.replace("@", "").trim())
    .filter(Boolean)
    .slice(0, 12);

  const out: Array<{ handle: string; tweets: Array<TweetLite>; source: "x_api" | "fallback_rss"; error?: string }> = [];

  let useFallback = !bearer;

  // quick capability check if bearer exists
  if (bearer) {
    try {
      const probe = await fetch("https://api.x.com/2/users/by/username/gregisenberg", {
        headers: { Authorization: `Bearer ${bearer}` },
        cache: "no-store",
      });
      if (!probe.ok) useFallback = true;
    } catch {
      useFallback = true;
    }
  }

  for (const handle of handles) {
    try {
      if (!useFallback && bearer) {
        const userId = await getUserId(handle, bearer);
        if (!userId) {
          out.push({ handle, tweets: [], source: "x_api", error: "user_not_found_or_no_access" });
          continue;
        }
        const tweets = await getTweets(userId, bearer);
        out.push({ handle, tweets, source: "x_api" });
      } else {
        const tweets = await getNitterFallback(handle);
        out.push({ handle, tweets, source: "fallback_rss" });
      }
    } catch {
      out.push({ handle, tweets: [], source: useFallback ? "fallback_rss" : "x_api", error: "request_failed" });
    }
  }

  return Response.json({ ok: true, mode: useFallback ? "fallback_rss" : "x_api", creators: out });
}
