"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { listEntries } from "@/lib/db";
import { seedIfEmpty } from "@/lib/seed-data";
import { EntryCard } from "@/components/EntryCard";
import { WeekProgress } from "@/components/WeekProgress";

export function DashboardClient() {
  const entries = useLiveQuery(() => listEntries(), []);
  const loading = entries === undefined;
  const empty = entries !== undefined && entries.length === 0;
  const seeded = useRef(false);

  // Auto-seed on first load when the database is empty
  useEffect(() => {
    if (empty && !seeded.current) {
      seeded.current = true;
      seedIfEmpty().catch((e) => console.error("Seeding failed:", e));
    }
  }, [empty]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
              Life Design Lab · Spring 2026
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
              A conversation with myself.
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-[60ch]">
              Twice a week: what I noticed, what I reframed, what I did about
              it. Awareness, creative problem solving, bias to action.
            </p>
          </div>
          <WeekProgress />
        </div>
      </section>

      {/* Entries */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl">
            {loading || empty
              ? "Loading\u2026"
              : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
          </h2>
          {!empty && !loading && (
            <Link href="/entry/new" className="btn btn-primary">
              New entry
            </Link>
          )}
        </div>

        {(loading || empty) && <CardSkeletons />}

        {!loading && !empty && (
          <div className="grid gap-4 sm:grid-cols-2">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CardSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-5 animate-pulse space-y-3">
          <div className="h-3 w-24 bg-[var(--border)] rounded" />
          <div className="h-5 w-2/3 bg-[var(--border)] rounded" />
          <div className="h-3 w-full bg-[var(--border)] rounded" />
          <div className="h-3 w-5/6 bg-[var(--border)] rounded" />
        </div>
      ))}
    </div>
  );
}
