import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { EditClient } from "./edit-client";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <SiteHeader />
      <main className="page page--narrow py-10 sm:py-14">
        <div className="mb-8">
          <Link
            href={`/entry/${id}`}
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← Back to entry
          </Link>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
            Edit entry
          </h1>
        </div>
        <EditClient id={id} />
      </main>
    </>
  );
}
