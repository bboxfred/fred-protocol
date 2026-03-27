import { NextRequest, NextResponse } from "next/server";

interface ClaimBody {
  domain: string;
  name: string;
  type: string;
  description: string;
  url: string;
  email: string;
  capabilities?: string;
  protocol_type?: string;
  protocol_url?: string;
  mcp_url?: string;
  api_url?: string;
  openapi_url?: string;
  verified_domain?: boolean;
  uptime_url?: string;
  pricing_model?: string;
  pricing_url?: string;
  llms_txt?: string;
  faq_url?: string;
  related_entities?: string;
  rate_limit?: string;
  data_retention?: string;
  agent_instructions?: string;
}

function buildFredJson(body: ClaimBody) {
  const fred: Record<string, unknown> = {
    fred: "0.1",
    identity: {
      name: body.name,
      type: body.type,
      description: body.description,
      url: body.url,
    },
  };

  // Layer 2: Capabilities
  if (body.capabilities?.trim()) {
    const lines = body.capabilities.split("\n").map(l => l.trim()).filter(Boolean);
    fred.capabilities = lines.map((line) => ({
      id: line.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: line,
      description: line,
      category: "general",
    }));
  }

  // Layer 3: Interaction
  const protocols: Array<{ type: string; url: string }> = [];
  if (body.protocol_type && body.protocol_url) protocols.push({ type: body.protocol_type, url: body.protocol_url });
  if (body.mcp_url) protocols.push({ type: "mcp", url: body.mcp_url });
  if (body.api_url) protocols.push({ type: "rest", url: body.api_url });
  if (body.openapi_url) protocols.push({ type: "openapi", url: body.openapi_url });
  if (protocols.length > 0) fred.interaction = { protocols };

  // Layer 4: Trust
  const verification: Array<{ type: string; status: string }> = [];
  if (body.verified_domain) verification.push({ type: "domain", status: "verified" });
  if (verification.length > 0 || body.uptime_url) {
    fred.trust = {
      ...(verification.length > 0 ? { verification } : {}),
      ...(body.uptime_url ? { uptime: { status_url: body.uptime_url } } : {}),
    };
  }

  // Layer 5: Pricing
  if (body.pricing_model) {
    fred.pricing = { model: body.pricing_model, ...(body.pricing_url ? { url: body.pricing_url } : {}) };
  }

  // Layer 6: Context
  if (body.llms_txt || body.faq_url) {
    fred.context = {
      ...(body.llms_txt ? { llms_txt: body.llms_txt } : {}),
      ...(body.faq_url ? { knowledge_base: [{ url: body.faq_url, type: "faq" }] } : {}),
    };
  }

  // Layer 7: Discovery
  if (body.related_entities?.trim()) {
    const urls = body.related_entities.split("\n").map(l => l.trim()).filter(Boolean);
    fred.discovery = { related_entities: urls.map(u => ({ url: u })) };
  }

  // Layer 8: Policy
  if (body.rate_limit || body.data_retention || body.agent_instructions) {
    fred.policy = {
      ...(body.rate_limit ? { rate_limits: { requests_per_minute: parseInt(body.rate_limit) || 60 } } : {}),
      ...(body.data_retention ? { data_handling: { retention: body.data_retention } } : {}),
      ...(body.agent_instructions ? { agent_policy: { instructions: body.agent_instructions } } : {}),
    };
  }

  fred.meta = {
    generated_by: "hungryhuman.co/fredprotocol",
    generated_at: new Date().toISOString(),
  };

  return fred;
}

export async function POST(req: NextRequest) {
  try {
    const body: ClaimBody = await req.json();

    if (!body.domain || !body.name || !body.type || !body.description || !body.url || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const domain = body.domain
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()
      .trim();

    if (!domain || !/^[a-z0-9][a-z0-9.-]{0,61}[a-z0-9]\.[a-z]{2,}$/i.test(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
    }

    const fredJson = buildFredJson({ ...body, domain });
    const content = JSON.stringify(fredJson, null, 2);

    // Try Vercel Blob if token is available
    let hostedUrl = `https://hungryhuman.co/fredprotocol/f/${domain}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`fred/${domain}.json`, content, {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false,
        });
        hostedUrl = blob.url;
      } catch (e) {
        console.error("Blob storage failed, returning JSON directly:", e);
      }
    }

    return NextResponse.json({
      fred_url: hostedUrl,
      hosted_at: `https://hungryhuman.co/fredprotocol/f/${domain}`,
      fred_json: fredJson,
    });
  } catch (err) {
    console.error("Claim error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
