"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const ENTITY_TYPES = [
  "product", "organization", "person", "api",
  "community", "dataset", "marketplace", "infrastructure",
];

const PRICING_MODELS = [
  "free", "freemium", "subscription", "pay_per_use", "one_time", "contact",
];

const PROTOCOL_TYPES = [
  { value: "", label: "Select..." },
  { value: "rest", label: "REST API" },
  { value: "mcp", label: "MCP (Model Context Protocol)" },
  { value: "openapi", label: "OpenAPI" },
  { value: "graphql", label: "GraphQL" },
  { value: "a2a", label: "A2A (Agent-to-Agent)" },
  { value: "websocket", label: "WebSocket" },
  { value: "grpc", label: "gRPC" },
  { value: "webhook", label: "Webhook" },
];

interface FormData {
  /* Layer 1: Identity */
  domain: string;
  name: string;
  type: string;
  description: string;
  url: string;
  email: string;
  /* Layer 2: Capability */
  capabilities: string;
  /* Layer 3: Interaction */
  protocol_type: string;
  protocol_url: string;
  mcp_url: string;
  api_url: string;
  openapi_url: string;
  /* Layer 4: Trust */
  verified_domain: boolean;
  uptime_url: string;
  /* Layer 5: Pricing */
  pricing_model: string;
  pricing_url: string;
  /* Layer 6: Context */
  llms_txt: string;
  faq_url: string;
  /* Layer 7: Discovery */
  related_entities: string;
  /* Layer 8: Policy */
  rate_limit: string;
  data_retention: string;
  agent_instructions: string;
}

interface ClaimResult {
  fred_url: string;
  fred_json: object;
}

