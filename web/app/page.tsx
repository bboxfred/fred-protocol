import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown, Terminal, Sparkles, Bot, Search, Cpu, Shield, FileJson } from "lucide-react";
import { ValidatorInline } from "@/components/validator-inline";

/* ─── Protocol data ─── */
const PROTOCOLS = [
  { name: "MCP", creator: "Anthropic", color: "#D97757", logo: "/logos/anthropic.svg" },
  { name: "A2A", creator: "Google", color: "#4285F4", logo: "/logos/google.svg" },
  { name: "OpenAPI", creator: "OpenAPI Initiative", color: "#6BA539", logo: "/logos/openapiinitiative.svg" },
  { name: "llms.txt", creator: "Answer.AI", color: "#F59E0B", logo: null },
  { name: "Schema.org", creator: "Google · W3C", color: "#1E88E5", logo: "/logos/schemaorg.svg" },
  { name: "robots.txt", creator: "W3C", color: "#9CA3AF", logo: "/logos/w3c.svg" },
  { name: "security.txt", creator: "IETF", color: "#EF4444", logo: "/logos/ietf.svg" },
  { name: "WebFinger", creator: "IETF", color: "#8B5CF6", logo: "/logos/ietf.svg" },
  { name: "JSON-LD", creator: "W3C", color: "#06B6D4", logo: "/logos/json.svg" },
  { name: "Sitemap.xml", creator: "sitemaps.org", color: "#10B981", logo: null },
  { name: "DNS TXT", creator: "IETF", color: "#6366F1", logo: "/logos/ietf.svg" },
  { name: "ADP", creator: "Open Standard", color: "#EC4899", logo: null },
];

const LAYERS = [
  { name: "Identity", q: "Who are you?", color: "#a78bfa", icon: "👤" },
  { name: "Capability", q: "What can you do?", color: "#818cf8", icon: "⚡" },
  { name: "Interaction", q: "How do I reach you?", color: "#6366f1", icon: "🔌" },
  { name: "Trust", q: "Can I trust you?", color: "#34d399", icon: "🛡️" },
  { name: "Pricing", q: "What does it cost?", color: "#fbbf24", icon: "💰" },
  { name: "Context", q: "What should I know?", color: "#f97316", icon: "📋" },
  { name: "Discovery", q: "Who is related?", color: "#06b6d4", icon: "🔗" },
  { name: "Policy", q: "What are the rules?", color: "#f43f5e", icon: "📜" },
];

