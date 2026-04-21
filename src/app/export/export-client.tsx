"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listEntries } from "@/lib/db";
import { SectionTag } from "@/components/SectionTag";
import { PhotoThumb } from "@/components/PhotoThumb";
import { formatDate } from "@/lib/week";

export function ExportClient() {
  const entries = useLiveQuery(() => listEntries(), []);

  if (entries === undefined) {
    return <div className="text-[var(--muted)]">Loading…</div>;
  }
  // Chronological (oldest → newest) for the printed artifact.
  const inOrder = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-12">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">
            Export
          </h1>
          <p className="mt-2 text-[var(--muted)] max-w-[56ch]">
            Press <kbd>⌘P</kbd> (or <kbd>Ctrl+P</kbd>) and choose{" "}
            <em>Save as PDF</em>. The on-screen nav will be hidden in print.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
          type="button"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Cover */}
      <section className="card p-10 sm:p-16 text-center space-y-8">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            Life Design Lab · Spring 2026
          </div>
          <h2 className="mt-6 font-serif text-5xl sm:text-6xl leading-[1.02] tracking-tight">
            My Life Design Journal
          </h2>
          <div
            aria-hidden
            className="mx-auto mt-6 h-[3px] w-16 bg-[var(--coral)] rounded-full"
          />
        </div>
        <div className="space-y-1">
          <div className="font-serif text-2xl">Arhaan Gupta</div>
          <div className="text-[var(--muted)]">Ashoka University</div>
          <div className="text-[var(--muted)] text-sm">
            Psychology · Entrepreneurship
          </div>
        </div>
        <div className="text-xs text-[var(--muted)]">
          {inOrder.length} {inOrder.length === 1 ? "entry" : "entries"}
        </div>
      </section>

      {/* Entries */}
      {inOrder.length === 0 ? (
        <p className="text-[var(--muted)]">
          No entries yet. Write one and it&rsquo;ll appear here.
        </p>
      ) : (
        inOrder.map((entry, idx) => (
          <section
            key={entry.id}
            className={`card p-8 sm:p-10 space-y-6 ${
              idx > 0 ? "print-page-break" : ""
            }`}
          >
            <header className="space-y-2">
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Entry {idx + 1} · {formatDate(entry.date)}
              </div>
              {entry.title && (
                <h3 className="font-serif text-3xl leading-tight">
                  {entry.title}
                </h3>
              )}
            </header>

            {entry.photoIds.length > 0 && (
              <div
                className={
                  entry.photoIds.length === 1
                    ? "grid grid-cols-1 gap-3"
                    : "grid grid-cols-2 gap-3"
                }
              >
                {entry.photoIds.slice(0, 4).map((pid) => (
                  <PhotoThumb
                    key={pid}
                    id={pid}
                    alt=""
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-[var(--border)]"
                  />
                ))}
              </div>
            )}

            {entry.awareness.trim() && (
              <ExportBlock kind="awareness" text={entry.awareness} />
            )}
            {entry.creativeProblemSolving.trim() && (
              <ExportBlock kind="cps" text={entry.creativeProblemSolving} />
            )}
            {entry.biasToAction.trim() && (
              <ExportBlock kind="bias" text={entry.biasToAction} />
            )}
          </section>
        ))
      )}
    </div>
  );
}

function ExportBlock({
  kind,
  text,
}: {
  kind: "awareness" | "cps" | "bias";
  text: string;
}) {
  return (
    <div className="space-y-2">
      <SectionTag kind={kind} />
      <div className="prose">
        {text.split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
