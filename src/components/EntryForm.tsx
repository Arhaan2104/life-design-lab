"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addPhoto,
  createEntry,
  deleteEntry,
  removePhoto,
  updateEntry,
} from "@/lib/db";
import type { Entry } from "@/lib/types";
import { todayIso } from "@/lib/week";
import { SectionTag } from "./SectionTag";
import { PhotoThumb } from "./PhotoThumb";

type Props = {
  /** Pass an existing entry to edit. Omit to create a new one. */
  initial?: Entry;
};

const PROMPTS = {
  awareness:
    "What did you think/feel about what you learnt? Deep, vulnerable reflections. A belief or mindset that got reframed this week  - what observation pointed at it? No conclusions yet; just what you noticed.",
  cps:
    "How are you integrating design thinking / the mindsets of Life Design? A specific reframe  - not a platitude. What assumption did you challenge? What did you try instead?",
  bias:
    "An action (small or large) you were prompted to take. What did you do, what was the outcome, what's the next step  - and by when?",
};

export function EntryForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [title, setTitle] = useState(initial?.title ?? "");
  const [awareness, setAwareness] = useState(initial?.awareness ?? "");
  const [cps, setCps] = useState(initial?.creativeProblemSolving ?? "");
  const [bias, setBias] = useState(initial?.biasToAction ?? "");
  const [photoIds, setPhotoIds] = useState<string[]>(initial?.photoIds ?? []);

  async function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const ids: string[] = [];
      for (const f of Array.from(files)) {
        const photo = await addPhoto(f, f.name);
        ids.push(photo.id);
      }
      setPhotoIds((prev) => [...prev, ...ids]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      e.target.value = "";
    }
  }

  async function handleRemovePhoto(id: string) {
    setPhotoIds((prev) => prev.filter((p) => p !== id));
    try {
      await removePhoto(id);
    } catch {
      /* ignore; the photo will be orphaned at worst */
    }
  }

  async function handleSave() {
    setErr(null);
    if (!awareness.trim() && !cps.trim() && !bias.trim()) {
      setErr("Fill at least one section before saving.");
      return;
    }
    setSaving(true);
    try {
      if (initial) {
        await updateEntry(initial.id, {
          date,
          title: title.trim() || undefined,
          awareness,
          creativeProblemSolving: cps,
          biasToAction: bias,
          photoIds,
        });
        startTransition(() => router.push(`/entry/${initial.id}`));
      } else {
        const entry = await createEntry({
          date,
          title: title.trim() || undefined,
          awareness,
          creativeProblemSolving: cps,
          biasToAction: bias,
          photoIds,
        });
        startTransition(() => router.push(`/entry/${entry.id}`));
      }
    } catch (e) {
      setErr((e as Error).message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial) return;
    if (
      !confirm(
        "Delete this entry? Photos attached to it will also be removed. Can't be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteEntry(initial.id);
      startTransition(() => router.push("/"));
    } catch (e) {
      setErr((e as Error).message);
      setDeleting(false);
    }
  }

  const busy = saving || deleting || pending;

  return (
    <div className="space-y-8">
      {/* Date + title */}
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Title <span className="normal-case text-[var(--muted)]">(optional)</span>
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The morning after the mixer"
          />
        </label>
      </div>

      {/* Awareness */}
      <Section
        tag={<SectionTag kind="awareness" />}
        prompt={PROMPTS.awareness}
        value={awareness}
        onChange={setAwareness}
      />

      {/* CPS */}
      <Section
        tag={<SectionTag kind="cps" />}
        prompt={PROMPTS.cps}
        value={cps}
        onChange={setCps}
      />

      {/* Bias to Action */}
      <Section
        tag={<SectionTag kind="bias" />}
        prompt={PROMPTS.bias}
        value={bias}
        onChange={setBias}
      />

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Photos
          </span>
          <label className="btn btn-ghost cursor-pointer">
            <span>Add photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoPick}
            />
          </label>
        </div>
        {photoIds.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Optional. Photos stay on this device.
          </p>
        ) : (
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {photoIds.map((id) => (
              <li key={id} className="relative group">
                <PhotoThumb
                  id={id}
                  alt=""
                  className="h-24 w-full object-cover rounded-lg border border-[var(--border)]"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(id)}
                  className="absolute top-1 right-1 text-xs bg-[var(--bg)]/90 border border-[var(--border)] rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      {err && (
        <div className="text-sm text-[var(--coral-ink)] bg-[var(--coral-tint)] border border-[var(--coral)]/30 rounded-lg px-3 py-2">
          {err}
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <div>
          {initial && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={busy}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={handleSave}
          >
            {saving ? "Saving…" : initial ? "Save changes" : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  tag,
  prompt,
  value,
  onChange,
}: {
  tag: React.ReactNode;
  prompt: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">{tag}</div>
      <p className="text-sm text-[var(--muted)] mb-3 max-w-[62ch]">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write honestly. Write slowly."
        rows={6}
      />
    </div>
  );
}
