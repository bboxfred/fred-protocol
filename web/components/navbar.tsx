import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <span className="fred-logo text-xl">FRED</span>
          <span className="text-zinc-600 text-[11px] tracking-widest uppercase hidden sm:inline">Protocol</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/litepaper" className="hover:text-zinc-100 transition-colors hidden sm:inline">Whitepaper</Link>
          <Link href="/claim" className="hover:text-zinc-100 transition-colors hidden sm:inline">Auto-Install</Link>
          <Link
            href="https://github.com/bboxfred/fred-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            aria-label="GitHub"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
