import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.03] py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
        <span>Created by <Link href="https://freddys.io" target="_blank" className="text-zinc-500 hover:text-zinc-300 transition-colors">Freddy Lim</Link></span>
        <div className="flex items-center gap-5">
          <Link href="/litepaper" className="hover:text-zinc-400 transition-colors">Whitepaper</Link>
          <Link href="https://github.com/bboxfred/fred-protocol" target="_blank" className="hover:text-zinc-400 transition-colors">GitHub</Link>
          <Link href="https://github.com/bboxfred/fred-protocol/blob/main/GOVERNANCE.md" target="_blank" className="hover:text-zinc-400 transition-colors">Governance</Link>
        </div>
      </div>
    </footer>
  );
}
