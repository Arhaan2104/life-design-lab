import Dexie, { type Table } from "dexie";
import { v4 as uuid } from "uuid";
import type { Entry, PhotoRef } from "./types";

class JournalDB extends Dexie {
  entries!: Table<Entry, string>;
  photos!: Table<PhotoRef, string>;

  constructor() {
    super("life-design-journal");
    this.version(1).stores({
      entries: "id, date, createdAt, updatedAt",
      photos: "id, createdAt",
    });
  }
}

// Lazy singleton: Dexie touches `indexedDB`, so only instantiate in the browser.
let _db: JournalDB | null = null;
export function getDb(): JournalDB {
  if (typeof window === "undefined") {
    throw new Error("getDb() can only run in the browser");
  }
  if (!_db) _db = new JournalDB();
  return _db;
}

// --- Entry queries ----------------------------------------------------
export async function listEntries(): Promise<Entry[]> {
  return getDb().entries.orderBy("date").reverse().toArray();
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  return getDb().entries.get(id);
}

export async function createEntry(input: {
  date: string;
  title?: string;
  awareness: string;
  creativeProblemSolving: string;
  biasToAction: string;
  photoIds?: string[];
}): Promise<Entry> {
  const now = Date.now();
  const entry: Entry = {
    id: uuid(),
    date: input.date,
    title: input.title?.trim() || undefined,
    awareness: input.awareness,
    creativeProblemSolving: input.creativeProblemSolving,
    biasToAction: input.biasToAction,
    photoIds: input.photoIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
  await getDb().entries.add(entry);
  return entry;
}

export async function updateEntry(
  id: string,
  patch: Partial<Omit<Entry, "id" | "createdAt">>,
): Promise<void> {
  await getDb().entries.update(id, { ...patch, updatedAt: Date.now() });
}

export async function deleteEntry(id: string): Promise<void> {
  const entry = await getEntry(id);
  if (!entry) return;
  await getDb().transaction("rw", getDb().entries, getDb().photos, async () => {
    for (const pid of entry.photoIds) {
      await getDb().photos.delete(pid);
    }
    await getDb().entries.delete(id);
  });
}

// --- Photo storage ----------------------------------------------------
export async function addPhoto(blob: Blob, name?: string): Promise<PhotoRef> {
  const photo: PhotoRef = {
    id: uuid(),
    blob,
    name,
    createdAt: Date.now(),
  };
  await getDb().photos.add(photo);
  return photo;
}

export async function getPhoto(id: string): Promise<PhotoRef | undefined> {
  return getDb().photos.get(id);
}

export async function getPhotos(ids: string[]): Promise<PhotoRef[]> {
  if (!ids.length) return [];
  const rows = await getDb().photos.bulkGet(ids);
  return rows.filter((r): r is PhotoRef => !!r);
}

export async function removePhoto(id: string): Promise<void> {
  await getDb().photos.delete(id);
}
