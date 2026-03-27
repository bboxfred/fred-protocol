import Link from "next/link";
import { Download } from "lucide-react";

const LAYERS = [
  { layer: "Identity", question: "Who are you?", example: "Name, type, URL, contacts" },
  { layer: "Capability", question: "What can you do?", example: "Create CVs, search products, send emails" },
  { layer: "Interaction", question: "How do I talk to you?", example: "REST API, MCP server, GraphQL" },
  { layer: "Trust", question: "Why should I trust you?", example: "Verified business, 4.7★, 99.95% uptime" },
  { layer: "Pricing", question: "What does it cost?", example: "Free / $12/mo Pro / Enterprise" },
  { layer: "Context", question: "What should I know?", example: "FAQs, limitations, SLA" },
  { layer: "Discovery", question: "Who is related?", example: "Partners, integrations, alternatives" },
  { layer: "Policy", question: "What are the rules?", example: "Rate limits, data rights, attribution" },
];

const PROTOCOL_MAP = [
  { name: "MCP", creator: "Anthropic", what: "Tool calling for AI agents", how: 'interaction.protocols[].type: "mcp"' },
  { name: "A2A", creator: "Google", what: "Agent-to-agent communication", how: 'interaction.protocols[].type: "a2a"' },
  { name: "OpenAPI", creator: "OpenAPI Initiative", what: "Machine-readable REST API contracts", how: 'interaction.protocols[].type: "openapi"' },
  { name: "llms.txt", creator: "Answer.AI", what: "Structured context files for LLMs", how: "context.llms_txt → URL to your llms.txt" },
  { name: "ADP", creator: "Open Standard", what: "Agent deployment and lifecycle", how: "capabilities[] describes deployed agents" },
  { name: "Schema.org", creator: "Google / W3C", what: "Semantic markup for search engines", how: "Complementary — FRED is agent-first, Schema.org is crawler-first" },
  { name: "robots.txt", creator: "W3C", what: "Crawler access rules", how: "policy.agent_policy extends this for AI agents" },
  { name: "security.txt", creator: "IETF", what: "Security disclosure contacts", how: "trust.security.security_txt → URL" },
  { name: "WebFinger", creator: "IETF RFC 7033", what: "Resource and person discovery", how: "Complementary identity discovery standard" },
  { name: "JSON-LD", creator: "W3C", what: "Linked data in JSON format", how: "Complementary — FRED uses plain JSON, not RDF" },
  { name: "Sitemap.xml", creator: "sitemaps.org", what: "Content index for crawlers", how: "context.knowledge_base can point to sitemaps" },
  { name: "DNS TXT", creator: "IETF", what: "Domain metadata via DNS", how: "_fred.domain TXT records for discovery without HTTP" },
];

export default function Litepaper() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

      <div className="mb-12">
        <div className="text-xs font-mono text-violet-400 mb-4">FRED Protocol · Whitepaper</div>
        <h1 className="text-4xl font-bold text-zinc-50 mb-4">What is FRED?</h1>
        <p className="text-lg text-zinc-400">What it is, why it exists, and how it works. No jargon.</p>
      </div>

      {/* The Problem */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">The Problem</h2>
        <p className="text-zinc-300 leading-relaxed mb-3">
          AI agents are becoming the main interface between people and the internet.
          They browse, purchase, schedule, and research on your behalf.
        </p>
        <p className="text-zinc-300 leading-relaxed mb-3">
          But when an agent visits a website today, it faces a wall.
          There are 12+ different discovery protocols it needs to check — MCP, A2A, OpenAPI, llms.txt, Schema.org, robots.txt, and more.
          Each with their own file format, location, and setup process.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          Site owners have to implement each one separately. Agents have to check each one separately.
          The agentic web is arriving — but it has no unified map.
        </p>
      </section>

      {/* The Solution */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">The Solution</h2>
        <p className="text-zinc-300 leading-relaxed mb-3">
          One JSON file. One well-known URL. Full story.
        </p>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-400 mb-4">
          https://yourdomain.com/.well-known/fred.json
        </div>
        <p className="text-zinc-300 leading-relaxed">
          Any entity — a business, a person, an API, a community, a product — adds a{" "}
          <code className="text-violet-400 font-mono text-sm">fred.json</code> file to their domain.
          FRED binds all existing protocols into a single entry point.
          AI agents read one file and know everything.
        </p>
      </section>

      {/* The 8 Layers */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">The 8 Layers</h2>
        <p className="text-zinc-400 text-sm mb-5">Only the first layer (Identity) is required. Everything else is optional and progressive.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-2 pr-4 font-medium">Layer</th>
                <th className="pb-2 pr-4 font-medium">Question it answers</th>
                <th className="pb-2 font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              {LAYERS.map(({ layer, question, example }, i) => (
                <tr key={layer} className={i < LAYERS.length - 1 ? "border-b border-zinc-800/50" : ""}>
                  <td className="py-2.5 pr-4 font-mono text-violet-400 text-xs whitespace-nowrap">{layer}</td>
                  <td className="py-2.5 pr-4 text-zinc-300">{question}</td>
                  <td className="py-2.5 text-zinc-500 text-xs">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Protocol Map */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">Protocol Map</h2>
        <p className="text-zinc-400 text-sm mb-5">
          FRED doesn&apos;t replace any of these protocols. It references them — telling agents where to find each one.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-2 pr-4 font-medium">Protocol</th>
                <th className="pb-2 pr-4 font-medium">What it does</th>
                <th className="pb-2 font-medium">How FRED references it</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOL_MAP.map(({ name, what, how }, i) => (
                <tr key={name} className={i < PROTOCOL_MAP.length - 1 ? "border-b border-zinc-800/50" : ""}>
                  <td className="py-2.5 pr-4 font-mono text-violet-400 text-xs whitespace-nowrap font-medium">{name}</td>
                  <td className="py-2.5 pr-4 text-zinc-300">{what}</td>
                  <td className="py-2.5 font-mono text-xs text-zinc-500">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-3">Why It Matters</h2>
        <p className="text-zinc-300 leading-relaxed mb-3">
          The web standardized on HTML. Email standardized on SMTP. The agentic web needs a standard too.
        </p>
        <p className="text-zinc-300 leading-relaxed mb-3">
          FRED is not a product. It&apos;s infrastructure. Open source, Apache 2.0, community-governed.
          Anyone can implement it. No account, no API key, no dependency on any company.
        </p>
        <p className="text-zinc-300 leading-relaxed">
          Every entity that adds <code className="text-violet-400 font-mono text-sm">fred.json</code> makes
          the agentic web a little more navigable for every agent and every user.
        </p>
      </section>

      {/* How to join */}
      <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-50 mb-4">How To Use FRED</h2>
        <div className="space-y-3">
          {[
            { path: "/claim", label: "No code", desc: "Fill a form. We host your fred.json." },
            { path: "/#get-started", label: "Developer", desc: "Download spec, add to project, validate." },
            { path: "/#get-started", label: "Claude Code", desc: "Install skill. Auto-adds FRED to every project." },
          ].map(({ path, label, desc }) => (
            <Link
              key={path + label}
              href={path}
              className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors group"
            >
              <div>
                <span className="text-sm font-medium text-zinc-200">{label}</span>
                <span className="text-sm text-zinc-500 ml-3">{desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Download */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="https://github.com/bboxfred/fred-protocol/blob/main/fred-spec.md"
          target="_blank"
          className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={14} />
          Full specification (GitHub)
        </Link>
        <Link
          href="/validate"
          className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-5 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Validate your fred.json
        </Link>
      </div>

    </div>
  );
}
