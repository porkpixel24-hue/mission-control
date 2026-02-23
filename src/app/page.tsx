type WeatherSnapshot = {
  location: string;
  tempF: string;
  condition: string;
  highF: string;
  lowF: string;
  rainChance: string;
};

type NewsItem = {
  title: string;
  link: string;
  source: string;
};

const creatorHandles = [
  "@alexfinn",
  "@shawnryan762",
  "@mikebenzcyber",
  "@libsoftictok",
  "@gregisenberg",
  "@patrickbetdavid",
];

const blockedNewsSources = ["fox", "cnn", "cbs", "abc", "nbc", "msnbc", "reuters", "ap news"];

const interestQueries = [
  "AI marketing",
  "Google Ads updates",
  "Meta Ads updates",
  "SEO tracking analytics",
  "marketing automation",
  ...creatorHandles.map((h) => `${h.replace("@", "")} X`),
];

const missionStatement =
  "We turn marketing into measurable revenue for growth-minded businesses through clear strategy, high-performance creative, and reliable data systems—executed daily with speed, accountability, and compounding improvements.";

const metaAuditAccounts = ["Pork Pixel", "FLS Auction"];

const agentTeam = [
  {
    name: "President Skroob",
    role: "Delegator / Orchestrator (Spaceballs Command)",
    focus: "Priority setting, routing, QA gate, approval packaging",
    muscles: ["Strategy", "Prioritization", "Delegation", "Quality control"],
    skills: ["Sprint planning", "Task routing", "KPI checkpoints", "Final QA"],
  },
  {
    name: "Barf",
    role: "Research Pod",
    focus: "Competitor extraction + hook/funnel intelligence",
    muscles: ["Research", "Pattern detection", "Intel synthesis", "Gap mapping"],
    skills: ["Ad library mining", "Hook extraction", "Offer clustering", "Funnel analysis"],
  },
  {
    name: "Yogurt",
    role: "Offer Pod",
    focus: "Cross-examine market offers vs Pork Pixel offers/PDFs",
    muscles: ["Positioning", "Packaging", "Value ladder", "Offer clarity"],
    skills: ["Offer gap matrix", "Lead magnet fit", "Pricing narrative", "Objection mapping"],
  },
  {
    name: "Dot Matrix",
    role: "Messaging Pod",
    focus: "Ad/LP/email messaging system by funnel stage",
    muscles: ["Messaging architecture", "Funnel logic", "CTA sequencing", "Conversion UX"],
    skills: ["TOF-MOF-BOF messaging", "Landing page sections", "Email/SMS flows", "Script framing"],
  },
  {
    name: "Lone Starr",
    role: "Creative Pod",
    focus: "Concept and creative variant production cadence",
    muscles: ["Concepting", "Creative iteration", "Visual testing", "Hook variation"],
    skills: ["UGC concepts", "Static variants", "Shot lists", "Overlay systems"],
  },
  {
    name: "Colonel Sandurz",
    role: "Execution Pod",
    focus: "Draft campaign setup for Pork Pixel + FLS Auction",
    muscles: ["Campaign architecture", "Budget controls", "Adset hygiene", "Launch readiness"],
    skills: ["Draft builds", "Audience exclusions", "Naming standards", "Test matrix setup"],
  },
  {
    name: "Dark Helmet",
    role: "Signal Pod",
    focus: "Pixel/CAPI/event quality and measurement integrity",
    muscles: ["Attribution", "Data quality", "Event architecture", "Signal validation"],
    skills: ["CAPI dedupe checks", "Event QA", "UTM standards", "Optimization signal fixes"],
  },
];

const handoffFlow = [
  "Barf",
  "Yogurt",
  "Dot Matrix + Lone Starr",
  "Colonel Sandurz + Dark Helmet",
  "President Skroob QA + approval package",
];

