"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { getEntry } from "@/lib/db";
import { EntryForm } from "@/components/EntryForm";

export function EditClient({ id }: { id: string }) {
  const entry = useLiveQuery(() => getEntry(id), [id]);

  if (entry === undefined) {
    return <div className="text-[var(--muted)]">Loading…</div>;
  }
  if (!entry) {
    return (
      <div className="card p-8 space-y-4">
        <h2 className="font-serif text-2xl">Entry not found</h2>
        <Link href="/" className="btn btn-ghost w-fit">
          Back to dashboard
        </Link>
      </div>
    );
  }
  return <EntryForm initial={entry} />;
}
