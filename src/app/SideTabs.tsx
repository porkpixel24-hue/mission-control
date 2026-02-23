"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function tabClass(active: boolean) {
  return `block rounded-md px-3 py-2 text-sm transition ${
    active
      ? "bg-emerald-500/20 text-emerald-300"
      : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
  }`;
}

function Section({ title }: { title: string }) {
  return <p className="pt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">{title}</p>;
}

export default function SideTabs() {
  const pathname = usePathname();
  const params = useSearchParams();
  const view = params.get("view") ?? "ops";

  return (
    <aside className="w-72 shrink-0 border-r border-zinc-800 bg-zinc-950/80 p-4">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-500">Mission Control</p>
      <nav className="space-y-2">
        <Section title="Dashboard" />
        <Link href="/?view=ops" className={tabClass(pathname === "/" && view !== "brain-muscle")}>
          Ops Dashboard
        </Link>
        <Link
          href="/?view=brain-muscle"
          className={tabClass(pathname === "/" && view === "brain-muscle")}
        >
          Brain → Muscles
        </Link>

        <Section title="Vault" />
        <Link href="/vault" className={tabClass(pathname === "/vault")}>
          Overview
        </Link>
        <Link href="/vault/inbox" className={tabClass(pathname === "/vault/inbox")}>
          Inbox
        </Link>
        <Link href="/vault/pork-pixel" className={tabClass(pathname === "/vault/pork-pixel")}>
          Pork Pixel
        </Link>
        <Link href="/vault/fls-auction" className={tabClass(pathname === "/vault/fls-auction")}>
          FLS Auction
        </Link>
        <Link href="/vault/refresh-packs" className={tabClass(pathname === "/vault/refresh-packs")}>
          Refresh Packs
        </Link>
        <Link href="/vault/reports" className={tabClass(pathname === "/vault/reports")}>
          Reports
        </Link>

        <Section title="Signals" />
        <Link href="/creators" className={tabClass(pathname === "/creators")}>
          Top Creators
        </Link>

        <Section title="Tools" />
        <Link href="/files" className={tabClass(pathname === "/files")}>
          File Hub
        </Link>
        <Link href="/mobile" className={tabClass(pathname === "/mobile")}>
          Mobile View
        </Link>
      </nav>
    </aside>
  );
}
