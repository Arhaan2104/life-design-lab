import { SiteHeader } from "@/components/SiteHeader";
import { DashboardClient } from "./dashboard-client";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="page page--wide py-10 sm:py-14">
        <DashboardClient />
      </main>
    </>
  );
}
