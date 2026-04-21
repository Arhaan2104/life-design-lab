import { SiteHeader } from "@/components/SiteHeader";
import { EntryViewClient } from "./entry-view-client";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <SiteHeader />
      <main className="page page--narrow py-10 sm:py-14">
        <EntryViewClient id={id} />
      </main>
    </>
  );
}
