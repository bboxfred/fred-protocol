# FRED Protocol — Platform Placement Guide

Where to put `fred.json` on every major platform and framework.

---

## Next.js (App Router or Pages Router)

**Location:** `public/.well-known/fred.json`

Next.js serves everything in `public/` as static files at the root. The `.well-known/` directory works automatically.

```bash
mkdir -p public/.well-known
# Write fred.json here
```

Also add a root fallback:
```bash
cp public/.well-known/fred.json public/fred.json
```

No configuration needed. Vercel, Netlify, and all Next.js hosts serve this correctly.

---

## Vite (React, Vue, Svelte, vanilla)

**Location:** `public/.well-known/fred.json`

Vite copies `public/` directly to the build output.

```bash
mkdir -p public/.well-known
```

No config changes needed.

---

## Astro

**Location:** `public/.well-known/fred.json`

Astro serves `public/` as static assets.

```bash
mkdir -p public/.well-known
```

---

## Create React App (CRA)

**Location:** `public/.well-known/fred.json`

Same as Vite — `public/` is served at root.

---

## Express / Node.js API

**Location:** anywhere + explicit route

Option A — serve as static file:
```javascript
// In your Express app
app.use('/.well-known', express.static(path.join(__dirname, 'well-known')))
```
Then put the file at `well-known/fred.json` in your project root.

Option B — dedicated route:
```javascript
const fred = require('./fred.json')
app.get('/.well-known/fred.json', (req, res) => {
  res.set('Content-Type', 'application/json')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Cache-Control', 'max-age=3600')
  res.json(fred)
})
// Fallback
app.get('/fred.json', (req, res) => res.redirect('/.well-known/fred.json'))
```

---

## FastAPI / Python

**Location:** static file + mount

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Option A: static mount
app.mount("/.well-known", StaticFiles(directory="well-known"), name="well-known")

# Option B: explicit route
@app.get("/.well-known/fred.json")
async def fred():
    return FileResponse("fred.json", media_type="application/json", headers={
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=3600"
    })
```

Put `fred.json` in your project root or `well-known/` folder.

---

## Plain HTML / Static Site

**Location:** `.well-known/fred.json` at root of deployed site

If deploying a folder of HTML files:
```
my-site/
├── index.html
├── fred.json          ← fallback
└── .well-known/
    └── fred.json      ← primary
```

---

## Vercel (any framework)

**Location:** `public/.well-known/fred.json`

Vercel serves `public/` as static assets for all frameworks. Works with zero config.

Optionally add to `vercel.json` for explicit headers:
```json
{
  "headers": [
    {
      "source": "/.well-known/fred.json",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "max-age=3600" },
        { "key": "Content-Type", "value": "application/json" }
      ]
    }
  ]
}
```

---

## Netlify

**Location:** `public/.well-known/fred.json`

Add to `netlify.toml` for headers:
```toml
[[headers]]
  for = "/.well-known/fred.json"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Cache-Control = "max-age=3600"
    Content-Type = "application/json"
```

---

## GitHub Pages

**Location:** `.well-known/fred.json` in the `gh-pages` branch root (or `docs/` folder)

GitHub Pages serves from the repo root. No `.well-known` restrictions.

```bash
# If publishing from /docs
mkdir -p docs/.well-known
cp fred.json docs/.well-known/fred.json
cp fred.json docs/fred.json
```

---

## WordPress

**Location:** Upload via FTP/SFTP or plugin

Option A — FTP/SFTP:
Upload `fred.json` to:
```
/public_html/.well-known/fred.json
/public_html/fred.json
```

Option B — Custom endpoint via `functions.php`:
```php
add_action('init', function() {
    add_rewrite_rule('^\.well-known/fred\.json$', 'index.php?fred_protocol=1', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'fred_protocol';
    return $vars;
});

add_action('template_redirect', function() {
    if (get_query_var('fred_protocol')) {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        readfile(get_template_directory() . '/fred.json');
        exit;
    }
});
```

---

## Squarespace

**Option:** Use a Code Injection block or a custom 404 redirect.

Squarespace doesn't allow arbitrary file uploads. Best workaround:

1. Host `fred.json` on a CDN (e.g., GitHub raw, Cloudflare R2)
2. Add a redirect in Squarespace settings:
   - Settings → Advanced → URL Mappings
   - Add: `/.well-known/fred.json -> https://cdn.example.com/fred.json 301`

---

## Webflow

**Option:** Host externally + redirect

1. Upload `fred.json` to Webflow's Asset Manager (or external CDN)
2. Add a 301 redirect in Webflow's Publishing settings

---

## Shopify

**Location:** Not directly possible — use a proxy

Shopify controls all routes. Options:

1. Use a Shopify App to add a route (complex)
2. Use a reverse proxy (Cloudflare Worker) to inject the response:

```javascript
// Cloudflare Worker
addEventListener('fetch', event => {
  if (event.request.url.includes('/.well-known/fred.json')) {
    event.respondWith(new Response(JSON.stringify(FRED_DATA), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    }))
  } else {
    event.respondWith(fetch(event.request))
  }
})
```

---

## Django

**Location:** Static files + URL route

```python
# urls.py
from django.http import JsonResponse
import json

def fred_json(request):
    with open('fred.json') as f:
        data = json.load(f)
    response = JsonResponse(data)
    response['Access-Control-Allow-Origin'] = '*'
    response['Cache-Control'] = 'max-age=3600'
    return response

urlpatterns = [
    path('.well-known/fred.json', fred_json),
    path('fred.json', fred_json),
    ...
]
```

---

## Ruby on Rails

**Location:** `public/.well-known/fred.json`

Rails serves `public/` as static files with zero config.

```bash
mkdir -p public/.well-known
```

---

## CORS Headers (Required for Browser Agents)

Always ensure your FRED file is served with:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Content-Type: application/json
Cache-Control: max-age=3600
```

---

## Verification

After deploying, verify with curl:

```bash
curl -I https://yourdomain.com/.well-known/fred.json
# Should return: HTTP/2 200, Content-Type: application/json

curl https://yourdomain.com/.well-known/fred.json | node validate.js --stdin
# Should return: VALID
```
