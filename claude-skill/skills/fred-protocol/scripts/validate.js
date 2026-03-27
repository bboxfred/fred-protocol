#!/usr/bin/env node

/**
 * FRED Protocol Validator
 *
 * Validates fred.json files against the FRED Protocol specification v0.1.
 *
 * Usage:
 *   node validate.js <path-to-fred.json>
 *   node validate.js <path-to-fred.json> --live    # also check URL accessibility
 *   node validate.js --stdin                        # read from stdin
 *   cat fred.json | node validate.js --stdin
 *
 * Exit codes:
 *   0 = valid
 *   1 = invalid
 *   2 = file not found or read error
 */

const fs = require("fs");
const path = require("path");

// ── Schema (embedded for zero-dependency usage) ──────────────────────────

const REQUIRED_FIELDS = {
  root: ["fred", "identity"],
  identity: ["name", "type", "description", "url"],
  capability: ["id", "name", "description"],
  protocol: ["type", "url"],
  verification: ["type", "issuer"],
  compliance: ["standard", "status"],
  plan: ["id", "name", "price"],
  price: ["amount"],
  related: ["url", "relationship"],
  child: ["url", "name"],
  alternative: ["url", "name"],
  faq: ["question", "answer"],
  use_case: ["title", "description"],
  contact: ["type", "value"],
  sdk: ["language", "package", "url"],
  capability_param: ["name", "type", "description"],
};

const VALID_ENTITY_TYPES = [
  "organization",
  "person",
  "product",
  "api",
  "dataset",
  "community",
  "marketplace",
  "infrastructure",
];

const VALID_PROTOCOL_TYPES = [
  "rest",
  "graphql",
  "grpc",
  "websocket",
  "mcp",
  "a2a",
  "llms_txt",
  "openapi",
  "soap",
  "webhook",
  "browser",
  "custom",
];

const VALID_AUTH_TYPES = [
  "none",
  "api_key",
  "oauth2",
  "bearer",
  "basic",
  "custom",
];

const VALID_VERIFICATION_TYPES = [
  "domain",
  "business",
  "identity",
  "ssl",
  "social",
  "marketplace",
  "government",
  "third_party",
  "community",
];

const VALID_COMPLIANCE_STATUSES = ["compliant", "certified", "in_progress"];

const VALID_PRICING_MODELS = [
  "free",
  "freemium",
  "subscription",
  "pay_per_use",
  "one_time",
  "custom",
  "contact",
];

const VALID_PRICE_INTERVALS = ["month", "year", "one_time", "per_use"];

const VALID_CONTACT_TYPES = ["email", "url", "phone", "social"];

const VALID_PARAM_TYPES = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "file",
];

const VALID_RELATIONSHIP_TYPES = [
  "partner",
  "provider",
  "consumer",
  "competitor",
  "parent",
  "subsidiary",
  "integration",
  "community",
];

// ── Validation Engine ────────────────────────────────────────────────────

class FredValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  error(path, message) {
    this.errors.push({ path, message });
  }

  warn(path, message) {
    this.warnings.push({ path, message });
  }

  checkRequired(obj, fields, path) {
    for (const field of fields) {
      if (obj[field] === undefined || obj[field] === null) {
        this.error(path, `Missing required field: "${field}"`);
      }
    }
  }

  checkEnum(value, validValues, path, fieldName) {
    if (value !== undefined && !validValues.includes(value)) {
      this.error(
        path,
        `Invalid ${fieldName}: "${value}". Must be one of: ${validValues.join(", ")}`
      );
    }
  }

  checkUrl(value, path, fieldName) {
    if (value === undefined) return;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        this.warn(path, `${fieldName} should use https:// scheme`);
      }
    } catch {
      this.error(path, `Invalid URL for ${fieldName}: "${value}"`);
    }
  }

  checkString(value, path, fieldName, { minLength, maxLength, pattern } = {}) {
    if (value === undefined) return;
    if (typeof value !== "string") {
      this.error(path, `${fieldName} must be a string`);
      return;
    }
    if (minLength !== undefined && value.length < minLength) {
      this.error(
        path,
        `${fieldName} must be at least ${minLength} characters`
      );
    }
    if (maxLength !== undefined && value.length > maxLength) {
      this.error(
        path,
        `${fieldName} must be at most ${maxLength} characters`
      );
    }
    if (pattern !== undefined && !new RegExp(pattern).test(value)) {
      this.error(path, `${fieldName} does not match required pattern`);
    }
  }

  // ── Layer validators ─────────────────────────────────────────────────

  validateRoot(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      this.error("$", "FRED file must be a JSON object");
      return;
    }

    this.checkRequired(data, REQUIRED_FIELDS.root, "$");

    // Version check
    if (data.fred !== undefined) {
      this.checkString(data.fred, "$.fred", "fred version", {
        pattern: "^\\d+\\.\\d+$",
      });
    }

    // Validate each layer
    if (data.identity) this.validateIdentity(data.identity);
    if (data.capabilities) this.validateCapabilities(data.capabilities);
    if (data.interaction) this.validateInteraction(data.interaction);
    if (data.trust) this.validateTrust(data.trust);
    if (data.pricing) this.validatePricing(data.pricing);
    if (data.context) this.validateContext(data.context);
    if (data.discovery) this.validateDiscovery(data.discovery);
    if (data.policy) this.validatePolicy(data.policy);

    // Check for unknown top-level keys
    const validKeys = [
      "fred",
      "identity",
      "capabilities",
      "interaction",
      "trust",
      "pricing",
      "context",
      "discovery",
      "policy",
    ];
    for (const key of Object.keys(data)) {
      if (!validKeys.includes(key)) {
        this.warn("$", `Unknown top-level key: "${key}"`);
      }
    }
  }

  validateIdentity(identity) {
    const p = "$.identity";
    this.checkRequired(identity, REQUIRED_FIELDS.identity, p);
    this.checkEnum(identity.type, VALID_ENTITY_TYPES, p, "type");
    this.checkUrl(identity.url, p, "url");
    this.checkUrl(identity.logo, p, "logo");
    this.checkString(identity.name, p, "name", {
      minLength: 1,
      maxLength: 256,
    });
    this.checkString(identity.description, p, "description", {
      minLength: 1,
      maxLength: 1024,
    });
    this.checkString(identity.locale, p, "locale", {
      pattern: "^[a-z]{2}(-[A-Z]{2})?$",
    });
    this.checkString(identity.jurisdiction, p, "jurisdiction", {
      pattern: "^[A-Z]{2}$",
    });

    if (identity.contacts && Array.isArray(identity.contacts)) {
      identity.contacts.forEach((c, i) => {
        const cp = `${p}.contacts[${i}]`;
        this.checkRequired(c, REQUIRED_FIELDS.contact, cp);
        this.checkEnum(c.type, VALID_CONTACT_TYPES, cp, "type");
      });
    }

    if (identity.locales && Array.isArray(identity.locales)) {
      identity.locales.forEach((l, i) => {
        this.checkString(l, `${p}.locales[${i}]`, "locale", {
          pattern: "^[a-z]{2}(-[A-Z]{2})?$",
        });
      });
    }
  }

  validateCapabilities(capabilities) {
    if (!Array.isArray(capabilities)) {
      this.error("$.capabilities", "capabilities must be an array");
      return;
    }

    const ids = new Set();
    capabilities.forEach((cap, i) => {
      const p = `$.capabilities[${i}]`;
      this.checkRequired(cap, REQUIRED_FIELDS.capability, p);

      if (cap.id) {
        if (ids.has(cap.id)) {
          this.error(p, `Duplicate capability id: "${cap.id}"`);
        }
        ids.add(cap.id);
        this.checkString(cap.id, p, "id", {
          pattern: "^[a-z0-9][a-z0-9_-]*$",
        });
      }

      if (cap.inputs && Array.isArray(cap.inputs)) {
        cap.inputs.forEach((input, j) => {
          const ip = `${p}.inputs[${j}]`;
          this.checkRequired(input, REQUIRED_FIELDS.capability_param, ip);
          this.checkEnum(input.type, VALID_PARAM_TYPES, ip, "type");
        });
      }

      if (cap.outputs && Array.isArray(cap.outputs)) {
        cap.outputs.forEach((output, j) => {
          const op = `${p}.outputs[${j}]`;
          this.checkRequired(output, REQUIRED_FIELDS.capability_param, op);
          this.checkEnum(output.type, VALID_PARAM_TYPES, op, "type");
        });
      }
    });
  }

  validateInteraction(interaction) {
    const p = "$.interaction";

    if (interaction.protocols && Array.isArray(interaction.protocols)) {
      interaction.protocols.forEach((proto, i) => {
        const pp = `${p}.protocols[${i}]`;
        this.checkRequired(proto, REQUIRED_FIELDS.protocol, pp);
        this.checkEnum(proto.type, VALID_PROTOCOL_TYPES, pp, "type");
        this.checkUrl(proto.url, pp, "url");

        if (proto.auth) {
          this.checkEnum(
            proto.auth.type,
            VALID_AUTH_TYPES,
            `${pp}.auth`,
            "type"
          );
          this.checkUrl(
            proto.auth.instructions_url,
            `${pp}.auth`,
            "instructions_url"
          );
        }
      });
    }

    if (interaction.sdks && Array.isArray(interaction.sdks)) {
      interaction.sdks.forEach((sdk, i) => {
        const sp = `${p}.sdks[${i}]`;
        this.checkRequired(sdk, REQUIRED_FIELDS.sdk, sp);
        this.checkUrl(sdk.url, sp, "url");
      });
    }
  }

  validateTrust(trust) {
    const p = "$.trust";

    if (trust.verification && Array.isArray(trust.verification)) {
      trust.verification.forEach((v, i) => {
        const vp = `${p}.verification[${i}]`;
        this.checkRequired(v, REQUIRED_FIELDS.verification, vp);
        this.checkEnum(v.type, VALID_VERIFICATION_TYPES, vp, "type");
        this.checkUrl(v.url, vp, "url");
      });
    }

    if (trust.reputation) {
      if (trust.reputation.rating) {
        const r = trust.reputation.rating;
        if (r.score !== undefined && (r.score < 0 || r.score > 5)) {
          this.error(
            `${p}.reputation.rating`,
            "score must be between 0 and 5"
          );
        }
        this.checkUrl(r.url, `${p}.reputation.rating`, "url");
      }
      if (trust.reputation.uptime) {
        const u = trust.reputation.uptime;
        if (
          u.percentage !== undefined &&
          (u.percentage < 0 || u.percentage > 100)
        ) {
          this.error(
            `${p}.reputation.uptime`,
            "percentage must be between 0 and 100"
          );
        }
        this.checkUrl(u.url, `${p}.reputation.uptime`, "url");
      }
    }

    if (trust.compliance && Array.isArray(trust.compliance)) {
      trust.compliance.forEach((c, i) => {
        const cp = `${p}.compliance[${i}]`;
        this.checkRequired(c, REQUIRED_FIELDS.compliance, cp);
        this.checkEnum(c.status, VALID_COMPLIANCE_STATUSES, cp, "status");
      });
    }
  }

  validatePricing(pricing) {
    const p = "$.pricing";
    if (pricing.currency) {
      this.checkString(pricing.currency, p, "currency", {
        pattern: "^[A-Z]{3}$",
      });
    } else {
      this.error(p, 'Missing required field: "currency"');
    }
    this.checkEnum(pricing.model, VALID_PRICING_MODELS, p, "model");

    if (pricing.plans && Array.isArray(pricing.plans)) {
      pricing.plans.forEach((plan, i) => {
        const pp = `${p}.plans[${i}]`;
        this.checkRequired(plan, REQUIRED_FIELDS.plan, pp);

        if (plan.price) {
          this.checkRequired(plan.price, REQUIRED_FIELDS.price, `${pp}.price`);
          if (
            plan.price.amount !== undefined &&
            typeof plan.price.amount === "number" &&
            plan.price.amount < 0
          ) {
            this.error(`${pp}.price`, "amount must be >= 0");
          }
          this.checkEnum(
            plan.price.interval,
            VALID_PRICE_INTERVALS,
            `${pp}.price`,
            "interval"
          );
        }
        this.checkUrl(plan.url, pp, "url");
      });
    }
  }

  validateContext(context) {
    const p = "$.context";

    if (context.faq && Array.isArray(context.faq)) {
      context.faq.forEach((item, i) => {
        this.checkRequired(item, REQUIRED_FIELDS.faq, `${p}.faq[${i}]`);
      });
    }

    if (context.use_cases && Array.isArray(context.use_cases)) {
      context.use_cases.forEach((uc, i) => {
        this.checkRequired(
          uc,
          REQUIRED_FIELDS.use_case,
          `${p}.use_cases[${i}]`
        );
        this.checkUrl(uc.url, `${p}.use_cases[${i}]`, "url");
      });
    }

    this.checkUrl(context.knowledge_base, p, "knowledge_base");
    this.checkUrl(context.llms_txt, p, "llms_txt");
    this.checkUrl(context.changelog, p, "changelog");
    this.checkUrl(context.blog, p, "blog");
  }

  validateDiscovery(discovery) {
    const p = "$.discovery";

    if (discovery.related && Array.isArray(discovery.related)) {
      discovery.related.forEach((r, i) => {
        const rp = `${p}.related[${i}]`;
        this.checkRequired(r, REQUIRED_FIELDS.related, rp);
        this.checkEnum(
          r.relationship,
          VALID_RELATIONSHIP_TYPES,
          rp,
          "relationship"
        );
        this.checkUrl(r.url, rp, "url");
      });
    }

    this.checkUrl(discovery.ecosystem, p, "ecosystem");
    this.checkUrl(discovery.parent, p, "parent");

    if (discovery.children && Array.isArray(discovery.children)) {
      discovery.children.forEach((c, i) => {
        const cp = `${p}.children[${i}]`;
        this.checkRequired(c, REQUIRED_FIELDS.child, cp);
        this.checkUrl(c.url, cp, "url");
      });
    }

    if (discovery.alternatives && Array.isArray(discovery.alternatives)) {
      discovery.alternatives.forEach((a, i) => {
        const ap = `${p}.alternatives[${i}]`;
        this.checkRequired(a, REQUIRED_FIELDS.alternative, ap);
        this.checkUrl(a.url, ap, "url");
      });
    }
  }

  validatePolicy(policy) {
    const p = "$.policy";
    this.checkUrl(policy.terms_of_service, p, "terms_of_service");
    this.checkUrl(policy.privacy_policy, p, "privacy_policy");
    this.checkUrl(policy.acceptable_use, p, "acceptable_use");

    if (policy.agent_policy && policy.agent_policy.rate_limits) {
      const rl = policy.agent_policy.rate_limits;
      for (const key of [
        "requests_per_minute",
        "requests_per_hour",
        "requests_per_day",
      ]) {
        if (rl[key] !== undefined && (typeof rl[key] !== "number" || rl[key] < 0)) {
          this.error(
            `${p}.agent_policy.rate_limits`,
            `${key} must be a non-negative number`
          );
        }
      }
    }
  }

  // ── Conformance Level ────────────────────────────────────────────────

  determineConformanceLevel(data) {
    // Level 1: Basic
    if (!data.fred || !data.identity) return 0;
    if (!data.identity.name || !data.identity.type || !data.identity.description || !data.identity.url) return 0;
    if (this.errors.length > 0) return 0;

    let level = 1;

    // Level 2: Interactive
    const hasCaps =
      data.capabilities && Array.isArray(data.capabilities) && data.capabilities.length > 0;
    const hasProtocol =
      data.interaction &&
      data.interaction.protocols &&
      data.interaction.protocols.length > 0;

    if (hasCaps && hasProtocol) {
      level = 2;
    }

    // Level 3: Complete
    if (level === 2) {
      const hasTrust =
        data.trust &&
        data.trust.verification &&
        data.trust.verification.length > 0;
      const hasPolicy =
        data.policy && data.policy.agent_policy;
      const hasExamples =
        data.capabilities &&
        data.capabilities.every((c) => c.examples && c.examples.length > 0);

      if (hasTrust && hasPolicy) {
        level = 3;
        if (!hasExamples) {
          this.warn(
            "conformance",
            "Level 3 recommends examples for all capabilities"
          );
        }
      }
    }

    return level;
  }

  // ── Main validate method ─────────────────────────────────────────────

  validate(jsonString) {
    this.errors = [];
    this.warnings = [];

    // Parse JSON
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      this.error("$", `Invalid JSON: ${e.message}`);
      return this.result(null);
    }

    // Validate
    this.validateRoot(data);

    return this.result(data);
  }

  result(data) {
    const valid = this.errors.length === 0;
    const level = data ? this.determineConformanceLevel(data) : 0;

    return {
      valid,
      conformanceLevel: level,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        layers: data
          ? [
              "identity",
              "capabilities",
              "interaction",
              "trust",
              "pricing",
              "context",
              "discovery",
              "policy",
            ].filter((l) => data[l] !== undefined)
          : [],
        entityName: data && data.identity ? data.identity.name : null,
        entityType: data && data.identity ? data.identity.type : null,
        version: data ? data.fred : null,
      },
    };
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────

