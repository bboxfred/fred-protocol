import Link from "next/link";

const PROTOCOLS = [
  {
    name: "MCP",
    fullName: "Model Context Protocol",
    creator: "Anthropic",
    what: "Tool calling and context for AI agents",
    how: 'interaction.protocols[].type: "mcp"',
    url: "https://modelcontextprotocol.io",
  },
  {
    name: "A2A",
    fullName: "Agent-to-Agent",
    creator: "Google",
    what: "Standardized agent-to-agent communication",
    how: 'interaction.protocols[].type: "a2a"',
    url: "https://google.github.io/A2A",
  },
  {
    name: "OpenAPI",
    fullName: "OpenAPI Specification",
    creator: "OpenAPI Initiative",
    what: "Machine-readable REST API contracts",
    how: 'interaction.protocols[].type: "openapi"',
    url: "https://spec.openapis.org",
  },
  {
    name: "llms.txt",
    fullName: "llms.txt",
    creator: "Answer.AI",
    what: "Structured context files for LLMs",
    how: "context.llms_txt → URL to your llms.txt",
    url: "https://llmstxt.org",
  },
  {
    name: "ADP",
    fullName: "Agent Deployment Protocol",
    creator: "Open",
    what: "Agent deployment and lifecycle management",
    how: "capabilities[] describes what deployed agents do",
    url: "#",
  },
  {
    name: "Schema.org",
    fullName: "Schema.org Structured Data",
    creator: "Google / W3C",
    what: "Semantic markup for search engines",
    how: "Complementary — FRED is agent-first, Schema.org is crawler-first",
    url: "https://schema.org",
  },
  {
    name: "robots.txt",
    fullName: "Robots Exclusion Protocol",
    creator: "W3C",
    what: "Crawler access rules",
    how: "policy.agent_policy extends this for AI agents",
    url: "https://www.robotstxt.org",
  },
  {
    name: "security.txt",
    fullName: "security.txt",
    creator: "IETF",
    what: "Security disclosure contacts",
    how: "trust.security.security_txt → URL to your security.txt",
    url: "https://securitytxt.org",
  },
  {
    name: "WebFinger",
    fullName: "WebFinger",
    creator: "IETF RFC 7033",
    what: "Resource and person discovery",
    how: "Complementary identity discovery standard",
    url: "https://webfinger.net",
  },
  {
    name: "JSON-LD",
    fullName: "JSON Linked Data",
    creator: "W3C",
    what: "Linked data in JSON format",
    how: "Complementary — FRED uses plain JSON, not RDF",
    url: "https://json-ld.org",
  },
  {
    name: "Sitemap.xml",
    fullName: "XML Sitemaps",
    creator: "sitemaps.org",
    what: "Content index for crawlers",
    how: "Complementary — context.knowledge_base can point to sitemaps",
    url: "https://sitemaps.org",
  },
  {
    name: "DNS TXT",
    fullName: "DNS TXT Records",
    creator: "IETF",
    what: "Domain metadata via DNS",
    how: "_fred.domain TXT records for discovery without HTTP",
    url: "https://www.rfc-editor.org/rfc/rfc1464",
  },
];

export default function Protocols() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

      <div className="mb-12 max-w-2xl">
        <div className="text-xs font-mono text-violet-400 mb-4">FRED Protocol · Ecosystem</div>
        <h1 className="text-4xl font-bold text-zinc-50 mb-4">What FRED connects</h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          FRED is the binding layer. Every protocol below is referenced in{" "}
          <code className="text-violet-400 font-mono">fred.json</code> — not replaced.
          One file tells agents where to find all of them.
        </p>
      </div>

      {/* Visual diagram */}
      <section className="mb-14">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            {/* FRED node */}
            <div className="bg-violet-950 border-2 border-violet-600 rounded-xl px-8 py-4 text-center">
              <div className="font-mono font-bold text-violet-300 text-lg">fred.json</div>
              <div className="text-xs text-violet-500 mt-0.5">The universal entry point</div>
            </div>

            {/* Connector line */}
            <div className="w-px h-6 bg-zinc-700" />

            {/* Protocol pills */}
            <div className="w-full max-w-3xl">
              <div className="flex flex-wrap justify-center gap-2">
                {PROTOCOLS.map((p) => (
                  <div
                    key={p.name}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-center min-w-[90px]"
                  >
                    <div className="font-mono text-sm font-medium text-zinc-300">{p.name}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{p.creator}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol table */}
      <section className="mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-3 pr-4 font-medium">Protocol</th>
                <th className="pb-3 pr-4 font-medium">Creator</th>
                <th className="pb-3 pr-4 font-medium">What it does</th>
                <th className="pb-3 font-medium">How FRED references it</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOLS.map(({ name, creator, what, how, url }, i) => (
                <tr
                  key={name}
                  className={`${i < PROTOCOLS.length - 1 ? "border-b border-zinc-800/50" : ""} hover:bg-zinc-900/30 transition-colors`}
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-violet-400 hover:text-violet-300 transition-colors font-medium"
                    >
                      {name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-zinc-400">{creator}</td>
                  <td className="py-3 pr-4 text-zinc-300">{what}</td>
                  <td className="py-3 font-mono text-xs text-zinc-500">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-medium text-zinc-200 mb-1">Is your protocol missing?</div>
          <div className="text-sm text-zinc-400">Open a PR and we'll add it.</div>
        </div>
        <Link
          href="https://github.com/bboxfred/fred-protocol/issues/new"
          target="_blank"
          className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Open an issue →
        </Link>
      </div>

    </div>
  );
}
