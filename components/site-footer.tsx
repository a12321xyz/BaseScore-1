import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 flex flex-col gap-4 border-t border-[#1a1a1a] py-8 text-sm font-mono text-[#555] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[#00ff00] opacity-30"></div>
        <p>Built open-source. Algorithmic Base diagnostics.</p>
      </div>
      <div className="flex flex-wrap gap-6">
        <Link href="/" className="transition hover:text-white">
          BaseScore
        </Link>
        <a href="https://x.com/a12321xyz" target="_blank" rel="noreferrer" className="transition hover:text-white">
          X / Twitter
        </a>
        <a href="https://base.org" target="_blank" rel="noreferrer" className="transition hover:text-white">
          Base
        </a>
      </div>
    </footer>
  );
}