export default function Home() {
  return (
    <div>

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-12 relative">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-[11px] text-zinc-500 mb-8 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
              Open Source · Free Forever · Apache 2.0
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-50 leading-[1.08] mb-5">
              Make your site discoverable<br />
              <span className="text-gradient">by every AI agent.</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12">
              FRED Protocol unifies 12+ agent discovery protocols into one JSON file.
              Add it to your domain — AI agents instantly find you.
            </p>
          </div>

          {/* 3 install methods — large */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 max-w-3xl mx-auto animate-fade-in-up delay-2">
            <Link
              href="/claim"
              className="flex-1 flex items-center gap-4 px-6 py-5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white transition-all hover:shadow-xl hover:shadow-violet-600/20 group"
            >
              <Sparkles size={22} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-base font-semibold">fred.json Auto-Install</div>
                <div className="text-xs text-violet-200/70">Fill a form. We generate &amp; host it. Free.</div>
              </div>
              <ArrowRight size={16} className="ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="https://github.com/bboxfred/fred-protocol"
              target="_blank"
              className="flex-1 flex items-center gap-4 px-6 py-5 rounded-2xl border border-white/[0.06] hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <Terminal size={22} className="text-zinc-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-base font-medium text-zinc-200">DIY — read the spec</div>
                <div className="text-xs text-zinc-500">Create fred.json yourself.</div>
              </div>
            </Link>

            <Link
              href="https://github.com/bboxfred/fred-protocol/tree/main/claude-skill"
              target="_blank"
              className="flex-1 flex items-center gap-4 px-6 py-5 rounded-2xl border border-white/[0.06] hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <Bot size={22} className="text-zinc-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-base font-medium text-zinc-200">Claude Code Plugin</div>
                <div className="text-xs text-zinc-500">Auto-detects your deploys.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROTOCOL CAROUSEL
          ═══════════════════════════════════════════ */}
      <section className="py-10 overflow-hidden">
        <p className="text-center text-[10px] text-zinc-600 mb-5 tracking-[0.2em] uppercase">
          Protocols FRED unifies
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
          <div className="carousel-track">
            {[...PROTOCOLS, ...PROTOCOLS].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center gap-2.5 px-5 py-2.5 mx-2 rounded-xl border border-white/[0.04] bg-white/[0.02] shrink-0 hover:bg-white/[0.04] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: p.color + "12", border: `1px solid ${p.color}20` }}
                >
                  {p.logo ? (
                    <Image src={p.logo} alt={p.name} width={14} height={14} className="invert opacity-80" />
                  ) : (
                    <span className="text-[9px] font-bold" style={{ color: p.color }}>{p.name.slice(0, 3)}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-300 whitespace-nowrap">{p.name}</div>
                  <div className="text-[9px] text-zinc-600 whitespace-nowrap">{p.creator}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ONE FILE — code preview (blue section)
          ═══════════════════════════════════════════ */}
      <section className="bg-section-blue">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
                One file to rule them all.
              </h2>
              <p className="text-zinc-500 text-sm max-w-lg mx-auto">
                Instead of setting up 12 protocols separately, add one <code className="text-violet-400 font-mono text-xs bg-violet-950/40 px-1.5 py-0.5 rounded">fred.json</code> file.
              </p>
            </div>

            {/* Convergence: pills → arrow → code */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {PROTOCOLS.map((p) => (
                <span key={p.name} className="text-[10px] font-mono px-2 py-0.5 rounded-full border hover:bg-white/[0.03] transition-colors" style={{ borderColor: p.color + "25", color: p.color }}>
                  {p.name}
                </span>
              ))}
            </div>
            <div className="flex justify-center mb-4">
              <ArrowDown className="text-violet-500/50 animate-float" size={20} />
            </div>

            <div className="bg-[#0d0f1a] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse-glow">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-[11px] font-mono text-zinc-600">yoursite.com/.well-known/fred.json</span>
              </div>
              <pre className="p-5 text-sm font-mono overflow-x-auto leading-relaxed text-zinc-400">
{`{
  `}<span className="text-violet-400">&quot;fred&quot;</span>{`: `}<span className="text-emerald-400">&quot;0.1&quot;</span>{`,
  `}<span className="text-violet-400">&quot;identity&quot;</span>{`: {
    `}<span className="text-violet-400">&quot;name&quot;</span>{`: `}<span className="text-emerald-400">&quot;Your Project&quot;</span>{`,
    `}<span className="text-violet-400">&quot;type&quot;</span>{`: `}<span className="text-emerald-400">&quot;product&quot;</span>{`,
    `}<span className="text-violet-400">&quot;description&quot;</span>{`: `}<span className="text-emerald-400">&quot;What you do&quot;</span>{`,
    `}<span className="text-violet-400">&quot;url&quot;</span>{`: `}<span className="text-emerald-400">&quot;https://yoursite.com&quot;</span>{`
  },
  `}<span className="text-violet-400">&quot;interaction&quot;</span>{`: {
    `}<span className="text-violet-400">&quot;protocols&quot;</span>{`: [
      { `}<span className="text-violet-400">&quot;type&quot;</span>{`: `}<span className="text-emerald-400">&quot;mcp&quot;</span>{`, `}<span className="text-violet-400">&quot;url&quot;</span>{`: `}<span className="text-emerald-400">&quot;...&quot;</span>{` }
    ]
  }
}`}
              </pre>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 sm:gap-16 mt-12">
              {[
                { value: "1", label: "file" },
                { value: "8", label: "layers" },
                { value: "12+", label: "protocols" },
                { value: "30s", label: "setup" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient font-mono">{value}</div>
                  <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-[0.15em]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SPLIT: What's inside + How agents discover (violet section)
          ═══════════════════════════════════════════ */}
      <section className="bg-section-violet">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* LEFT — What's inside */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">
                What&apos;s inside your fred.json
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                Your file answers questions AI agents ask about you. Only Identity is required — the Auto-Install
                fills in the rest from your answers.
              </p>

              <div className="space-y-1.5">
                {LAYERS.map((l, i) => (
                  <div
                    key={l.name}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-default hover-lift ${
                      i === 0
                        ? "bg-violet-500/[0.08] border border-violet-500/20"
                        : "hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04]"
                    }`}
                  >
                    <span className="text-base w-6 text-center">{l.icon}</span>
                    <span className="font-mono text-xs font-semibold w-24 shrink-0" style={{ color: l.color }}>{l.name}</span>
                    <span className="text-sm text-zinc-400 flex-1">{l.q}</span>
                    {i === 0 && (
                      <span className="text-[9px] bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full font-mono border border-violet-500/20">required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — How agents discover */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-3">
                How agents discover you
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                From invisible to fully searchable by AI.
              </p>

              <div className="space-y-0">
                {[
                  { icon: FileJson, color: "text-violet-400", title: "You publish fred.json", desc: "Place at /.well-known/fred.json — or let us host it free.", line: "from-violet-500/30" },
                  { icon: Search, color: "text-blue-400", title: "Agent searches your domain", desc: "ChatGPT, Claude, Gemini — any agent. One HTTP request.", line: "from-blue-500/30" },
                  { icon: Cpu, color: "text-emerald-400", title: "Agent understands you", desc: "Identity, capabilities, APIs, trust — parsed from one file.", line: "from-emerald-500/30" },
                  { icon: Shield, color: "text-amber-400", title: "Agent interacts under your rules", desc: "Calls your API, respects rate limits. You stay in control.", line: null },
                ].map(({ icon: Icon, color, title, desc, line }, i) => (
                  <div key={title}>
                    <div className="flex items-start gap-4 py-3">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <Icon size={18} className={color} />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-sm font-semibold text-zinc-200 mb-0.5">{title}</div>
                        <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
                      </div>
                    </div>
                    {line && (
                      <div className={`ml-5 w-px h-5 bg-gradient-to-b ${line} to-transparent`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/litepaper" className="text-xs text-violet-400/60 hover:text-violet-400 transition-colors">
              Full specification in the whitepaper →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALIDATOR (warm section)
          ═══════════════════════════════════════════ */}
      <section className="bg-section-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
              Validate your fred.json
            </h2>
            <p className="text-zinc-500 text-sm">Paste your fred.json below. Get instant pass/fail feedback.</p>
          </div>
          <ValidatorInline />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <section className="border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-600 uppercase tracking-[0.15em] flex-wrap">
            <span>Open Source</span>
            <span className="text-white/5">·</span>
            <span>Apache 2.0</span>
            <span className="text-white/5">·</span>
            <span>Free Forever</span>
            <span className="text-white/5">·</span>
            <span>Community Governed</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            {[
              { href: "https://github.com/bboxfred/fred-protocol", label: "GitHub", ext: true },
              { href: "/litepaper", label: "Whitepaper", ext: false },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                {...(l.ext ? { target: "_blank" } : {})}
                className="text-xs text-zinc-600 hover:text-zinc-300 border border-white/[0.04] hover:border-white/10 px-4 py-2 rounded-lg transition-all"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
