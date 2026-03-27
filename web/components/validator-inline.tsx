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

function validateFred(json: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let data: Record<string, unknown> | null = null;

  try {
    data = JSON.parse(json);
  } catch (e) {
    return { valid: false, level: 0, errors: [`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`], warnings: [], entityName: null, entityType: null };
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
    if (id.type && !validTypes.includes(id.type as string)) errors.push(`identity.type: "${id.type}" is not valid`);
    if (id.url && typeof id.url === "string" && !id.url.startsWith("https://")) warnings.push("identity.url should use https://");
  }

  const caps = data.capabilities as unknown[];
  const protos = (data.interaction as Record<string, unknown>)?.protocols as unknown[];
  let level = errors.length === 0 ? 1 : 0;
  if (level === 1 && Array.isArray(caps) && caps.length > 0 && Array.isArray(protos) && protos.length > 0) level = 2;
  if (level === 2) {
    const trust = data.trust as Record<string, unknown>;
    const policy = data.policy as Record<string, unknown>;
    if (Array.isArray(trust?.verification) && (trust.verification as unknown[]).length > 0 && policy?.agent_policy) level = 3;
  }

  const id = data.identity as Record<string, unknown> | undefined;
  return { valid: errors.length === 0, level, errors, warnings, entityName: id?.name as string ?? null, entityType: id?.type as string ?? null };
}

const EXAMPLE = JSON.stringify({
  fred: "0.1",
  identity: { name: "Acme Corp", type: "organization", description: "Developer tools for modern teams.", url: "https://acme.com" },
  capabilities: [{ id: "search", name: "Search Products", description: "Full-text search", category: "search" }],
  interaction: { protocols: [{ type: "rest", url: "https://api.acme.com/v1" }] },
}, null, 2);

export function ValidatorInline() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-400">Paste your fred.json</label>
          <button onClick={() => { setInput(EXAMPLE); setResult(null); }} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            Load example
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          placeholder={'{\n  "fred": "0.1",\n  "identity": {\n    "name": "...",\n    ...\n  }\n}'}
          rows={14}
          spellCheck={false}
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-600 focus:outline-none rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 placeholder-zinc-700 resize-none transition-colors"
        />
        <button
          onClick={() => { if (input.trim()) setResult(validateFred(input)); }}
          disabled={!input.trim()}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Validate →
        </button>
      </div>

      {/* Results */}
      <div>
        {!result ? (
          <div className="h-full min-h-[200px] bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 text-sm">
            Paste your fred.json and click Validate
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 border ${result.valid ? "bg-emerald-950/30 border-emerald-900/50" : "bg-red-950/30 border-red-900/50"}`}>
              <div className="flex items-center gap-3 mb-1">
                {result.valid ? <CheckCircle className="text-emerald-400" size={20} /> : <XCircle className="text-red-400" size={20} />}
                <span className={`text-base font-bold ${result.valid ? "text-emerald-300" : "text-red-300"}`}>
                  {result.valid ? "VALID" : "INVALID"}
                </span>
              </div>
              {result.entityName && <div className="text-xs text-zinc-500 font-mono ml-8">{result.entityName} · {result.entityType}</div>}
            </div>

            {result.valid && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xl text-violet-400">L{result.level}</span>
                  <span className="text-sm text-zinc-300">{LEVEL_LABELS[result.level]}</span>
                </div>
                {result.level < 3 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                    <ChevronRight size={12} />
                    {result.level < 2 ? "Add capabilities + interaction for Level 2" : "Add trust.verification + policy.agent_policy for Level 3"}
                  </div>
                )}
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                {result.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-300">
                    <XCircle size={12} className="text-red-500 shrink-0 mt-0.5" />{e}
                  </div>
                ))}
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-300/80">
                    <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />{w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
