import type { Entry } from "./types";

/** ISO week key like "2026-W16" */
export function isoWeekKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d + "T00:00:00") : new Date(d);
  // Copy to avoid mutation
  const t = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday of this week determines the ISO year
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export type WeekProgress = {
  key: string;
  count: number;
  goal: number; // always 2 per the PDF
  metGoal: boolean;
};

export function currentWeekProgress(entries: Entry[]): WeekProgress {
  const key = isoWeekKey(new Date());
  const count = entries.filter((e) => isoWeekKey(e.date) === key).length;
  return { key, count, goal: 2, metGoal: count >= 2 };
}

/** Number of consecutive past ISO weeks (ending this week) that met the 2/wk goal */
export function currentWeekStreak(entries: Entry[]): number {
  if (!entries.length) return 0;
  const counts = new Map<string, number>();
  for (const e of entries) {
    const k = isoWeekKey(e.date);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let streak = 0;
  const cursor = new Date();
  // cap at 52 for sanity
  for (let i = 0; i < 52; i++) {
    const k = isoWeekKey(cursor);
    if ((counts.get(k) ?? 0) >= 2) {
      streak++;
      cursor.setDate(cursor.getDate() - 7);
    } else {
      // current (in-progress) week: skip without breaking streak if i===0 and not met yet
      if (i === 0 && (counts.get(k) ?? 0) < 2) {
        cursor.setDate(cursor.getDate() - 7);
        continue;
      }
      break;
    }
  }
  return streak;
}
