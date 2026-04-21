import { SiteHeader } from "@/components/SiteHeader";
import { ExportClient } from "./export-client";

export default function ExportPage() {
  return (
    <>
      <SiteHeader />
      <main className="page page--narrow py-10 sm:py-14">
        <ExportClient />
      </main>
    </>
  );
}
