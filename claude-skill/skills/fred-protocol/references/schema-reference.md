# FRED Protocol — Schema Quick Reference

All 8 layers with field definitions. All layers except `identity` are optional.

---

## Root

```json
{
  "fred": "0.1",          // REQUIRED — protocol version
  "identity": { ... },    // REQUIRED
  "capabilities": [ ... ], // optional
  "interaction": { ... },  // optional
  "trust": { ... },        // optional
  "pricing": { ... },      // optional
  "context": { ... },      // optional
  "discovery": { ... },    // optional
  "policy": { ... }        // optional
}
```

---

## Layer 1: Identity (REQUIRED)

```json
{
  "identity": {
    "name": "string",           // REQUIRED — display name
    "type": "string",           // REQUIRED — see entity types below
    "description": "string",    // REQUIRED — one sentence, max 1024 chars
    "url": "string",            // REQUIRED — canonical https URL
    "logo": "string",           // optional — https URL to logo image
    "contacts": [
      {
        "type": "email|url|phone|social",  // REQUIRED
        "value": "string",                  // REQUIRED
        "label": "string"                   // optional
      }
    ],
    "locale": "en",             // optional — BCP 47 (e.g., "en", "zh-CN")
    "locales": ["en", "zh"],    // optional — additional supported locales
    "established": "2024-01-15",// optional — ISO 8601 date
    "jurisdiction": "SG"        // optional — ISO 3166-1 alpha-2 country
  }
}
```

**Entity types:** `organization` · `person` · `product` · `api` · `dataset` · `community` · `marketplace` · `infrastructure`

---

## Layer 2: Capabilities (optional)

```json
{
  "capabilities": [
    {
      "id": "create-cv",          // REQUIRED — lowercase slug, unique
      "name": "Create CV",        // REQUIRED
      "description": "string",    // REQUIRED
      "category": "string",       // optional — see categories below
      "inputs": [
        {
          "name": "string",       // REQUIRED
          "type": "string|number|boolean|object|array|file",  // REQUIRED
          "required": true,       // optional
          "description": "string" // REQUIRED
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
        "rate_limit": "50/hour",
        "auth_required": true
      },
      "examples": [
        {
          "input": { ... },
          "output": { ... },
          "description": "string"
        }
      ]
    }
  ]
}
```

**Categories:** `content` · `data` · `commerce` · `communication` · `automation` · `identity` · `search` · `compute` · `storage`

---

## Layer 3: Interaction (optional)

```json
{
  "interaction": {
    "protocols": [
      {
        "type": "string",         // REQUIRED — see protocol types
        "url": "string",          // REQUIRED — https endpoint URL
        "version": "string",      // optional
        "description": "string",  // optional
        "auth": {
          "type": "none|api_key|oauth2|bearer|basic|custom",
          "instructions_url": "string",
          "scopes": ["read", "write"]
        }
      }
    ],
    "webhooks": {
      "supported": true,
      "events": ["created", "updated"],
      "registration_url": "string"
    },
    "sdks": [
      { "language": "javascript", "package": "@company/sdk", "url": "string" }
    ]
  }
}
```

**Protocol types:** `rest` · `graphql` · `grpc` · `websocket` · `mcp` · `a2a` · `llms_txt` · `openapi` · `soap` · `webhook` · `browser` · `custom`

---

## Layer 4: Trust (optional)

```json
{
  "trust": {
    "verified_domain": true,
    "verification": [
      {
        "type": "business|domain|ssl|social|government|third_party|community",
        "issuer": "ACRA Singapore",   // REQUIRED
        "url": "string",
        "issued": "2024-01-15",
        "expires": "2026-01-15"
      }
    ],
    "reputation": {
      "users": 15000,
      "rating": {
        "score": 4.7,         // 0-5
        "count": 892,
        "source": "Trustpilot",
        "url": "string"
      },
      "uptime": {
        "percentage": 99.95,  // 0-100
        "url": "https://status.example.com"
      }
    },
    "compliance": [
      {
        "standard": "GDPR",
        "status": "compliant|certified|in_progress",
        "url": "string"
      }
    ],
    "security": {
      "security_contact": "security@example.com",
      "security_txt": "https://example.com/.well-known/security.txt"
    }
  }
}
```

---

## Layer 5: Pricing (optional)

```json
{
  "pricing": {
    "currency": "USD",          // REQUIRED if pricing present — ISO 4217
    "model": "free|freemium|subscription|pay_per_use|one_time|custom|contact",  // REQUIRED
    "free_tier": {
      "available": true,
      "limits": "3 items/month"
    },
    "plans": [
      {
        "id": "pro",            // REQUIRED
        "name": "Pro",          // REQUIRED
        "price": {
          "amount": 12,         // REQUIRED — 0 for free
          "interval": "month|year|one_time|per_use"
        },
        "features": ["Unlimited X", "Feature Y"],
        "url": "https://example.com/pricing#pro"
      }
    ],
    "payment_methods": ["credit_card", "crypto"],
    "trial": {
      "available": true,
      "duration": "14 days",
      "requires_payment": false
    }
  }
}
```

---

## Layer 6: Context (optional)

```json
{
  "context": {
    "industry": ["hr-tech", "saas"],
    "tags": ["ai", "cv", "resume"],
    "languages": ["en", "zh"],
    "faq": [
      { "question": "string", "answer": "string" }
    ],
    "knowledge_base": "https://docs.example.com",
    "llms_txt": "https://example.com/llms.txt",
    "use_cases": [
      {
        "title": "string",
        "description": "string",
        "url": "string"
      }
    ],
    "limitations": ["Max 4 pages", "English only"],
    "sla": {
      "response_time": "< 200ms p95",
      "availability": "99.9%",
      "support_hours": "Mon-Fri 9-6 SGT"
    }
  }
}
```

---

## Layer 7: Discovery (optional)

```json
{
  "discovery": {
    "related": [
      {
        "url": "https://partner.com",
        "relationship": "partner|provider|consumer|competitor|parent|subsidiary|integration|community",
        "description": "string"
      }
    ],
    "alternatives": [
      {
        "url": "https://alternative.com",
        "name": "Alternative Name",
        "differentiator": "What makes us different"
      }
    ]
  }
}
```

---

## Layer 8: Policy (optional)

```json
{
  "policy": {
    "terms_of_service": "https://example.com/terms",
    "privacy_policy": "https://example.com/privacy",
    "agent_policy": {
      "allowed_actions": ["read", "create"],
      "restricted_actions": ["delete_account", "access_other_users"],
      "rate_limits": {
        "requests_per_minute": 60,
        "requests_per_hour": 1000,
        "requests_per_day": 10000
      },
      "data_handling": {
        "storage_allowed": true,
        "retention_period": "session",
        "sharing_allowed": false
      },
      "attribution": {
        "required": true,
        "format": "Powered by Example (https://example.com)"
      }
    },
    "data_residency": ["SG", "US"]
  }
}
```