function printResult(result) {
  const RESET = "\x1b[0m";
  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const YELLOW = "\x1b[33m";
  const BOLD = "\x1b[1m";
  const DIM = "\x1b[2m";

  console.log("");
  console.log(
    `${BOLD}FRED Protocol Validator v0.1${RESET}`
  );
  console.log("─".repeat(50));

  if (result.summary.entityName) {
    console.log(
      `  Entity:  ${BOLD}${result.summary.entityName}${RESET} (${result.summary.entityType})`
    );
    console.log(`  Version: ${result.summary.version}`);
    console.log(
      `  Layers:  ${result.summary.layers.join(", ") || "none"}`
    );
    console.log("");
  }

  if (result.valid) {
    console.log(`  ${GREEN}${BOLD}VALID${RESET} ${GREEN}— fred.json passes validation${RESET}`);
  } else {
    console.log(
      `  ${RED}${BOLD}INVALID${RESET} ${RED}— fred.json has ${result.errors.length} error(s)${RESET}`
    );
  }

  const levelLabels = ["None", "Basic", "Interactive", "Complete"];
  const levelColors = [RED, YELLOW, GREEN, GREEN];
  console.log(
    `  ${DIM}Conformance:${RESET} ${levelColors[result.conformanceLevel]}Level ${result.conformanceLevel} — ${levelLabels[result.conformanceLevel]}${RESET}`
  );

  if (result.errors.length > 0) {
    console.log("");
    console.log(`  ${RED}${BOLD}Errors:${RESET}`);
    for (const err of result.errors) {
      console.log(`  ${RED}  x ${DIM}${err.path}${RESET} ${err.message}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log("");
    console.log(`  ${YELLOW}${BOLD}Warnings:${RESET}`);
    for (const warn of result.warnings) {
      console.log(
        `  ${YELLOW}  ! ${DIM}${warn.path}${RESET} ${warn.message}`
      );
    }
  }

  console.log("");
  console.log("─".repeat(50));
  console.log("");
}

// ── Entry Point ─────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
FRED Protocol Validator v0.1

Usage:
  node validate.js <path-to-fred.json>
  node validate.js --stdin
  cat fred.json | node validate.js --stdin

Options:
  --help, -h    Show this help message
  --json        Output results as JSON instead of formatted text
  --stdin       Read fred.json from stdin

Exit codes:
  0 = valid
  1 = invalid
  2 = file not found or read error
`);
    process.exit(0);
  }

  const outputJson = args.includes("--json");
  const useStdin = args.includes("--stdin");

  const validator = new FredValidator();

  if (useStdin) {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => {
      const result = validator.validate(input);
      if (outputJson) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        printResult(result);
      }
      process.exit(result.valid ? 0 : 1);
    });
  } else {
    const filePath = args.find((a) => !a.startsWith("--"));
    if (!filePath) {
      console.error("Error: No file path provided");
      process.exit(2);
    }

    const resolvedPath = path.resolve(filePath);

    let content;
    try {
      content = fs.readFileSync(resolvedPath, "utf8");
    } catch (e) {
      console.error(`Error: Cannot read file "${resolvedPath}": ${e.message}`);
      process.exit(2);
    }

    const result = validator.validate(content);

    if (outputJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printResult(result);
    }

    process.exit(result.valid ? 0 : 1);
  }
}

// Export for programmatic use
module.exports = { FredValidator };
