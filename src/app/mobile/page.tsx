import Link from "next/link";

const quickCards = [
  { title: "Morning Brief", value: "6:00 AM CT", note: "Daily Telegram delivery" },
  { title: "Mission", value: "$15k/mo → $1M exit", note: "Revenue + systems compounding" },
  { title: "Guardrail", value: "Approval Required", note: "Nothing goes live without Blake" },
];

const team = [
  ["Jasper Prime", "Chief of Staff"],
  ["Radar Rick", "Research"],
  ["Closer Chappie", "Copy"],
  ["Pixel Punch", "Creative"],
  ["Meta Mojo", "Social"],
];

export default function MobileMissionControl() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-20 pt-5 text-zinc-100">
      <header className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Pork Pixel</p>
        <h1 className="text-2xl font-semibold">Mission Control Mobile</h1>
        <p className="mt-1 text-sm text-zinc-400">Quick command center for phone</p>
      </header>

      <section className="mb-4 rounded-xl border border-amber-400/40 bg-amber-500/10 p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">Pinned Guardrail</p>
        <p className="mt-1 text-sm text-amber-100">No live pushes without Blake’s explicit approval.</p>
      </section>

      <section className="space-y-3">
        {quickCards.map((c) => (
          <article key={c.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-xs text-zinc-400">{c.title}</p>
            <p className="mt-1 text-base font-semibold">{c.value}</p>
            <p className="text-xs text-zinc-500">{c.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
        <h2 className="text-sm font-semibold">Brain → Muscles</h2>
        <ul className="mt-2 space-y-2">
          {team.map(([name, role]) => (
            <li key={name} className="flex items-center justify-between rounded-lg bg-zinc-950/60 px-3 py-2 text-sm">
              <span>{name}</span>
              <span className="text-xs text-emerald-300">{role}</span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between text-xs">
          <Link href="/mobile" className="rounded-md bg-emerald-500/20 px-3 py-2 text-emerald-300">Mobile</Link>
          <Link href="/" className="rounded-md bg-zinc-800 px-3 py-2 text-zinc-200">Ops</Link>
          <Link href="/?view=brain-muscle" className="rounded-md bg-zinc-800 px-3 py-2 text-zinc-200">Flow</Link>
          <Link href="/files" className="rounded-md bg-zinc-800 px-3 py-2 text-zinc-200">Files</Link>
        </div>
      </nav>
    </main>
  );
}
