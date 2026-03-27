import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = [
  "organization", "person", "product", "api",
  "dataset", "community", "marketplace", "infrastructure",
];

function validateFred(data: unknown) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push("FRED file must be a JSON object");
    return { valid: false, level: 0, errors, warnings, entityName: null, entityType: null };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.fred) errors.push('Missing required field: "fred"');

  if (!obj.identity) {
    errors.push('Missing required field: "identity"');
  } else {
    const id = obj.identity as Record<string, unknown>;
    if (!id.name) errors.push('identity: Missing required field "name"');
    if (!id.type) errors.push('identity: Missing required field "type"');
    if (!id.description) errors.push('identity: Missing required field "description"');
    if (!id.url) errors.push('identity: Missing required field "url"');

    if (id.type && !VALID_TYPES.includes(id.type as string)) {
      errors.push(`identity.type: "${id.type}" is not a valid type. Must be one of: ${VALID_TYPES.join(", ")}`);
    }
    if (id.url && typeof id.url === "string" && !id.url.startsWith("https://")) {
      warnings.push("identity.url should use https://");
    }
  }

  const caps = obj.capabilities as unknown[];
  const protos = (obj.interaction as Record<string, unknown>)?.protocols as unknown[];

  let level = errors.length === 0 ? 1 : 0;
  if (level === 1 && Array.isArray(caps) && caps.length > 0 && Array.isArray(protos) && protos.length > 0) {
    level = 2;
  }
  if (level === 2) {
    const trust = obj.trust as Record<string, unknown>;
    const policy = obj.policy as Record<string, unknown>;
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

  const id = obj.identity as Record<string, unknown> | undefined;
  return {
    valid: errors.length === 0,
    level,
    errors,
    warnings,
    entityName: (id?.name as string) ?? null,
    entityType: (id?.type as string) ?? null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateFred(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { valid: false, level: 0, errors: ["Invalid JSON body"], warnings: [], entityName: null, entityType: null },
      { status: 400 }
    );
  }
}
