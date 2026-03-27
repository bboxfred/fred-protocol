# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FRED Protocol (**F**inding & **R**eaching **E**ntities for **D**igital Agents) — an open protocol that unifies 12+ agent discovery protocols (MCP, A2A, OpenAPI, llms.txt, Schema.org, robots.txt, etc.) into a single `fred.json` file served at `/.well-known/fred.json`. The repository contains the spec, a validator, a website, a Claude Code plugin, and reference implementations.

## Repository Structure

```
FREDProtocol/
├── fred-spec.md          # Protocol specification (8 layers, conformance levels)
├── fred-schema.json      # JSON Schema Draft 2020-12 for validation
├── validate.js           # Zero-dependency Node.js CLI validator
├── web/                  # hungryhuman.co/fredprotocol — Next.js 16 website
├── claude-skill/         # Claude Code plugin with PostToolUse auto-detection hook
├── examples/             # Reference fred.json files (freddys.io, claudecode.sg)
├── IMPLEMENTING.md       # Platform-specific setup guides
└── GOVERNANCE.md         # Spec evolution process
```

## Commands

### Website (web/)

```bash
cd web && npm run dev       # Dev server on port 3000
cd web && npm run build     # Production build (catches type errors)
cd web && npm run lint      # ESLint
```

Or from root via the launch config:
```bash
npm run dev --prefix web
```

### Validator

```bash
node validate.js path/to/fred.json          # Validate a file
node validate.js path/to/fred.json --json   # JSON output for CI
cat fred.json | node validate.js --stdin    # Pipe from stdin
node validate.js path/to/fred.json --live   # Check URL accessibility
```

Exit codes: 0=valid, 1=invalid, 2=file error.

## Architecture

### The Spec (fred-spec.md + fred-schema.json)

Defines 8 layers — only Identity is required:

1. **Identity** (required) — name, type, url, description
2. **Capability** — what actions the entity can perform
3. **Interaction** — protocols (MCP, REST, OpenAPI, A2A, etc.) and auth
4. **Trust** — verification, compliance, uptime
5. **Pricing** — models, tiers, currencies
6. **Context** — FAQs, llms.txt, knowledge base
7. **Discovery** — related entities, alternatives
8. **Policy** — rate limits, data rights, agent rules

Three conformance levels: L1 (identity only), L2 (+ capabilities + interaction), L3 (+ trust + policy).

Valid entity types: `organization`, `person`, `product`, `api`, `dataset`, `community`, `marketplace`, `infrastructure`.

### Website (web/)

- **Next.js 16.2.1** with App Router, React 19, TypeScript 5
- **Tailwind CSS 4** via `@tailwindcss/postcss`
- **shadcn/ui** components in `components/ui/` (configured via `components.json`)
- **Dark mode only** — `className="dark"` on `<html>`, zinc-950 background, violet accent
- **Geist** font family (Sans + Mono) via `next/font`
- Path alias: `@/*` maps to project root

Key pages:
- `/` — single-page design (protocols → solution → how it works → get started)
- `/litepaper` — whitepaper with protocol map table
- `/claim` — form to generate hosted fred.json (client component, POSTs to `/api/claim`)
- `/validate` — client-side JSON validator

API routes (under `app/api/`): `claim/route.ts`, `validate/route.ts`, `f/[domain]/route.ts` (serves hosted fred.json files).

### Claude Code Plugin (claude-skill/)

- `plugin.json` — manifest with PostToolUse hook on Bash commands
- `hooks/post-deploy-check.mjs` — fires after deployment commands (`vercel deploy`, `git push`, `netlify deploy`, `npm publish`), checks for fred.json absence, injects suggestion
- `skills/fred-protocol/SKILL.md` — skill instructions for generating fred.json
- `references/` — platform guide and schema reference for the skill

### Validator (validate.js)

Zero-dependency, 761-line Node.js script. Validates required fields, enum values, URL formats, duplicate capability IDs, and determines conformance level. Used both as CLI tool and copied into the Claude skill at `claude-skill/skills/fred-protocol/scripts/validate.js`.

## Key Conventions

- The website uses **no `'use client'` except on interactive pages** (claim, validate). All other pages are Server Components.
- JSX strings with special characters use HTML entities (`&apos;`, `&quot;`) or template alternatives.
- The fred.json code preview on the homepage uses inline `<span>` elements for syntax highlighting (violet for keys, emerald for values).
- Protocol data (names, colors, creators) is defined as const arrays at the top of page components — not in separate data files.
- The validator is intentionally zero-dependency to work anywhere Node.js runs.
