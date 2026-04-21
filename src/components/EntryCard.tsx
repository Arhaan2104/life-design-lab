"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Entry } from "@/lib/types";
import { formatDate } from "@/lib/week";
import { PhotoThumb } from "./PhotoThumb";

function snippet(s: string, max = 160) {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s\S*$/, "") + "…";
}

export function EntryCard({ entry, index = 0 }: { entry: Entry; index?: number }) {
  // Prefer awareness as the preview (it's the reflective lead per the PDF),
  // fall back to whichever section has content.
  const preview =
    entry.awareness?.trim() ||
    entry.creativeProblemSolving?.trim() ||
    entry.biasToAction?.trim() ||
    "";
  const hero = entry.photoIds[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.03, 0.2) }}
    >
      <Link
        href={`/entry/${entry.id}`}
        className="card card-binding block p-5 pl-6 hover:border-[var(--ink)] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
              {formatDate(entry.date)}
            </div>
            {entry.title && (
              <h3 className="mt-1 font-serif text-xl leading-tight">
                {entry.title}
              </h3>
            )}
            <p className="mt-2 text-sm text-[var(--ink)]/90 line-clamp-3">
              {snippet(preview)}
            </p>
            {entry.photoIds.length > 0 && (
              <div className="mt-3 text-xs text-[var(--muted)]">
                {entry.photoIds.length} photo
                {entry.photoIds.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
          {hero && (
            <PhotoThumb
              id={hero}
              className="h-20 w-20 rounded-lg object-cover border border-[var(--border)] shrink-0"
              alt=""
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}
