"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listEntries } from "@/lib/db";
import { currentWeekProgress, currentWeekStreak } from "@/lib/week";

export function WeekProgress() {
  const entries = useLiveQuery(() => listEntries(), []);
  if (!entries) {
    // SSR / pre-hydration placeholder (stable height to avoid shift)
    return <div className="h-8" aria-hidden />;
  }
  const progress = currentWeekProgress(entries);
  const streak = currentWeekStreak(entries);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="pill-progress">
        {progress.count}/{progress.goal} this week
      </span>
      <span className="text-sm text-[var(--muted)]">
        {progress.metGoal
          ? "week goal met"
          : progress.count === 1
          ? "one more to hit the 2/week"
          : "two entries / week"}
      </span>
      {streak > 0 && (
        <span className="text-sm text-[var(--muted)]">
          · {streak}-week streak
        </span>
      )}
    </div>
  );
}
