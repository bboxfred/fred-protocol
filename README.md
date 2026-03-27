# FRED Protocol

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-violet.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bboxfred/fred-protocol?style=social)](https://github.com/bboxfred/fred-protocol)
[![spec](https://img.shields.io/badge/spec-v0.1-blue.svg)](fred-spec.md)
[![validator](https://img.shields.io/badge/validator-zero_dep-green.svg)](validate.js)

**Finding & Reaching Entities for Digital Agents**

The open protocol that unifies 12+ agent discovery protocols (MCP, A2A, OpenAPI, llms.txt, Schema.org, and more) into a single JSON file. Add it to your domain — every AI agent can instantly discover and interact with you.

[Website](https://hungryhuman.co/fredprotocol) · [Whitepaper](https://hungryhuman.co/fredprotocol/litepaper) · [Auto-Install](https://hungryhuman.co/fredprotocol/claim) · [Validator](https://hungryhuman.co/fredprotocol/validate)

---

## The Problem

AI agents are becoming the primary interface between humans and the internet. But today, when an agent needs to interact with a business, API, or service, it faces:

- **No standard discovery.** How does an agent find out what a website can do?
- **Fragmented protocols.** MCP, A2A, ADP, llms.txt — each solves a piece, none solves the whole.
- **No trust signals.** How does an agent know if an entity is legitimate?
- **Opaque pricing.** How does an agent compare services or execute transactions?
- **No rules of engagement.** What is an agent allowed to do? What data can it store?

## The Solution

**One file. Full story.**

Add a `fred.json` to your domain, and any AI agent can instantly understand:

| Layer | Question | Example |
|-------|----------|---------|
| **Identity** | Who are you? | Name, type, contacts, jurisdiction |
| **Capability** | What can you do? | Create CVs, search events, process payments |
| **Interaction** | How do I talk to you? | REST API, MCP server, GraphQL endpoint |
| **Trust** | Why should I trust you? | Business verification, uptime, compliance |
| **Pricing** | What does it cost? | Free tier, $12/mo Pro, enterprise |
| **Context** | What should I know? | FAQs, limitations, SLA, use cases |
| **Discovery** | Who else is related? | Partners, integrations, alternatives |
| **Policy** | What are the rules? | Rate limits, data handling, attribution |

FRED doesn't replace MCP, A2A, or llms.txt — it **binds them together** into one implementation surface.

## Quick Start

### 1. Create your fred.json

```json
{
  "fred": "0.1",
  "identity": {
    "name": "Your Company",
    "type": "organization",
    "description": "What you do in one sentence",
    "url": "https://yourcompany.com"
  }
}
```

That's a valid FRED file. Only `fred` and `identity` are required. Everything else is optional and progressive.

### 2. Serve it

Place the file at:
```
https://yourcompany.com/.well-known/fred.json
```

Or at the root:
```
https://yourcompany.com/fred.json
```

### 3. Validate it

```bash
node validate.js your-fred.json
```

```
FRED Protocol Validator v0.1
──────────────────────────────────────────────────
  Entity:  Your Company (organization)
  Version: 0.1
  Layers:  identity

  VALID — fred.json passes validation
  Conformance: Level 1 — Basic
──────────────────────────────────────────────────
```

### 4. Level up

Add more layers as you need them:

```json
{
  "fred": "0.1",
  "identity": { ... },
  "capabilities": [
    {
      "id": "search-products",
      "name": "Search Products",
      "description": "Full-text search across product catalog",
      "category": "search",
      "inputs": [
        { "name": "query", "type": "string", "required": true, "description": "Search query" }
      ],
      "outputs": [
        { "name": "results", "type": "array", "description": "Matching products" }
      ]
    }
  ],
  "interaction": {
    "protocols": [
      { "type": "rest", "url": "https://api.yourcompany.com/v1" },
      { "type": "mcp", "url": "https://mcp.yourcompany.com" }
    ]
  }
}
```

## Conformance Levels

| Level | Name | Requirements |
|-------|------|-------------|
| **1** | Basic | Valid fred.json with identity layer |
| **2** | Interactive | Level 1 + capabilities + at least one interaction protocol |
| **3** | Complete | Level 2 + trust verification + agent policy |

## Reference Implementations

Two complete, Level 3 examples are included:

### [freddys.io/fred.json](examples/freddys.io/fred.json)
A SaaS CV builder — demonstrates product capabilities, OAuth2 + MCP interaction, pricing tiers, trust signals, and comprehensive agent policy.

### [claudecode.sg/fred.json](examples/claudecode.sg/fred.json)
A developer community — demonstrates community entity type, event discovery, member search, resource curation, and community-driven trust.

## How Agents Use FRED

```
Agent receives user request: "Find me a CV builder in Singapore"
  |
  v
Agent discovers fred.json at freddys.io/.well-known/fred.json
  |
  v
Agent reads identity → "AI-powered CV builder, Singapore, 15K users"
  |
  v
Agent reads capabilities → "create-cv, optimize-cv, generate-cover-letter"
  |
  v
Agent reads interaction → REST API + MCP server available
  |
  v
Agent reads trust → Verified business, 4.7/5 rating, 99.95% uptime
  |
  v
Agent reads pricing → Free tier available, Pro at $12/mo
  |
  v
Agent reads policy → Can create CVs, must attribute, session-only data
  |
  v
Agent connects via MCP and creates a CV for the user
```

## Relationship to Other Protocols

FRED is the **binding layer**. It doesn't compete — it connects.

```
┌─────────────────────────────────────────────┐
│                 fred.json                    │
│  The single entry point for AI agents       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │   MCP   │ │   A2A   │ │   OpenAPI    │  │
│  │ Server  │ │Endpoint │ │    Spec      │  │
│  └─────────┘ └─────────┘ └──────────────┘  │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │llms.txt │ │  REST   │ │  WebSocket   │  │
│  │         │ │  API    │ │  Endpoint    │  │
│  └─────────┘ └─────────┘ └──────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## Specification

The complete protocol specification is in [fred-spec.md](fred-spec.md). It covers:

- All 8 layers in detail with schemas and examples
- File location and discovery rules
- Security considerations
- Versioning
- Conformance levels
- IANA considerations

## JSON Schema

The machine-readable schema is at [fred-schema.json](fred-schema.json). Use it with any JSON Schema validator:

```javascript
const Ajv = require("ajv/dist/2020");
const schema = require("./fred-schema.json");

const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(yourFredJson);
```

## Validator

A zero-dependency reference validator is included:

```bash
# Validate a file
node validate.js path/to/fred.json

# JSON output (for CI/CD)
node validate.js path/to/fred.json --json

# Read from stdin
cat fred.json | node validate.js --stdin
```

## Project Structure

```
FREDProtocol/
├── fred-spec.md              # Full protocol specification
├── fred-schema.json          # JSON Schema (Draft 2020-12)
├── validate.js               # Zero-dependency reference validator
├── web/                      # hungryhuman.co/fredprotocol — Next.js website
│   ├── app/                  # Pages: home, whitepaper, auto-install, validator
│   └── components/           # Shared UI components
├── claude-skill/             # Claude Code plugin (auto-detects deploys)
│   ├── plugin.json           # Plugin manifest with PostToolUse hook
│   ├── hooks/                # Auto-detection hook
│   └── skills/               # FRED generation skill
├── examples/
│   ├── freddys.io/fred.json  # SaaS product example (Level 3)
│   └── claudecode.sg/fred.json  # Developer community example (Level 3)
├── IMPLEMENTING.md           # Platform-specific setup guides
├── GOVERNANCE.md             # How the spec evolves
└── LICENSE                   # Apache 2.0
```

## Contributing

The FRED Protocol is open source and community-driven. See [GOVERNANCE.md](GOVERNANCE.md) for how the spec evolves and how to contribute.

**Ways to contribute:**
- Implement fred.json for your domain and share it
- Build tools (validators, generators, crawlers)
- Propose spec changes via GitHub Issues
- Write integrations for AI agent frameworks
- Translate the spec

## FAQ

**Is this an Anthropic project?**
No. FRED is an independent open-source protocol created by Freddy Lim.

**Why not just use Schema.org?**
Schema.org is optimized for search engine crawlers. FRED is agent-first — designed for AI agents that need to take action, not just index content.

**Do I need to implement all 8 layers?**
No. Only `identity` is required. Start there and add layers as you need them.

**What about authentication?**
FRED doesn't handle auth directly. It points agents to your auth endpoints via `interaction.protocols[].auth`. Use whatever auth system you already have.

**How does trust work?**
Trust in FRED is not a single score. It's a collection of independently verifiable claims — business registrations, uptime records, compliance certifications, user ratings. Agents can weigh these signals according to their own trust models.

**Will you register this with IANA?**
The `.well-known/fred.json` URI and `application/fred+json` media type will be submitted for registration as the spec matures beyond draft status.

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

**Created by [Freddy Lim](https://github.com/bboxfred)**

FRED Protocol is not a product. It's infrastructure for the agentic web.
