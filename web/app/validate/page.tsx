"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, ChevronRight } from "lucide-react";

interface ValidationResult {
  valid: boolean;
  level: number;
  errors: string[];
  warnings: string[];
  entityName: string | null;
  entityType: string | null;
}

const LEVEL_LABELS = ["", "Basic", "Interactive", "Complete"];
const LEVEL_DESC = [
  "",
  "Has identity layer. Ready to publish.",
  "Has capabilities + interaction protocols.",
  "Has trust verification + agent policy.",
];

function validateFred(json: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: Record<string, unknown> | null = null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    return {
      valid: false,
      level: 0,
      errors: [`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`],
      warnings: [],
      entityName: null,
      entityType: null,
    };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push("FRED file must be a JSON object");
    return { valid: false, level: 0, errors, warnings, entityName: null, entityType: null };
  }

  if (!data.fred) errors.push('Missing required field: "fred"');
  if (!data.identity) {
    errors.push('Missing required field: "identity"');
  } else {
    const id = data.identity as Record<string, unknown>;
    if (!id.name) errors.push('identity: Missing required field "name"');
    if (!id.type) errors.push('identity: Missing required field "type"');
    if (!id.description) errors.push('identity: Missing required field "description"');
    if (!id.url) errors.push('identity: Missing required field "url"');

    const validTypes = ["organization","person","product","api","dataset","community","marketplace","infrastructure"];
    if (id.type && !validTypes.includes(id.type as string)) {
      errors.push(`identity.type: "${id.type}" is not a valid type`);
    }

    if (id.url && typeof id.url === "string" && !id.url.startsWith("https://")) {
      warnings.push("identity.url should use https://");
    }
  }

  const caps = data.capabilities as unknown[];
  const protos = (data.interaction as Record<string, unknown>)?.protocols as unknown[];

  let level = errors.length === 0 ? 1 : 0;
  if (level === 1 && Array.isArray(caps) && caps.length > 0 && Array.isArray(protos) && protos.length > 0) level = 2;
  if (level === 2) {
    const trust = data.trust as Record<string, unknown>;
    const policy = data.policy as Record<string, unknown>;
    const hasVerification = Array.isArray(trust?.verification) && (trust.verification as unknown[]).length > 0;
    const hasAgentPolicy = !!(policy?.agent_policy);
    if (hasVerification && hasAgentPolicy) level = 3;
  }

  if (level >= 1 && Array.isArray(caps)) {
    const missingExamples = caps.filter((c) => {
      const cap = c as Record<string, unknown>;
      return !Array.isArray(cap.examples) || (cap.examples as unknown[]).length === 0;
    });
    if (missingExamples.length > 0) {
      warnings.push(`${missingExamples.length} capability(ies) missing examples (recommended for Level 3)`);
    }
  }

  const id = data.identity as Record<string, unknown> | undefined;
  return {
    valid: errors.length === 0,
    level,
    errors,
    warnings,
    entityName: id?.name as string ?? null,
    entityType: id?.type as string ?? null,
  };
}

const EXAMPLE = JSON.stringify({
  fred: "0.1",
  identity: {
    name: "Acme Corp",
    type: "organization",
    description: "We build developer tools for modern teams.",
    url: "https://acme.com",
  },
  capabilities: [
    { id: "search", name: "Search Products", description: "Full-text search", category: "search" },
  ],
  interaction: {
    protocols: [{ type: "rest", url: "https://api.acme.com/v1" }],
  },
}, null, 2);

export default function Validate() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  function handleValidate() {
    if (!input.trim()) return;
    setResult(validateFred(input));
  }

  function handleExample() {
    setInput(EXAMPLE);
    setResult(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <div className="mb-10">
        <div className="text-xs font-mono text-violet-400 mb-4">FRED Protocol</div>
        <h1 className="text-4xl font-bold text-zinc-50 mb-3">Validate your fred.json</h1>
        <p className="text-zinc-400">Paste your fred.json below. Get instant pass/fail feedback.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Your fred.json</label>
            <button
              onClick={handleExample}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Load example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); }}
            placeholder={'{\n  "fred": "0.1",\n  "identity": {\n    "name": "...",\n    ...\n  }\n}'}
            rows={18}
            spellCheck={false}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-600 focus:outline-none rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 placeholder-zinc-700 resize-none transition-colors"
          />
          <button
            onClick={handleValidate}
            disabled={!input.trim()}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Validate →
          </button>
        </div>

        {/* Results */}
        <div>
          <div className="text-sm font-medium text-zinc-300 mb-2">Results</div>

          {!result ? (
            <div className="h-full min-h-[200px] bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 text-sm">
              Paste your fred.json and click Validate
            </div>
          ) : (
            <div className="space-y-4">

              {/* Status */}
              <div className={`rounded-xl p-5 border ${result.valid ? "bg-emerald-950/30 border-emerald-900/50" : "bg-red-950/30 border-red-900/50"}`}>
                <div className="flex items-center gap-3 mb-2">
                  {result.valid
                    ? <CheckCircle className="text-emerald-400 shrink-0" size={24} />
                    : <XCircle className="text-red-400 shrink-0" size={24} />
                  }
                  <span className={`text-lg font-bold ${result.valid ? "text-emerald-300" : "text-red-300"}`}>
                    {result.valid ? "VALID" : "INVALID"}
                  </span>
                </div>
                {result.entityName && (
                  <div className="text-sm text-zinc-400 font-mono">
                    {result.entityName} · {result.entityType}
                  </div>
                )}
              </div>

              {/* Conformance level */}
              {result.valid && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs text-zinc-500 mb-2 font-mono">Conformance level</div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-2xl text-violet-400">L{result.level}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{LEVEL_LABELS[result.level]}</div>
                      <div className="text-xs text-zinc-500">{LEVEL_DESC[result.level]}</div>
                    </div>
                  </div>
                  {result.level < 3 && (
                    <div className="mt-3 space-y-1">
                      {result.level < 2 && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <ChevronRight size={12} />
                          Add capabilities + interaction protocols for Level 2
                        </div>
                      )}
                      {result.level < 3 && result.level >= 2 && (
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <ChevronRight size={12} />
                          Add trust.verification + policy.agent_policy for Level 3
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs text-red-400 font-medium mb-2">
                    {result.errors.length} error{result.errors.length > 1 ? "s" : ""}
                  </div>
                  <ul className="space-y-1.5">
                    {result.errors.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                        <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xs text-amber-400 font-medium mb-2">
                    {result.warnings.length} warning{result.warnings.length > 1 ? "s" : ""}
                  </div>
                  <ul className="space-y-1.5">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-300/80">
                        <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
