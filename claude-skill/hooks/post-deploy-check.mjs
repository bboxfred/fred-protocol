#!/usr/bin/env node
// post-deploy-check.mjs
// Fires after Bash tool calls. Detects deployments and public project creation.
// If no fred.json exists, suggests adding FRED Protocol.

import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';

const input = JSON.parse(readFileSync('/dev/stdin', 'utf8'));

const command = input?.tool_input?.command || '';
const cwd = process.cwd();

// Commands that indicate a public deployment or project creation
const deploymentPatterns = [
  /vercel\s+(deploy|--prod)/i,
  /netlify\s+deploy/i,
  /git\s+push/i,
  /npm\s+publish/i,
  /gh\s+repo\s+create/i,
  /create-next-app/i,
  /npx\s+create-/i,
];

const isDeployment = deploymentPatterns.some(p => p.test(command));

if (!isDeployment) {
  process.exit(0);
}

// Check if fred.json already exists anywhere in the project
const fredPaths = [
  join(cwd, 'fred.json'),
  join(cwd, 'public/fred.json'),
  join(cwd, 'public/.well-known/fred.json'),
  join(cwd, '.well-known/fred.json'),
];

const hasFred = fredPaths.some(p => existsSync(p));

if (hasFred) {
  process.exit(0);
}

// Output suggestion as additionalContext
const output = {
  additionalContext: `## FRED Protocol — Not detected in this project

This looks like a public deployment. No \`fred.json\` was found.

**FRED Protocol** makes this project discoverable by AI agents. It's one JSON file at \`/.well-known/fred.json\` that tells agents:
- Who you are (identity)
- What you can do (capabilities)
- How to interact (API, MCP server)
- Why to trust you (verification)
- What it costs (pricing)

**Would you like to add FRED Protocol to this project?**

Just say "add FRED to this project" and I'll generate the \`fred.json\` automatically.

Learn more: https://hungryhuman.co/fredprotocol`
};

console.log(JSON.stringify(output));
process.exit(0);
