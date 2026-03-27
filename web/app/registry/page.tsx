import Link from "next/link";
import { ExternalLink } from "lucide-react";

const LEVEL_LABELS = ["", "Basic", "Interactive", "Complete"];
const LEVEL_COLORS = ["", "text-zinc-400 bg-zinc-800", "text-blue-300 bg-blue-950/60", "text-violet-300 bg-violet-950/60"];

const ENTITIES = [
  {
    name: "Freddy's",
    type: "product",
    description: "AI-powered CV builder that creates professional, ATS-optimized resumes in minutes.",
    domain: "freddys.io",
    level: 3,
  },
  {
    name: "Claude Code Singapore",
    type: "community",
    description: "Singapore's developer community for AI-assisted coding, Claude Code workshops, and building with LLM tools.",
    domain: "claudecode.sg",
    level: 3,
  },
];

const TYPE_COLORS: Record<string, string> = {
  product: "text-emerald-300 bg-emerald-950/60",
  community: "text-blue-300 bg-blue-950/60",
  organization: "text-zinc-300 bg-zinc-800",
  person: "text-amber-300 bg-amber-950/60",
  api: "text-violet-300 bg-violet-950/60",
  dataset: "text-pink-300 bg-pink-950/60",
  marketplace: "text-orange-300 bg-orange-950/60",
  infrastructure: "text-cyan-300 bg-cyan-950/60",
};

export default function Registry() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs font-mono text-violet-400 mb-3">FRED Protocol</div>
          <h1 className="text-4xl font-bold text-zinc-50 mb-2">Registry</h1>
          <p className="text-zinc-400">Entities that have published fred.json. Publicly discoverable.</p>
        </div>
        <Link
          href="/claim"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Add your entity →
        </Link>
      </div>

      {/* Entity count */}
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-2xl font-bold text-violet-400">{ENTITIES.length}</span>
        <span className="text-zinc-400">entities registered</span>
        <span className="text-zinc-700">·</span>
        <span className="text-xs text-zinc-500">More added daily as the protocol grows</span>
      </div>

      {/* Entity grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {ENTITIES.map((entity) => (
          <div key={entity.domain} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-semibold text-zinc-100 mb-1">{entity.name}</div>
                <div className="font-mono text-xs text-zinc-500">{entity.domain}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[entity.type] ?? "text-zinc-300 bg-zinc-800"}`}>
                  {entity.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${LEVEL_COLORS[entity.level]}`}>
                  L{entity.level} {LEVEL_LABELS[entity.level]}
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{entity.description}</p>
            <Link
              href={`https://${entity.domain}/.well-known/fred.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-400 hover:text-violet-300 transition-colors"
            >
              View fred.json <ExternalLink size={11} />
            </Link>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-7 text-center">
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">Add your entity to the registry</h2>
        <p className="text-sm text-zinc-400 mb-5">
          Publish a fred.json and submit it here. Free, takes 2 minutes.
        </p>
        <Link
          href="/claim"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Claim your FRED →
        </Link>
      </div>

    </div>
  );
}
