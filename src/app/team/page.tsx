const bindings = [
  {
    agent: "President Skroob",
    role: "Delegator / Orchestrator",
    skills: ["campaign-planner", "head-of-marketing", "meta-ads-analyser"],
  },
  {
    agent: "Barf",
    role: "Competitor Intel",
    skills: ["ads-analyst", "meta-ads-extractor", "ad-creative-analysis"],
  },
  {
    agent: "Yogurt",
    role: "Offer Strategist",
    skills: ["website-brand-analysis", "landing-page-analysis", "campaign-planner"],
  },
  {
    agent: "Dot Matrix",
    role: "Funnel + Messaging",
    skills: ["scriptwriter", "landing-page-analysis", "campaign-planner"],
  },
  {
    agent: "Lone Starr",
    role: "Creative Lab",
    skills: ["creative-director", "ad-designer", "page-designer", "frontend-design"],
  },
  {
    agent: "Colonel Sandurz",
    role: "Meta Operator",
    skills: ["meta-ads-publisher", "performance-marketer", "meta-ads-analyser"],
  },
  {
    agent: "Dark Helmet",
    role: "Tracking & Signal",
    skills: ["performance-marketer", "meta-ads-analyser", "ads-analyst"],
  },
];

const flow = [
  "Barf",
  "Yogurt",
  "Dot Matrix + Lone Starr",
  "Colonel Sandurz + Dark Helmet",
  "President Skroob QA",
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Mission Control</p>
        <h1 className="text-2xl font-semibold">Team Runtime Bindings</h1>
        <p className="mt-1 text-sm text-zinc-400">All imported skills are mapped to active Spaceballs agent roles.</p>
      </header>

      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="mb-2 text-sm text-zinc-300">Handoff flow</p>
        <div className="flex flex-wrap gap-2">
          {flow.map((s, i) => (
            <span key={s} className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs">
              {i + 1}. {s}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {bindings.map((b) => (
          <article key={b.agent} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-lg font-semibold">{b.agent}</p>
            <p className="text-xs text-emerald-300">{b.role}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.skills.map((s) => (
                <span key={s} className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