async function getWeather(location: string): Promise<WeatherSnapshot | null> {
  const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;

  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;

    const data = await res.json();
    const current = data?.current_condition?.[0];
    const today = data?.weather?.[0];

    return {
      location,
      tempF: current?.temp_F ?? "—",
      condition: current?.weatherDesc?.[0]?.value ?? "Unknown",
      highF: today?.maxtempF ?? "—",
      lowF: today?.mintempF ?? "—",
      rainChance: today?.hourly?.[0]?.chanceofrain ?? "—",
    };
  } catch {
    return null;
  }
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const query = interestQueries.join(" OR ");
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(rssUrl, { cache: "no-store", signal: AbortSignal.timeout(7000) });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 6);

    return items
      .map((match) => {
        const block = match[1];
        const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Untitled";
        const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "#";
        const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "News";

        return {
          title: decodeHtml(title.replace(/<!\[CDATA\[|\]\]>/g, "")),
          link: link.trim(),
          source: decodeHtml(source),
        };
      })
      .filter((item) => item.link !== "#")
      .filter((item) => {
        const src = item.source.toLowerCase();
        return !blockedNewsSources.some((b) => src.includes(b));
      })
      .sort((a, b) => {
        const score = (item: NewsItem) => {
          const hay = `${item.title} ${item.link}`.toLowerCase();
          return creatorHandles.some((h) => hay.includes(h.replace("@", "").toLowerCase())) ? 1 : 0;
        };
        return score(b) - score(a);
      });
  } catch {
    return [];
  }
}

