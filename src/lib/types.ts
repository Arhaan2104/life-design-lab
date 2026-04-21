export type PhotoRef = {
  id: string;
  blob: Blob;
  name?: string;
  createdAt: number;
};

export type Entry = {
  id: string;
  /** ISO date string yyyy-mm-dd - the day the entry is *for* */
  date: string;
  title?: string;
  awareness: string;
  creativeProblemSolving: string;
  biasToAction: string;
  /** photo IDs referencing the photos table */
  photoIds: string[];
  createdAt: number;
  updatedAt: number;
};

export type NewEntryInput = Omit<
  Entry,
  "id" | "createdAt" | "updatedAt" | "photoIds"
> & { photoIds?: string[] };
