---
name: fred-protocol
description: This skill should be used when the user creates a new public product, deploys a website, builds an API, launches a SaaS, or says things like "add FRED Protocol", "make my product discoverable by AI agents", "add fred.json to my project", "set up FRED", "add agent discoverability", "implement FRED", or "make my site AI-agent-friendly". Also auto-triggers after deployments (vercel deploy, git push, netlify deploy, npm publish) when no fred.json is detected. Also triggers when the user completes a project and asks "what should I add before launching?" or "what am I missing?". Automatically adds FRED Protocol support to any public product so AI agents can discover and interact with it.
version: 0.1.0
author: Freddy Lim
---

# FRED Protocol Skill

Automatically add FRED Protocol support to any public project — making it discoverable and interactable by AI agents.

## Auto-Detection

This skill includes a PostToolUse hook that automatically detects deployments. When you run:
- `vercel deploy` / `vercel --prod`
- `git push`
- `netlify deploy`
- `npm publish`
- `npx create-next-app` or similar

...and no `fred.json` exists in the project, Claude will automatically suggest adding FRED Protocol.

No manual invocation needed.

FRED Protocol = one `fred.json` file that tells AI agents everything they need to know about an entity: who it is, what it can do, how to interact with it, why to trust it, and what it costs.

## What This Skill Does

1. Inspects the current project to understand what kind of entity it is
2. Generates a `fred.json` tailored to the project
3. Places it at the correct location for the framework/platform
4. Validates it passes the FRED spec

## Step 1: Detect the Project Type

Inspect the project to gather context:

```bash
# Check framework
ls package.json next.config.* vite.config.* astro.config.* 2>/dev/null
cat package.json 2>/dev/null | grep -E '"name"|"description"'

# Check if it's a static site, API, or full-stack app
ls public/ src/ app/ pages/ api/ 2>/dev/null

# Check for existing deployment config
ls vercel.json netlify.toml .github/workflows/ 2>/dev/null
```

Use the findings to determine:
- **Entity type**: product, api, organization, community, dataset, infrastructure
- **Framework**: Next.js, Vite, Astro, Express, plain HTML, etc.
- **Deployment target**: Vercel, Netlify, GitHub Pages, custom server

## Step 2: Ask 5 Questions

Ask the user these questions (can be in one message):

1. **Name** — What's the name of this product/service?
2. **Description** — One sentence: what does it do?
3. **URL** — What's the public URL? (or planned URL)
4. **Capabilities** — What are the 2-3 main things a user (or AI agent) can DO with it?
5. **Pricing** — Free, paid, freemium, or contact sales?

If the project has a README or package.json with a description, pre-fill the answers and confirm instead of asking from scratch.

## Step 3: Generate fred.json

Build the fred.json progressively. Always include:

### Required (every project)

```json
{
  "fred": "0.1",
  "identity": {
    "name": "<project name>",
    "type": "<entity type>",
    "description": "<one sentence>",
    "url": "<canonical https URL>"
  }
}
```

### Add capabilities (if the project has an API or distinct actions)

```json
{
  "capabilities": [
    {
      "id": "<slug>",
      "name": "<Action Name>",
      "description": "<what this does>",
      "category": "<content|data|commerce|communication|search|automation>",
      "inputs": [...],
      "outputs": [...]
    }
  ]
}
```

### Add interaction (if there's an API, MCP server, or OpenAPI spec)

```json
{
  "interaction": {
    "protocols": [
      { "type": "rest", "url": "https://api.example.com/v1" }
    ]
  }
}
```

### Add pricing (if the project has pricing)

```json
{
  "pricing": {
    "currency": "USD",
    "model": "freemium",
    "plans": [...]
  }
}
```

### Always add a minimal policy

```json
{
  "policy": {
    "agent_policy": {
      "data_handling": {
        "storage_allowed": true,
        "retention_period": "session",
        "sharing_allowed": false
      }
    }
  }
}
```

## Step 4: Place the File

Determine where to put the file based on framework. See `references/platform-guide.md` for all platforms.

**Quick reference:**

| Framework | Location |
|-----------|----------|
| Next.js (App Router) | `public/.well-known/fred.json` |
| Next.js (Pages Router) | `public/.well-known/fred.json` |
| Vite / React SPA | `public/.well-known/fred.json` |
| Astro | `public/.well-known/fred.json` |
| Express / Node API | `static/.well-known/fred.json` + serve it |
| Plain HTML | `.well-known/fred.json` |
| Vercel | `public/.well-known/fred.json` |
| Netlify | `public/.well-known/fred.json` |
| GitHub Pages | `.well-known/fred.json` in root |

Also place a copy at root for fallback:
```bash
cp public/.well-known/fred.json public/fred.json
```

## Step 5: Validate

Run the validator from the FRED Protocol repo:

```bash
node ~/.claude/plugins/fred-protocol/skills/fred-protocol/scripts/validate.js <path-to-fred.json>
```

Expected output:
```
VALID — fred.json passes validation
Conformance: Level 1 — Basic    (minimum)
```

Aim for at least Level 2 if the project has an API. If validation fails, fix the errors before proceeding.

## Step 6: Commit

```bash
git add public/.well-known/fred.json public/fred.json
git commit -m "Add FRED Protocol (fred.json) — AI agent discoverability"
```

## Conformance Levels (Target)

| Project Type | Target Level |
|-------------|-------------|
| Static site / blog | Level 1 (identity only) |
| SaaS product | Level 2 (+ capabilities + interaction) |
| Public API | Level 2 (+ capabilities + interaction + auth) |
| Marketplace / platform | Level 3 (all layers) |

## Entity Type Reference

| If the project is... | Use type |
|---------------------|----------|
| A web app / SaaS product | `product` |
| A standalone API service | `api` |
| A company or nonprofit | `organization` |
| A personal site / portfolio | `person` |
| A developer community | `community` |
| A data source | `dataset` |
| A marketplace | `marketplace` |
| Infrastructure / platform | `infrastructure` |

## Additional Resources

- **`references/platform-guide.md`** — Exact file placement and config for every major platform
- **`references/schema-reference.md`** — All 8 layers with field definitions
- **`scripts/validate.js`** — Reference validator (zero dependencies, Node.js)
