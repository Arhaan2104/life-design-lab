import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { EntryForm } from "@/components/EntryForm";

export default function NewEntryPage() {
  return (
    <>
      <SiteHeader />
      <main className="page page--narrow py-10 sm:py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl tracking-tight">
            New entry
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Three sections. Any order. You can save with just one filled in
            and come back.
          </p>
        </div>
        <EntryForm />
      </main>
    </>
  );
}
