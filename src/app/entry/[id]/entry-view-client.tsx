"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { getEntry } from "@/lib/db";
import { SectionTag } from "@/components/SectionTag";
import { PhotoThumb } from "@/components/PhotoThumb";
import { formatDate } from "@/lib/week";

export function EntryViewClient({ id }: { id: string }) {
  const entry = useLiveQuery(() => getEntry(id), [id]);

  if (entry === undefined) {
    return <div className="text-[var(--muted)]">Loading…</div>;
  }
  if (entry === null || !entry) {
    return (
      <div className="card p-8 space-y-4">
        <h1 className="font-serif text-2xl">Entry not found</h1>
        <p className="text-[var(--muted)]">
          It may have been deleted, or you&rsquo;re on a different device.
        </p>
        <Link href="/" className="btn btn-ghost w-fit">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← Back to dashboard
        </Link>
        <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {formatDate(entry.date)}
        </div>
        {entry.title && (
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight tracking-tight">
            {entry.title}
          </h1>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-[var(--muted)]">
            Last edited{" "}
            {new Date(entry.updatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
          <Link href={`/entry/${entry.id}/edit`} className="btn btn-ghost">
            Edit
          </Link>
        </div>
      </header>

      {entry.photoIds.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entry.photoIds.map((pid) => (
            <PhotoThumb
              key={pid}
              id={pid}
              alt=""
              className="w-full aspect-square object-cover rounded-xl border border-[var(--border)]"
            />
          ))}
        </div>
      )}

      {entry.awareness.trim() && (
        <Block kind="awareness" text={entry.awareness} />
      )}
      {entry.creativeProblemSolving.trim() && (
        <Block kind="cps" text={entry.creativeProblemSolving} />
      )}
      {entry.biasToAction.trim() && (
        <Block kind="bias" text={entry.biasToAction} />
      )}
    </article>
  );
}

function Block({
  kind,
  text,
}: {
  kind: "awareness" | "cps" | "bias";
  text: string;
}) {
  return (
    <section className="space-y-3">
      <SectionTag kind={kind} />
      <div className="prose">
        {text
          .split(/\n{2,}/)
          .map((para, i) => (
            <p key={i}>{para}</p>
          ))}
      </div>
    </section>
  );
}
