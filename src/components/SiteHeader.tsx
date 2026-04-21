import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="no-print border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur sticky top-0 z-20">
      <div className="page page--wide flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            aria-hidden
            className="inline-block h-6 w-1.5 rounded-sm bg-[var(--coral)]"
          />
          <span className="font-serif text-lg tracking-tight">
            Life Design Journal
          </span>
          <span className="text-xs text-[var(--muted)] hidden md:inline">
            · Arhaan Gupta · Spring 2026
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/export" className="btn btn-ghost">
            Export
          </Link>
          <ThemeToggle />
          <Link href="/entry/new" className="btn btn-primary">
            New entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