export default function Claim() {
  const [form, setForm] = useState<FormData>({
    domain: "", name: "", type: "product", description: "", url: "", email: "",
    capabilities: "",
    protocol_type: "", protocol_url: "", mcp_url: "", api_url: "", openapi_url: "",
    verified_domain: false, uptime_url: "",
    pricing_model: "free", pricing_url: "",
    llms_txt: "", faq_url: "",
    related_entities: "",
    rate_limit: "", data_retention: "", agent_instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type: inputType } = e.target;
    const checked = inputType === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => {
      const updated = { ...prev, [name]: inputType === "checkbox" ? checked : value };
      if (name === "domain" && !prev.url) {
        updated.url = value ? `https://${value}` : "";
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/fredprotocol/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-zinc-950 border border-zinc-700 focus:border-violet-600 focus:outline-none rounded-lg px-3 py-2.5 text-zinc-200 text-sm placeholder-zinc-600 transition-colors";
  const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";
  const selectClass = `${inputClass} cursor-pointer`;
  const sectionClass = "pt-6 mt-6 border-t border-zinc-800/50";
  const sectionLabel = "text-xs font-mono text-violet-400/70 mb-4 flex items-center gap-2";

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="text-emerald-400 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">Your fred.json is ready.</h1>
          <p className="text-zinc-400">Check your email to verify ownership and go live.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-5">
          <div className="text-xs font-mono text-zinc-500 mb-2">Your fred.json will be live at:</div>
          <div className="font-mono text-sm text-violet-400 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3">
            hungryhuman.co/fredprotocol/f/{form.domain}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <span className="text-xs font-mono text-zinc-500">fred.json preview</span>
          </div>
          <pre className="p-5 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
            {JSON.stringify(result.fred_json, null, 2)}
          </pre>
        </div>

        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 text-sm text-amber-200/80">
          Check <strong>{form.email}</strong> for a verification link. Your fred.json goes live once verified.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">

      <div className="mb-10">
        <div className="text-xs font-mono text-violet-400 mb-4">FRED Protocol · Free Hosting</div>
        <h1 className="text-4xl font-bold text-zinc-50 mb-3">fred.json Auto-Install</h1>
        <p className="text-zinc-400 leading-relaxed">
          Fill this in. We generate and host your <code className="font-mono text-violet-400 text-sm">fred.json</code> for free.
          The more you fill in, the more discoverable you are. Only the first section is required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ─── Layer 1: Identity (required) ─── */}
        <div>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] text-violet-400">1</span>
            Identity — Who are you? <span className="text-violet-400 text-[10px] ml-auto">required</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Domain</label>
              <input name="domain" value={form.domain} onChange={handleChange} placeholder="yoursite.com" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Project" required className={inputClass} />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={selectClass}>
              {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-zinc-300">Description</label>
              <span className="text-xs text-zinc-600">{form.description.length}/200</span>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What you do, in one sentence." required maxLength={200} rows={2} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Public URL</label>
              <input name="url" value={form.url} onChange={handleChange} placeholder="https://yoursite.com" required type="url" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email <span className="text-zinc-600">(for verification)</span></label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="you@yoursite.com" required type="email" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Layer 2: Capability ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400">2</span>
            Capability — What can you do?
          </div>
          <div>
            <label className={labelClass}>List your main capabilities <span className="text-zinc-600">(one per line)</span></label>
            <textarea name="capabilities" value={form.capabilities} onChange={handleChange} placeholder={"Search products\nCreate invoices\nGenerate reports"} rows={3} className={`${inputClass} resize-none`} />
            <p className="text-[11px] text-zinc-600 mt-1">Each line becomes a capability entry in your fred.json.</p>
          </div>
        </div>

        {/* ─── Layer 3: Interaction ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] text-blue-400">3</span>
            Interaction — How do agents reach you?
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Primary protocol</label>
              <select name="protocol_type" value={form.protocol_type} onChange={handleChange} className={selectClass}>
                {PROTOCOL_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Protocol endpoint URL</label>
              <input name="protocol_url" value={form.protocol_url} onChange={handleChange} placeholder="https://api.yoursite.com" className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>MCP server URL</label>
              <input name="mcp_url" value={form.mcp_url} onChange={handleChange} placeholder="https://mcp.yoursite.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>REST API URL</label>
              <input name="api_url" value={form.api_url} onChange={handleChange} placeholder="https://api.yoursite.com/v1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>OpenAPI spec URL</label>
              <input name="openapi_url" value={form.openapi_url} onChange={handleChange} placeholder="https://yoursite.com/openapi.json" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Layer 4: Trust ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">4</span>
            Trust — Why should agents trust you?
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="verified_domain" checked={form.verified_domain} onChange={handleChange} className="rounded border-zinc-700 bg-zinc-950 text-violet-600 focus:ring-violet-600" />
              <label className="text-sm text-zinc-300">Domain ownership verified (via DNS or email)</label>
            </div>
            <div>
              <label className={labelClass}>Status/uptime page URL</label>
              <input name="uptime_url" value={form.uptime_url} onChange={handleChange} placeholder="https://status.yoursite.com" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Layer 5: Pricing ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-[10px] text-yellow-400">5</span>
            Pricing — What does it cost?
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Pricing model</label>
              <select name="pricing_model" value={form.pricing_model} onChange={handleChange} className={selectClass}>
                {PRICING_MODELS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.replace(/_/g, " ").slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Pricing page URL</label>
              <input name="pricing_url" value={form.pricing_url} onChange={handleChange} placeholder="https://yoursite.com/pricing" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Layer 6: Context ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-400">6</span>
            Context — What should agents know?
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>llms.txt URL</label>
              <input name="llms_txt" value={form.llms_txt} onChange={handleChange} placeholder="https://yoursite.com/llms.txt" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>FAQ / Help center URL</label>
              <input name="faq_url" value={form.faq_url} onChange={handleChange} placeholder="https://yoursite.com/faq" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ─── Layer 7: Discovery ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400">7</span>
            Discovery — Who else is related?
          </div>
          <div>
            <label className={labelClass}>Related sites or partners <span className="text-zinc-600">(one URL per line)</span></label>
            <textarea name="related_entities" value={form.related_entities} onChange={handleChange} placeholder={"https://partner-one.com\nhttps://partner-two.com"} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* ─── Layer 8: Policy ─── */}
        <div className={sectionClass}>
          <div className={sectionLabel}>
            <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[10px] text-rose-400">8</span>
            Policy — What are the rules for agents?
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Rate limit <span className="text-zinc-600">(requests per minute)</span></label>
              <input name="rate_limit" value={form.rate_limit} onChange={handleChange} placeholder="60" type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Data retention</label>
              <input name="data_retention" value={form.data_retention} onChange={handleChange} placeholder="30 days" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Instructions for AI agents</label>
            <textarea name="agent_instructions" value={form.agent_instructions} onChange={handleChange} placeholder="Always identify yourself when making requests. Do not scrape content without permission." rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/60 rounded-lg px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-medium transition-colors text-base"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Generating…</>
          ) : (
            <>Generate my fred.json <ArrowRight size={18} /></>
          )}
        </button>

        <p className="text-center text-xs text-zinc-600">
          100% free. No account required. Open source. Apache 2.0.
        </p>
      </form>

    </div>
  );
}
