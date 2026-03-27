# FRED Protocol — Claude Code Skill

A Claude Code skill that automatically adds FRED Protocol support to any project you build.

## What it does

Whenever you create a public product, deploy a site, or build an API — this skill kicks in and:

1. Reads your project to understand what it is
2. Asks you 5 quick questions
3. Generates a `fred.json` tailored to your project
4. Places it at the correct location for your framework
5. Validates it

Your product is now discoverable by any AI agent that speaks FRED.

## Install

```bash
# Clone or download this skill
git clone https://github.com/bboxfred/fred-protocol

# Install the Claude Code skill
cp -r fred-protocol/claude-skill ~/.claude/plugins/fred-protocol
```

That's it. Restart Claude Code and the skill is active.

## Usage

The skill triggers automatically when you:

- Say "add FRED Protocol to my project"
- Say "make this discoverable by AI agents"
- Create a new public product and Claude notices no `fred.json` exists
- Ask "what am I missing before I launch?"

Or invoke it directly:

```
/fred-protocol
```

## Manual validation

```bash
node ~/.claude/plugins/fred-protocol/skills/fred-protocol/scripts/validate.js path/to/fred.json
```

## Learn more

Full protocol spec: [fred-spec.md](../fred-spec.md)