function getTodayQueue() {
  return [
    {
      title: "Audit Meta account: Pork Pixel",
      impact: "High",
      detail: "Check CAPI/pixel signal health, creative fatigue, funnel alignment, and offer clarity.",
      run: "Generate account audit worksheet",
    },
    {
      title: "Audit Meta account: FLS Auction",
      impact: "High",
      detail: "Review structure, event quality, audience exclusions, and top spend inefficiencies.",
      run: "Generate account audit worksheet",
    },
    {
      title: "Competitor ad spy sprint",
      impact: "High",
      detail: "Find top competitors in Facebook Ad Library and extract hooks, offers, and lead magnets.",
      run: "Build competitor intel board",
    },
    {
      title: "Pork Pixel offer + PDF cross-exam",
      impact: "High",
      detail: "Compare competitor messaging against your current site offer stack and PDF giveaways.",
      run: "Produce gap + action report",
    },
  ];
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const view = params.view === "brain-muscle" ? "brain-muscle" : "ops";

  const [laVernia, southPadre, news] = await Promise.all([
    getWeather("La Vernia, TX"),
    getWeather("South Padre Island, TX"),
    getNews(),
  ]);

  const queue = getTodayQueue();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Pork Pixel</p>
            <h1 className="text-3xl font-semibold">Mission Control</h1>
            <p className="mt-2 text-zinc-400">Blake + Jasper operational cockpit (local)</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">
            <p className="text-zinc-400">Primary Goal</p>
            <p className="font-medium">$15k/mo revenue → $1M exit in 5 years</p>
          </div>
        </header>

        <section className="mb-6 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Operating Guardrail (Pinned)</p>
          <p className="mt-1 text-sm text-amber-100">
            Jasper will not push anything live without Blake’s explicit permission.
          </p>
        </section>

        {view === "brain-muscle" ? (
          <section className="space-y-6">
            <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Mission Statement</p>
              <p className="mt-2 text-lg font-medium text-emerald-100">{missionStatement}</p>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5">
              <h2 className="text-lg font-semibold">Brain to Muscles Flow</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Agent-to-agent flow modeled after your preferred pipeline: Intel → Offer → Messaging/Creative → Meta/Tracking → Jasper QA.
              </p>

              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-300">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-zinc-500">Handoff Sequence</p>
                <div className="flex flex-wrap gap-2">
                  {handoffFlow.map((step, i) => (
                    <span key={step} className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1">
                      {i + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <details open className="w-full max-w-md rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-900/20">
                  <summary className="cursor-pointer list-none">
                    <p className="font-semibold text-emerald-200">🧠 President Skroob — Delegator (Brain)</p>
                    <p className="mt-1 text-xs text-emerald-300/90">Strategy • Priorities • Accountability • Orchestration</p>
                  </summary>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                    <li>Sets daily/weekly priorities against $15k/mo and $1M exit targets</li>
                    <li>Routes work to the right specialist muscle</li>
                    <li>Reviews outputs and enforces quality + speed</li>
                  </ul>
                </details>

                <div className="h-8 w-px bg-zinc-700" />
                <div className="h-4 w-[82%] max-w-4xl border-t border-zinc-700" />

                <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {agentTeam
                    .filter((a) => a.name !== "President Skroob")
                    .map((a) => (
                      <div key={a.name} className="flex flex-col items-center">
                        <div className="h-4 w-px bg-zinc-700" />
                        <details className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 transition hover:border-emerald-400/40 hover:bg-zinc-900">
                          <summary className="cursor-pointer list-none">
                            <p className="font-medium">{a.name}</p>
                            <p className="text-xs text-emerald-300">{a.role}</p>
                            <p className="mt-1 text-xs text-zinc-400">{a.focus}</p>
                          </summary>

                          <div className="mt-3">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Muscles</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {a.muscles.map((m) => (
                                <span key={m} className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs uppercase tracking-wide text-zinc-500">Skill Set</p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-zinc-300">
                              {a.skills.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </section>
        ) : (
          <>
            <section className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Mission Statement</p>
              <p className="mt-2 text-lg font-medium text-emerald-100">{missionStatement}</p>
              <p className="mt-2 text-sm text-emerald-200/90">
                Accountability filter: every task should increase pipeline, improve conversion, strengthen systems, or reduce owner bottleneck.
              </p>
            </section>

            <section className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-indigo-100">Meta Audit Scope (Today)</h2>
                <span className="text-xs text-indigo-200/80">Locked</span>
              </div>
              <p className="mb-3 text-sm text-indigo-100/90">Only these two accounts are in scope for audit and competitor cross-examination.</p>
              <div className="flex flex-wrap gap-2">
                {metaAuditAccounts.map((acct) => (
                  <span key={acct} className="rounded-md border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-100">
                    {acct}
                  </span>
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Agent Team (Spaceballs Crew)</h2>
                <span className="text-xs text-zinc-400">Specialist Pods</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {agentTeam.map((a) => (
                  <div key={a.name} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-emerald-300">{a.role}</p>
                    <p className="mt-1 text-xs text-zinc-400">{a.focus}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Morning Brief</h2>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">Daily 6:00 AM Texas Time</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="mb-2 font-medium text-zinc-300">1) Weather</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[laVernia, southPadre].map((w, idx) => (
                        <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
                          {w ? (
                            <>
                              <p className="font-medium">{w.location}</p>
                              <p className="text-zinc-400">{w.condition}</p>
                              <p className="mt-1">Now {w.tempF}°F · H {w.highF}° / L {w.lowF}°</p>
                              <p className="text-zinc-400">Rain chance: {w.rainChance}%</p>
                            </>
                          ) : (
                            <p className="text-zinc-400">Weather unavailable right now.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-medium text-zinc-300">2) Top News (Your Interests)</p>
                    <ul className="space-y-2">
                      {news.length ? (
                        news.map((item) => (
                          <li key={item.link} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                            <a href={item.link} target="_blank" rel="noreferrer" className="font-medium hover:text-emerald-300">
                              {item.title}
                            </a>
                            <p className="text-xs text-zinc-400">{item.source}</p>
                          </li>
                        ))
                      ) : (
                        <li className="text-zinc-400">News feed temporarily unavailable.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 font-medium text-zinc-300">3) Google Calendar</p>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 text-zinc-300">
                      <p>
                        Calendar integration target: <span className="font-medium">porkpixel24@gmail.com</span>
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">Next step: connect Google Calendar API to display today’s events here.</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Today Queue</h2>
                  <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">Execution Mode</span>
                </div>

                <p className="mb-4 text-sm text-zinc-400">Tasks Jasper can run today to push revenue and build leverage.</p>

                <div className="space-y-3">
                  {queue.map((item) => (
                    <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className="text-xs text-emerald-300">Impact: {item.impact}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{item.detail}</p>
                      <div className="mt-3">
                        <button className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                          {item.run}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-400">
                  Tip: Reply in chat with <span className="text-zinc-200">“run 1”</span>, <span className="text-zinc-200">“run 2”</span>, etc. and Jasper will execute.
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
