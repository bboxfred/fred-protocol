# How to Add FRED Protocol to Your Website

This guide is for non-technical website owners. No coding required.

Pick your platform below and follow the steps. Takes 5 minutes.

---

## Step 1: Create your fred.json file

Go to this link and fill in your details:

> **[hungryhuman.co/fredprotocol/generate](https://hungryhuman.co/fredprotocol/generate)** *(coming soon)*

Or copy this template and fill in the blanks:

```json
{
  "fred": "0.1",
  "identity": {
    "name": "YOUR BUSINESS NAME",
    "type": "organization",
    "description": "ONE SENTENCE ABOUT WHAT YOU DO",
    "url": "https://YOURWEBSITE.com"
  }
}
```

Save it as a file named exactly: `fred.json`

---

## Step 2: Upload it

Find your platform below.

---

### Squarespace

1. Go to your Squarespace dashboard
2. Click **Settings** → **Advanced** → **Code Injection**
3. You can't upload files directly — do this instead:
   - Go to [gist.github.com](https://gist.github.com)
   - Create a new public gist, paste your `fred.json` content
   - Click "Create public gist"
   - Copy the **Raw** URL (looks like `https://gist.githubusercontent.com/...`)
4. Back in Squarespace: **Settings** → **Advanced** → **URL Mappings**
5. Add this line (replace with your raw URL):
   ```
   /fred.json -> https://gist.githubusercontent.com/YOUR_RAW_URL 301
   ```
6. Click Save

---

### Webflow

1. Go to your Webflow project
2. Click **Assets** (the image icon in the left panel)
3. Upload your `fred.json` file
4. Click **Publish**
5. Your file is now at `https://yoursite.webflow.io/fred.json`

To use your custom domain, go to **Project Settings** → **Publishing** and make sure your custom domain is connected.

---

### WordPress

1. Log into your WordPress admin (`yoursite.com/wp-admin`)
2. Install the free plugin **"WP File Manager"** (Plugins → Add New → search "WP File Manager")
3. Go to **WP File Manager** in your menu
4. Navigate to `public_html/`
5. Create a folder called `.well-known` (click New Folder)
6. Upload `fred.json` into that folder
7. Done — your file is at `yoursite.com/.well-known/fred.json`

---

### Wix

1. Go to your Wix dashboard
2. Click **Add Apps** → search for **"Wix File Share"** or use **Wix Media**
3. Upload `fred.json` to your media
4. Go to **Site** → **Add Elements** → **Embed** → **Custom Code**
5. Add this redirect in your site's custom `<head>` code:

Actually — Wix doesn't support custom file routing easily.

**Easiest workaround:**
1. Upload `fred.json` to [GitHub Gist](https://gist.github.com) (free, no account needed beyond GitHub)
2. Get the Raw URL
3. Email your Wix support or use a Velo (Wix's code editor) route:

```javascript
// In Wix's Velo editor (Site → Dev Mode)
import {ok, created} from 'wix-http-functions';
import wixData from 'wix-data';

export function get_fred(request) {
  return ok({
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      "fred": "0.1",
      "identity": {
        "name": "Your Name",
        "type": "organization",
        "description": "What you do",
        "url": "https://yoursite.com"
      }
    })
  });
}
```

---

### Shopify

Shopify doesn't allow custom file routes. Use this workaround:

1. Go to **Online Store** → **Themes** → **Edit Code**
2. Under **Templates**, click **Add a new template**
3. Choose **page**, name it `fred`
4. Replace the content with just: `{{ page.content }}`
5. Go to **Pages** → **Add page**
6. Title: `FRED Protocol`
7. Handle: set to `fred-json`
8. In content: paste your fred.json

Your file will be at: `yourstore.com/pages/fred-json`

*Note: This isn't at the standard `.well-known/fred.json` path, but it's accessible. A proper setup requires a Shopify app.*

---

### GitHub Pages

1. Open your repository on GitHub
2. Click **Add file** → **Create new file**
3. In the filename box, type exactly: `.well-known/fred.json`
   - GitHub will automatically create the folder
4. Paste your `fred.json` content into the editor
5. Click **Commit changes**
6. Wait 1-2 minutes for GitHub Pages to rebuild

Your file is now at: `yourusername.github.io/.well-known/fred.json`

---

### Vercel (with a project)

If you have a Next.js, Vite, or any other project on Vercel:

1. In your project folder, create: `public/.well-known/fred.json`
2. Paste your content
3. `git add . && git commit -m "Add FRED Protocol" && git push`
4. Vercel deploys automatically

---

### Netlify (drag-and-drop)

1. Create this folder structure on your computer:
   ```
   my-site/
   ├── index.html      (your existing site files)
   └── .well-known/
       └── fred.json   (paste your content here)
   ```
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag your entire `my-site/` folder onto the deploy area
4. Done in 30 seconds

---

## Step 3: Verify it works

Open your browser and go to:

```
https://YOURWEBSITE.com/.well-known/fred.json
```

If you see your JSON content — you're done. ✓

If you see a 404 error — try:
```
https://YOURWEBSITE.com/fred.json
```

---

## That's it

Your website is now on the FRED Protocol. AI agents can discover who you are, what you do, and how to interact with you.

---

**Need help?** Open an issue at [github.com/bboxfred/fred-protocol](https://github.com/bboxfred/fred-protocol)
