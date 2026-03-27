# FRED Protocol Specification

**Version:** 0.1.0
**Status:** Draft
**Author:** Freddy Lim
**Date:** 2026-03-27
**License:** Apache 2.0

---

## Abstract

The FRED Protocol (**F**inding & **R**eaching **E**ntities for **D**igital Agents) is an open protocol that makes any entity on the internet discoverable and interactable by AI agents. It provides a single, standardized file — `fred.json` — that entities publish at their domain root, enabling agents to understand who they are, what they offer, how to interact with them, what trust signals exist, and under what terms.

FRED sits above existing agent protocols (MCP, A2A, ADP, llms.txt) and unifies them into one implementation surface. It does not replace these protocols — it binds them together.

---

## Table of Contents

1. [Motivation](#1-motivation)
2. [Design Principles](#2-design-principles)
3. [Protocol Overview](#3-protocol-overview)
4. [File Location & Discovery](#4-file-location--discovery)
5. [Layer 1: Identity](#5-layer-1-identity)
6. [Layer 2: Capability](#6-layer-2-capability)
7. [Layer 3: Interaction](#7-layer-3-interaction)
8. [Layer 4: Trust](#8-layer-4-trust)
9. [Layer 5: Pricing](#9-layer-5-pricing)
10. [Layer 6: Context](#10-layer-6-context)
11. [Layer 7: Discovery](#11-layer-7-discovery)
12. [Layer 8: Policy](#12-layer-8-policy)
13. [Versioning](#13-versioning)
14. [Security Considerations](#14-security-considerations)
15. [Relationship to Other Protocols](#15-relationship-to-other-protocols)
16. [Conformance Levels](#16-conformance-levels)
17. [IANA Considerations](#17-iana-considerations)

---

## 1. Motivation

The agentic web is emerging. AI agents are becoming the primary interface between humans and the internet — browsing, purchasing, scheduling, researching, negotiating on behalf of users. But today, agents face a fragmented landscape:

- **Discovery is broken.** There is no standard way for an agent to find out what a website, API, or business can do. Agents resort to scraping, guessing, or relying on pre-configured integrations.

- **Interaction is fragmented.** MCP handles tool calling. A2A handles agent-to-agent communication. ADP handles agent deployment. llms.txt provides context for LLMs. But no protocol unifies these into a coherent "here is everything you need to know about me."

- **Trust is absent.** Agents have no standardized way to evaluate whether an entity is legitimate, verified, or safe to transact with.

- **Pricing is opaque.** When agents need to compare services or execute transactions, pricing structures are buried in HTML, PDFs, or require human navigation.

The FRED Protocol solves this by giving every entity on the internet a single, machine-readable identity file that answers the five fundamental questions agents ask:

1. **Who are you?** (Identity)
2. **What can you do?** (Capability)
3. **How do I interact with you?** (Interaction)
4. **Why should I trust you?** (Trust)
5. **What does it cost?** (Pricing)

Plus three supporting layers:

6. **What context should I have?** (Context)
7. **How do I find related entities?** (Discovery)
8. **What are the rules?** (Policy)

---

## 2. Design Principles

### 2.1 Single File, Full Story

One `fred.json` file per domain tells the complete story. An agent should never need to crawl, scrape, or guess after reading a valid FRED file.

### 2.2 Progressive Disclosure

Only Layer 1 (Identity) is required. All other layers are optional. An entity can start with just a name and description, then progressively add capabilities, trust signals, and pricing as they mature.

### 2.3 Protocol Agnostic

FRED does not compete with MCP, A2A, ADP, or llms.txt. It references them. A FRED file can point to an MCP server, an A2A endpoint, an llms.txt file, or any other protocol. FRED is the binding layer.

### 2.4 Human Readable, Machine Actionable

FRED files are JSON. They should be readable by a developer in a text editor and parseable by any agent without special libraries.

### 2.5 Verifiable by Default

Every claim in a FRED file can be independently verified. Domain ownership is verified by file location. Trust signals link to verifiable sources. Capabilities link to live endpoints.

### 2.6 Privacy Preserving

FRED files contain only information the entity chooses to publish. No tracking, no telemetry, no required personal data. Entities control their own disclosure.

---

## 3. Protocol Overview

A FRED implementation consists of a single JSON file served at a well-known URL:

```
https://{domain}/.well-known/fred.json
```

Alternative location (for convenience):

```
https://{domain}/fred.json
```

The file contains up to 8 layers, each represented as a top-level key:

```json
{
  "fred": "0.1",
  "identity": { ... },
  "capabilities": [ ... ],
  "interaction": { ... },
  "trust": { ... },
  "pricing": { ... },
  "context": { ... },
  "discovery": { ... },
  "policy": { ... }
}
```

The `fred` key is REQUIRED and specifies the protocol version. The `identity` layer is REQUIRED. All other layers are OPTIONAL.

---

## 4. File Location & Discovery

### 4.1 Primary Location

Agents MUST first check:

```
https://{domain}/.well-known/fred.json
```

### 4.2 Fallback Location

If the primary location returns a 404, agents SHOULD check:

```
https://{domain}/fred.json
```

### 4.3 Content Type

The file MUST be served with `Content-Type: application/json` or `Content-Type: application/fred+json`.

### 4.4 CORS

Implementations SHOULD serve the file with permissive CORS headers to allow browser-based agents:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### 4.5 Caching

Implementations SHOULD include appropriate cache headers. A `Cache-Control: max-age=3600` (1 hour) is RECOMMENDED as a default.

### 4.6 Size Limits

FRED files SHOULD NOT exceed 1 MB. Agents MAY refuse to process files larger than 1 MB.

### 4.7 DNS TXT Record (Optional)

Entities MAY publish a DNS TXT record to signal FRED support:

```
_fred.example.com. IN TXT "fred=0.1 url=https://example.com/.well-known/fred.json"
```

This allows discovery without an HTTP request and enables verification of domain ownership.

---

## 5. Layer 1: Identity

**Status:** REQUIRED

The identity layer tells agents who this entity is.

### 5.1 Schema

```json
{
  "identity": {
    "name": "string (REQUIRED)",
    "type": "string (REQUIRED)",
    "description": "string (REQUIRED)",
    "url": "string (REQUIRED, canonical URL)",
    "logo": "string (OPTIONAL, URL to logo image)",
    "contacts": [
      {
        "type": "string (email | url | phone | social)",
        "value": "string",
        "label": "string (OPTIONAL)"
      }
    ],
    "locale": "string (OPTIONAL, BCP 47 language tag)",
    "locales": ["string (OPTIONAL, additional supported locales)"],
    "established": "string (OPTIONAL, ISO 8601 date)",
    "jurisdiction": "string (OPTIONAL, ISO 3166-1 alpha-2 country code)",
    "identifiers": {
      "lei": "string (OPTIONAL, Legal Entity Identifier)",
      "duns": "string (OPTIONAL, D-U-N-S Number)",
      "vat": "string (OPTIONAL, VAT registration number)",
      "custom": {
        "key": "value"
      }
    }
  }
}
```

### 5.2 Entity Types

The `type` field MUST be one of the following:

| Type | Description |
|------|-------------|
| `organization` | A company, nonprofit, government agency, or other legal entity |
| `person` | An individual |
| `product` | A product or service |
| `api` | A standalone API service |
| `dataset` | A data source or collection |
| `community` | A community, forum, or collective |
| `marketplace` | A platform connecting buyers and sellers |
| `infrastructure` | A platform, protocol, or foundational service |

### 5.3 Example

```json
{
  "identity": {
    "name": "Freddy's",
    "type": "product",
    "description": "AI-powered CV builder that creates professional resumes in minutes",
    "url": "https://freddys.io",
    "logo": "https://freddys.io/logo.png",
    "contacts": [
      { "type": "email", "value": "hello@freddys.io", "label": "General" },
      { "type": "social", "value": "https://twitter.com/freddysio", "label": "Twitter" }
    ],
    "locale": "en",
    "established": "2024-01-15",
    "jurisdiction": "SG"
  }
}
```

---

## 6. Layer 2: Capability

**Status:** OPTIONAL

The capability layer tells agents what this entity can do. Each capability is a discrete, actionable thing an agent can invoke or reason about.

### 6.1 Schema

```json
{
  "capabilities": [
    {
      "id": "string (REQUIRED, unique within this file)",
      "name": "string (REQUIRED)",
      "description": "string (REQUIRED)",
      "category": "string (OPTIONAL)",
      "inputs": [
        {
          "name": "string",
          "type": "string (string | number | boolean | object | array | file)",
          "required": "boolean",
          "description": "string"
        }
      ],
      "outputs": [
        {
          "name": "string",
          "type": "string",
          "description": "string"
        }
      ],
      "constraints": {
        "rate_limit": "string (OPTIONAL, e.g., '100/hour')",
        "max_payload": "string (OPTIONAL, e.g., '10MB')",
        "regions": ["string (OPTIONAL, ISO 3166-1 alpha-2)"],
        "auth_required": "boolean (OPTIONAL)"
      },
      "examples": [
        {
          "input": {},
          "output": {},
          "description": "string"
        }
      ]
    }
  ]
}
```

### 6.2 Categories

While categories are freeform strings, the following are RECOMMENDED:

| Category | Description |
|----------|-------------|
| `content` | Content creation, editing, or transformation |
| `data` | Data retrieval, analysis, or processing |
| `commerce` | Buying, selling, or transacting |
| `communication` | Messaging, notifications, or alerts |
| `automation` | Workflow automation or scheduling |
| `identity` | Authentication, verification, or KYC |
| `search` | Search or discovery within the entity |
| `compute` | Computation, rendering, or processing |
| `storage` | File storage, hosting, or management |

### 6.3 Example

```json
{
  "capabilities": [
    {
      "id": "create-cv",
      "name": "Create CV",
      "description": "Generate a professional CV from structured input data",
      "category": "content",
      "inputs": [
        { "name": "personal_info", "type": "object", "required": true, "description": "Name, email, phone, location" },
        { "name": "experience", "type": "array", "required": true, "description": "Work experience entries" },
        { "name": "education", "type": "array", "required": false, "description": "Education history" },
        { "name": "template", "type": "string", "required": false, "description": "Template name (default: 'professional')" }
      ],
      "outputs": [
        { "name": "cv_url", "type": "string", "description": "URL to the generated CV" },
        { "name": "pdf_url", "type": "string", "description": "Direct download link for PDF" }
      ],
      "constraints": {
        "rate_limit": "50/hour",
        "auth_required": true
      }
    }
  ]
}
```

---

## 7. Layer 3: Interaction

**Status:** OPTIONAL

The interaction layer tells agents HOW to interact with this entity — what protocols are supported, what endpoints exist, and how to authenticate.

### 7.1 Schema

```json
{
  "interaction": {
    "protocols": [
      {
        "type": "string (REQUIRED)",
        "version": "string (OPTIONAL)",
        "url": "string (REQUIRED, endpoint or spec URL)",
        "description": "string (OPTIONAL)",
        "auth": {
          "type": "string (none | api_key | oauth2 | bearer | basic | custom)",
          "instructions_url": "string (OPTIONAL, URL to auth docs)",
          "scopes": ["string (OPTIONAL)"]
        }
      }
    ],
    "webhooks": {
      "supported": "boolean",
      "events": ["string"],
      "registration_url": "string (OPTIONAL)"
    },
    "rate_limits": {
      "default": "string (e.g., '1000/hour')",
      "authenticated": "string (OPTIONAL)",
      "burst": "string (OPTIONAL)"
    },
    "sdks": [
      {
        "language": "string",
        "package": "string",
        "url": "string"
      }
    ]
  }
}
```

### 7.2 Protocol Types

| Type | Description |
|------|-------------|
| `rest` | RESTful HTTP API |
| `graphql` | GraphQL API |
| `grpc` | gRPC service |
| `websocket` | WebSocket connection |
| `mcp` | Model Context Protocol server |
| `a2a` | Agent-to-Agent protocol endpoint |
| `llms_txt` | llms.txt file for LLM context |
| `openapi` | OpenAPI/Swagger specification |
| `soap` | SOAP web service |
| `webhook` | Webhook-based interaction |
| `browser` | Human-facing web interface (fallback) |
| `custom` | Custom protocol (describe in description field) |

### 7.3 Example

```json
{
  "interaction": {
    "protocols": [
      {
        "type": "rest",
        "version": "2",
        "url": "https://api.freddys.io/v2",
        "description": "Primary REST API for all CV operations",
        "auth": {
          "type": "oauth2",
          "instructions_url": "https://docs.freddys.io/auth",
          "scopes": ["cv:read", "cv:write", "templates:read"]
        }
      },
      {
        "type": "mcp",
        "url": "https://mcp.freddys.io",
        "description": "MCP server for AI agent integration"
      },
      {
        "type": "openapi",
        "version": "3.1",
        "url": "https://api.freddys.io/openapi.json"
      }
    ],
    "webhooks": {
      "supported": true,
      "events": ["cv.created", "cv.updated", "cv.exported"],
      "registration_url": "https://api.freddys.io/webhooks"
    },
    "sdks": [
      { "language": "javascript", "package": "@freddys/sdk", "url": "https://npm.im/@freddys/sdk" },
      { "language": "python", "package": "freddys", "url": "https://pypi.org/project/freddys/" }
    ]
  }
}
```

---

## 8. Layer 4: Trust

**Status:** OPTIONAL

The trust layer provides verifiable signals that help agents assess the legitimacy and reliability of an entity. Trust is not a single score — it is a collection of independently verifiable claims.

### 8.1 Schema

```json
{
  "trust": {
    "verified_domain": "boolean (OPTIONAL, true if serving from the domain in identity.url)",
    "verification": [
      {
        "type": "string (REQUIRED)",
        "issuer": "string (REQUIRED)",
        "url": "string (OPTIONAL, link to verification page)",
        "issued": "string (OPTIONAL, ISO 8601)",
        "expires": "string (OPTIONAL, ISO 8601)"
      }
    ],
    "reputation": {
      "users": "number (OPTIONAL, approximate user count)",
      "rating": {
        "score": "number (OPTIONAL, 0-5)",
        "count": "number (OPTIONAL, number of ratings)",
        "source": "string (OPTIONAL, e.g., 'Trustpilot')",
        "url": "string (OPTIONAL)"
      },
      "uptime": {
        "percentage": "number (OPTIONAL, e.g., 99.95)",
        "url": "string (OPTIONAL, status page URL)"
      }
    },
    "compliance": [
      {
        "standard": "string (e.g., 'GDPR', 'SOC2', 'HIPAA', 'ISO27001')",
        "status": "string (compliant | certified | in_progress)",
        "url": "string (OPTIONAL, link to certification or statement)"
      }
    ],
    "security": {
      "bug_bounty": "string (OPTIONAL, URL to bug bounty program)",
      "security_contact": "string (OPTIONAL, email or URL)",
      "security_txt": "string (OPTIONAL, URL to .well-known/security.txt)"
    },
    "transparency": {
      "open_source": "string (OPTIONAL, URL to source code)",
      "changelog": "string (OPTIONAL, URL to changelog)",
      "status_page": "string (OPTIONAL, URL to status page)"
    }
  }
}
```

### 8.2 Verification Types

| Type | Description |
|------|-------------|
| `domain` | DNS verification of domain ownership |
| `business` | Business registration verification |
| `identity` | Personal identity verification |
| `ssl` | SSL/TLS certificate verification |
| `social` | Social media account verification |
| `marketplace` | Marketplace seller verification |
| `government` | Government-issued verification |
| `third_party` | Third-party audit or verification |
| `community` | Community-driven verification (e.g., reviews, endorsements) |

### 8.3 Example

```json
{
  "trust": {
    "verified_domain": true,
    "verification": [
      {
        "type": "business",
        "issuer": "ACRA Singapore",
        "url": "https://www.acra.gov.sg",
        "issued": "2024-01-15"
      }
    ],
    "reputation": {
      "users": 15000,
      "rating": {
        "score": 4.7,
        "count": 892,
        "source": "Trustpilot",
        "url": "https://trustpilot.com/review/freddys.io"
      },
      "uptime": {
        "percentage": 99.95,
        "url": "https://status.freddys.io"
      }
    },
    "compliance": [
      { "standard": "GDPR", "status": "compliant", "url": "https://freddys.io/gdpr" },
      { "standard": "SOC2", "status": "in_progress" }
    ],
    "security": {
      "security_contact": "security@freddys.io",
      "security_txt": "https://freddys.io/.well-known/security.txt"
    },
    "transparency": {
      "changelog": "https://freddys.io/changelog",
      "status_page": "https://status.freddys.io"
    }
  }
}
```

---

## 9. Layer 5: Pricing

**Status:** OPTIONAL

The pricing layer enables agents to understand costs, compare options, and execute transactions without scraping or guesswork.

### 9.1 Schema

```json
{
  "pricing": {
    "currency": "string (REQUIRED if pricing is present, ISO 4217)",
    "model": "string (REQUIRED, free | freemium | subscription | pay_per_use | one_time | custom | contact)",
    "free_tier": {
      "available": "boolean",
      "limits": "string (description of free tier limits)"
    },
    "plans": [
      {
        "id": "string (REQUIRED)",
        "name": "string (REQUIRED)",
        "description": "string (OPTIONAL)",
        "price": {
          "amount": "number (REQUIRED)",
          "interval": "string (OPTIONAL, month | year | one_time | per_use)",
          "unit": "string (OPTIONAL, for per-use pricing, e.g., 'request', 'CV', 'GB')"
        },
        "features": ["string"],
        "limits": {
          "key": "value (string or number)"
        },
        "url": "string (OPTIONAL, link to plan details or signup)"
      }
    ],
    "payment_methods": ["string (OPTIONAL, e.g., 'credit_card', 'crypto', 'invoice', 'bank_transfer')"],
    "trial": {
      "available": "boolean",
      "duration": "string (OPTIONAL, e.g., '14 days')",
      "requires_payment": "boolean (OPTIONAL)"
    },
    "negotiable": "boolean (OPTIONAL, whether pricing is negotiable for enterprise)"
  }
}
```

### 9.2 Example

```json
{
  "pricing": {
    "currency": "USD",
    "model": "freemium",
    "free_tier": {
      "available": true,
      "limits": "3 CVs per month, basic templates only"
    },
    "plans": [
      {
        "id": "free",
        "name": "Free",
        "price": { "amount": 0, "interval": "month" },
        "features": ["3 CVs/month", "Basic templates", "PDF export"],
        "limits": { "cvs_per_month": 3, "templates": "basic" }
      },
      {
        "id": "pro",
        "name": "Pro",
        "description": "For active job seekers",
        "price": { "amount": 12, "interval": "month" },
        "features": ["Unlimited CVs", "All templates", "PDF & DOCX export", "AI optimization", "Cover letters"],
        "limits": { "cvs_per_month": -1, "templates": "all" },
        "url": "https://freddys.io/pricing#pro"
      },
      {
        "id": "enterprise",
        "name": "Enterprise",
        "description": "For recruiters and teams",
        "price": { "amount": 49, "interval": "month" },
        "features": ["Everything in Pro", "Team management", "API access", "Custom branding", "Priority support"],
        "url": "https://freddys.io/pricing#enterprise"
      }
    ],
    "payment_methods": ["credit_card"],
    "trial": {
      "available": true,
      "duration": "14 days",
      "requires_payment": false
    }
  }
}
```

---

## 10. Layer 6: Context

**Status:** OPTIONAL

The context layer provides additional information that helps agents make better decisions about this entity — industry context, FAQs, knowledge base pointers, and operational details.

### 10.1 Schema

```json
{
  "context": {
    "industry": ["string (OPTIONAL, industry tags)"],
    "tags": ["string (OPTIONAL, freeform tags)"],
    "languages": ["string (OPTIONAL, supported languages as BCP 47 tags)"],
    "faq": [
      {
        "question": "string",
        "answer": "string"
      }
    ],
    "knowledge_base": "string (OPTIONAL, URL to knowledge base or docs)",
    "llms_txt": "string (OPTIONAL, URL to llms.txt file)",
    "changelog": "string (OPTIONAL, URL to changelog)",
    "blog": "string (OPTIONAL, URL to blog)",
    "use_cases": [
      {
        "title": "string",
        "description": "string",
        "url": "string (OPTIONAL)"
      }
    ],
    "limitations": ["string (OPTIONAL, known limitations or restrictions)"],
    "sla": {
      "response_time": "string (OPTIONAL, e.g., '< 200ms p95')",
      "availability": "string (OPTIONAL, e.g., '99.9%')",
      "support_hours": "string (OPTIONAL, e.g., '24/7' or 'Mon-Fri 9-5 SGT')"
    }
  }
}
```

### 10.2 Example

```json
{
  "context": {
    "industry": ["hr-tech", "recruitment", "career"],
    "tags": ["cv", "resume", "ai", "job-search", "career-tools"],
    "languages": ["en", "zh", "ms", "ja"],
    "faq": [
      {
        "question": "What file formats are supported?",
        "answer": "We export CVs in PDF, DOCX, and HTML formats."
      },
      {
        "question": "Is my data stored?",
        "answer": "CV data is stored encrypted and can be deleted at any time from your account settings."
      }
    ],
    "knowledge_base": "https://docs.freddys.io",
    "llms_txt": "https://freddys.io/llms.txt",
    "use_cases": [
      {
        "title": "Job application automation",
        "description": "Agents can create tailored CVs for specific job listings",
        "url": "https://docs.freddys.io/use-cases/job-automation"
      }
    ],
    "sla": {
      "response_time": "< 500ms p95",
      "availability": "99.95%",
      "support_hours": "Mon-Fri 9-6 SGT"
    }
  }
}
```

---

## 11. Layer 7: Discovery

**Status:** OPTIONAL

The discovery layer helps agents find related entities, navigate ecosystems, and understand relationships. This is how the FRED network becomes interconnected.

### 11.1 Schema

```json
{
  "discovery": {
    "related": [
      {
        "url": "string (REQUIRED, URL to related entity's fred.json or domain)",
        "relationship": "string (REQUIRED)",
        "description": "string (OPTIONAL)"
      }
    ],
    "ecosystem": "string (OPTIONAL, URL to ecosystem registry or hub)",
    "parent": "string (OPTIONAL, URL to parent entity's fred.json)",
    "children": [
      {
        "url": "string",
        "name": "string",
        "description": "string (OPTIONAL)"
      }
    ],
    "alternatives": [
      {
        "url": "string",
        "name": "string",
        "differentiator": "string (OPTIONAL, what makes this entity different)"
      }
    ]
  }
}
```

### 11.2 Relationship Types

| Relationship | Description |
|-------------|-------------|
| `partner` | Business or integration partner |
| `provider` | Service provider or dependency |
| `consumer` | Entity that uses this entity's services |
| `competitor` | Alternative offering (transparent competition) |
| `parent` | Parent company or organization |
| `subsidiary` | Subsidiary or sub-brand |
| `integration` | Technical integration partner |
| `community` | Related community or forum |

### 11.3 Example

```json
{
  "discovery": {
    "related": [
      {
        "url": "https://linkedin.com",
        "relationship": "integration",
        "description": "Import profile data from LinkedIn"
      },
      {
        "url": "https://indeed.com",
        "relationship": "partner",
        "description": "Direct job application integration"
      }
    ],
    "alternatives": [
      {
        "url": "https://resume.io",
        "name": "Resume.io",
        "differentiator": "We focus on AI-powered optimization and multi-language support"
      }
    ]
  }
}
```

---

## 12. Layer 8: Policy

**Status:** OPTIONAL

The policy layer defines the rules of engagement — what agents can and cannot do, how data should be handled, and what legal terms apply.

### 12.1 Schema

```json
{
  "policy": {
    "terms_of_service": "string (OPTIONAL, URL)",
    "privacy_policy": "string (OPTIONAL, URL)",
    "acceptable_use": "string (OPTIONAL, URL)",
    "agent_policy": {
      "allowed_actions": ["string (OPTIONAL, actions agents are explicitly allowed to perform)"],
      "restricted_actions": ["string (OPTIONAL, actions agents must NOT perform)"],
      "rate_limits": {
        "requests_per_minute": "number (OPTIONAL)",
        "requests_per_hour": "number (OPTIONAL)",
        "requests_per_day": "number (OPTIONAL)"
      },
      "data_handling": {
        "storage_allowed": "boolean (OPTIONAL, whether agents may cache/store retrieved data)",
        "retention_period": "string (OPTIONAL, e.g., '24 hours', '30 days', 'session')",
        "sharing_allowed": "boolean (OPTIONAL, whether agents may share data with third parties)"
      },
      "attribution": {
        "required": "boolean (OPTIONAL)",
        "format": "string (OPTIONAL, required attribution text or template)"
      }
    },
    "data_residency": ["string (OPTIONAL, ISO 3166-1 alpha-2 country codes where data is stored)"],
    "gdpr": {
      "dpo_contact": "string (OPTIONAL, Data Protection Officer contact)",
      "data_processing_agreement": "string (OPTIONAL, URL to DPA)"
    }
  }
}
```

### 12.2 Example

```json
{
  "policy": {
    "terms_of_service": "https://freddys.io/terms",
    "privacy_policy": "https://freddys.io/privacy",
    "agent_policy": {
      "allowed_actions": ["create_cv", "read_templates", "export_cv"],
      "restricted_actions": ["delete_account", "modify_billing", "access_other_users"],
      "rate_limits": {
        "requests_per_minute": 60,
        "requests_per_hour": 1000
      },
      "data_handling": {
        "storage_allowed": true,
        "retention_period": "session",
        "sharing_allowed": false
      },
      "attribution": {
        "required": true,
        "format": "Generated by Freddy's (https://freddys.io)"
      }
    },
    "data_residency": ["SG", "US"],
    "gdpr": {
      "dpo_contact": "dpo@freddys.io",
      "data_processing_agreement": "https://freddys.io/dpa"
    }
  }
}
```

---

## 13. Versioning

### 13.1 Protocol Version

The `fred` field specifies the protocol version using Semantic Versioning (major.minor):

- **Major version** changes indicate breaking changes. Agents MUST check the major version before processing.
- **Minor version** changes indicate backwards-compatible additions. Agents SHOULD process files with a higher minor version than they understand, ignoring unknown fields.

### 13.2 Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.1 | 2026-03-27 | Initial draft specification |

### 13.3 File Versioning

The `fred.json` file itself does not have an internal version history. Entities SHOULD use their domain's existing versioning infrastructure (e.g., git) to track changes. Agents SHOULD use HTTP caching headers (`ETag`, `Last-Modified`) to detect changes.

---

## 14. Security Considerations

### 14.1 Domain Verification

The strongest trust signal in FRED is domain verification — the fact that the file is served from the claimed domain. Agents SHOULD verify that `identity.url` matches the domain serving the FRED file.

### 14.2 HTTPS Requirement

FRED files MUST be served over HTTPS. Agents MUST reject files served over plain HTTP.

### 14.3 Content Integrity

Implementations MAY include a `Digest` HTTP header (RFC 3230) to allow agents to verify file integrity.

### 14.4 No Executable Content

FRED files MUST NOT contain executable code, scripts, or references to executable content. Agents MUST NOT execute any content found in FRED files.

### 14.5 Input Validation

Agents MUST validate all URLs in FRED files before following them. URLs MUST use the `https` scheme. Agents SHOULD implement appropriate timeouts and redirect limits.

### 14.6 Rate Limiting

Agents SHOULD respect the rate limits specified in the `policy.agent_policy.rate_limits` section. Agents that repeatedly exceed rate limits MAY be blocked.

### 14.7 Privacy

Agents MUST respect the `policy.agent_policy.data_handling` section. Data marked as `storage_allowed: false` MUST NOT be persisted beyond the current session.

---

## 15. Relationship to Other Protocols

FRED is a binding layer, not a replacement. Here is how it relates to existing protocols:

| Protocol | Relationship | How FRED References It |
|----------|-------------|----------------------|
| **MCP** (Model Context Protocol) | FRED points to MCP servers | `interaction.protocols[].type: "mcp"` |
| **A2A** (Agent-to-Agent) | FRED points to A2A endpoints | `interaction.protocols[].type: "a2a"` |
| **ADP** (Agent Deployment Protocol) | FRED describes the deployed agent | `capabilities[]` describes what ADP agents do |
| **llms.txt** | FRED points to llms.txt files | `context.llms_txt` links to the llms.txt URL |
| **OpenAPI** | FRED points to API specs | `interaction.protocols[].type: "openapi"` |
| **Schema.org** | FRED provides complementary structured data | FRED is agent-first; Schema.org is search-engine-first |
| **robots.txt** | FRED defines agent permissions | `policy.agent_policy` extends robots.txt for AI agents |
| **security.txt** | FRED references security contacts | `trust.security.security_txt` links to the file |
| **humans.txt** | FRED is the machine-readable equivalent | FRED tells agents what humans.txt tells humans |

### 15.1 Why Not Just Extend These?

Each of these protocols serves a specific purpose well. But none of them answer the full question: "What is this entity, and how should I interact with it?" FRED provides the unified entry point that links them all together.

---

## 16. Conformance Levels

Implementations can claim conformance at three levels:

### Level 1: Basic

- Serves a valid `fred.json` at the well-known URL
- Includes the `fred` version field
- Includes a complete `identity` layer
- File passes JSON schema validation

### Level 2: Interactive

Meets Level 1, plus:
- Includes at least one `capability`
- Includes at least one `interaction.protocol`
- All referenced URLs are accessible

### Level 3: Complete

Meets Level 2, plus:
- Includes `trust` layer with at least one verification
- Includes `pricing` layer (if entity has pricing)
- Includes `policy` layer with `agent_policy`
- All capabilities have examples
- File is under 500 KB

---

## 17. IANA Considerations

### 17.1 Well-Known URI

This specification registers the well-known URI `fred.json` under the `.well-known` URI registry per RFC 8615.

### 17.2 Media Type

This specification defines the media type `application/fred+json` for FRED files. The standard `application/json` media type is also acceptable.

---

## Appendix A: Complete fred.json Example

See the reference implementations:
- [freddys.io/fred.json](./examples/freddys.io/fred.json) — SaaS product
- [claudecode.sg/fred.json](./examples/claudecode.sg/fred.json) — Developer community

## Appendix B: Validation

A reference validator is available at [validate.js](./validate.js). It checks:
- JSON syntax
- Required fields presence
- Schema conformance
- URL accessibility (optional, with `--live` flag)
- Conformance level determination

## Appendix C: Frequently Asked Questions

**Q: Why JSON and not YAML or TOML?**
A: JSON is universally supported, requires no special parsers, and is the standard format for web APIs. FRED files should be trivially parseable by any agent.

**Q: Why not use Schema.org?**
A: Schema.org is optimized for search engine crawlers, not AI agents. Its vocabulary is vast and loosely defined. FRED is small, precise, and agent-first.

**Q: What if my entity doesn't have pricing?**
A: Don't include the pricing layer. Only Layer 1 (Identity) is required.

**Q: Can I have multiple fred.json files for subdomains?**
A: Yes. Each subdomain can have its own fred.json. Use the `discovery.parent` and `discovery.children` fields to link them.

**Q: How does an agent decide which capabilities to use?**
A: Agents use the `capabilities[].description`, `category`, and `inputs`/`outputs` to match user intent to available capabilities. The `context.use_cases` and `capabilities[].examples` fields help agents understand when to use each capability.

---

*This specification is maintained by the FRED Protocol community. Contributions are welcome via GitHub.*
