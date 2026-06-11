# 🌸 SoireeWeb — Local Development Guide

> **Run the SoireeWeb website locally in Visual Studio Code**
> No build tools, no Node.js required — just a live server extension.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Method 1 — Live Server Extension (Recommended)](#method-1--live-server-extension-recommended)
- [Method 2 — Live Preview Extension](#method-2--live-preview-extension)
- [Method 3 — Node.js http-server](#method-3--nodejs-http-server)
- [Method 4 — Python Simple Server](#method-4--python-simple-server)
- [Project Structure](#project-structure)
- [Page URLs (Local)](#page-urls-local)
- [Customization Guide](#customization-guide)
- [Before Going Live](#before-going-live)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Visual Studio Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) |
| **Live Server Extension** | Latest | VS Code Marketplace |
| **Internet Connection** | Required | For CDN assets (Tailwind, Fonts, Images) |

> ⚠️ An internet connection is required because the site uses:
> - **Tailwind CSS** via CDN (`cdn.tailwindcss.com`)
> - **Google Fonts** (Playfair Display + Poppins)
> - **Unsplash** placeholder images
> - **Google Maps** embed (contact page)

---

## Method 1 — Live Server Extension (Recommended)

This is the fastest and easiest way. No terminal needed.

### Step 1 — Install Live Server

1. Open **VS Code**
2. Press `Ctrl + Shift + X` (Windows/Linux) or `Cmd + Shift + X` (Mac) to open **Extensions**
3. Search for **"Live Server"** by *Ritwick Dey*
4. Click **Install**

```
Extension ID: ritwickdey.LiveServer
```

### Step 2 — Open the Project Folder

1. In VS Code, go to **File → Open Folder**
2. Navigate to and select your `SoireeWeb` project folder
3. Click **Select Folder**

Your folder structure should look like this in VS Code Explorer:

```
SoireeWeb/
├── 📄 index.html
├── 📄 about.html
├── 📄 services.html
├── 📄 packages.html
├── 📄 portfolio.html
├── 📄 testimonials.html
├── 📄 faq.html
├── 📄 contact.html
├── 📄 sitemap.xml
├── 📄 robots.txt
└── 📁 assets/
    ├── 📁 css/
    │   └── 📄 style.css
    └── 📁 js/
        ├── 📄 main.js
        ├── 📄 gallery.js
        └── 📄 animations.js
```

### Step 3 — Launch Live Server

**Option A — Right-click method:**
1. In the VS Code Explorer, right-click on **`index.html`**
2. Select **"Open with Live Server"**

> ⚠️ **Don't see "Open with Live Server"?** This option only appears after the Live Server extension is installed **and** VS Code has been restarted. If it's missing, use **Option B** or **Option C** below instead.

**Option B — Status bar method:**
1. Click **"Go Live"** button in the bottom-right status bar of VS Code

> ⚠️ **Don't see "Go Live"?** The status bar button can be hidden if the status bar is disabled, the extension didn't activate fully, or your VS Code window is too narrow. Try restarting VS Code first. If it still doesn't appear, skip to **Option C** — it works without the status bar.

**Option C — Command Palette:**
1. Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac)
2. Type `Live Server: Open with Live Server`
3. Press `Enter`

### Step 4 — View the Website

Your browser will automatically open at:

```
http://127.0.0.1:5500/index.html
```

> 🎉 **That's it!** The site is now running locally with **hot reload** — any file you save will instantly refresh the browser.

### Stop Live Server

- Click **"Port: 5500"** in the VS Code status bar, then select **Stop**
- Or press `Ctrl + Shift + P` → `Live Server: Stop Live Server`

---

## Method 2 — Live Preview Extension

An alternative built directly into VS Code (no browser tab switching).

### Step 1 — Install Live Preview

1. Press `Ctrl + Shift + X`
2. Search **"Live Preview"** by *Microsoft*
3. Click **Install**

```
Extension ID: ms-vscode.live-server
```

### Step 2 — Launch Live Preview

1. Open `index.html` in the editor
2. Press `Ctrl + Shift + P`
3. Type **"Live Preview: Show Preview"**
4. Select **"Live Preview: Show Preview (External Browser)"** for full browser experience

**Or use the keyboard shortcut:**
```
Ctrl + Shift + P → Live Preview: Show Preview (External Browser)
```

The site opens at:
```
http://localhost:3000/index.html
```

---

## Method 3 — Node.js http-server

Use this if you prefer working in the terminal or need more control over the port.

### Step 1 — Install Node.js

Download and install from: [nodejs.org](https://nodejs.org) (LTS version recommended)

Verify installation:
```bash
node --version
npm --version
```

### Step 2 — Install http-server globally

```bash
npm install -g http-server
```

### Step 3 — Navigate to the project folder

```bash
# Windows (Command Prompt or PowerShell)
cd C:\path\to\SoireeWeb

# Mac / Linux
cd /path/to/SoireeWeb
```

### Step 4 — Start the server

```bash
http-server -p 5500 -o
```

| Flag | Meaning |
|------|---------|
| `-p 5500` | Use port 5500 |
| `-o` | Auto-open browser |
| `-c-1` | Disable caching (add for development) |

**Full command with cache disabled:**
```bash
http-server -p 5500 -o -c-1
```

The site opens at:
```
http://localhost:5500/index.html
```

### Stop the server
```bash
Ctrl + C
```

---

## Method 4 — Python Simple Server

If you have Python installed, no additional packages needed.

### Check Python version

```bash
python --version
# or
python3 --version
```

### Start the server

**Python 3 (recommended):**
```bash
# Navigate to project folder first
cd /path/to/SoireeWeb

# Start server on port 5500
python -m http.server 5500
```

**Python 2 (legacy):**
```bash
python -m SimpleHTTPServer 5500
```

Then open your browser and go to:
```
http://localhost:5500/index.html
```

### Stop the server
```bash
Ctrl + C
```

---

## Project Structure

```
SoireeWeb/
│
├── 📄 index.html           ← Home Page (start here)
├── 📄 about.html           ← About & Team
├── 📄 services.html        ← Services Detail
├── 📄 packages.html        ← Pricing Packages
├── 📄 portfolio.html       ← Masonry Gallery + Lightbox
├── 📄 testimonials.html    ← Client Reviews
├── 📄 faq.html             ← FAQ Accordion + Search
├── 📄 contact.html         ← Contact Form + Map
│
├── 📄 sitemap.xml          ← SEO Sitemap
├── 📄 robots.txt           ← Crawler Directives
│
└── 📁 assets/
    ├── 📁 css/
    │   └── 📄 style.css    ← Custom styles, animations, components
    └── 📁 js/
        ├── 📄 main.js      ← Navigation, scroll, mobile menu
        ├── 📄 gallery.js   ← Lightbox, masonry filter, swipe
        └── 📄 animations.js← Scroll animations, carousel, FAQ, form
```

---

## Page URLs (Local)

When running via Live Server on port `5500`:

| Page | Local URL |
|------|-----------|
| 🏠 Home | `http://127.0.0.1:5500/index.html` |
| 👥 About | `http://127.0.0.1:5500/about.html` |
| 🛎️ Services | `http://127.0.0.1:5500/services.html` |
| 💎 Packages | `http://127.0.0.1:5500/packages.html` |
| 📸 Portfolio | `http://127.0.0.1:5500/portfolio.html` |
| ⭐ Testimonials | `http://127.0.0.1:5500/testimonials.html` |
| ❓ FAQ | `http://127.0.0.1:5500/faq.html` |
| 📬 Contact | `http://127.0.0.1:5500/contact.html` |

> 💡 **Tip:** After opening `index.html`, all navigation links work normally between pages — no need to manually type each URL.

---

## Customization Guide

### 🎨 Change Brand Colors

Open `assets/css/style.css` and edit the CSS variables at the top:

```css
:root {
  --color-gold:       #C9A84C;  /* ← Primary gold accent */
  --color-rose:       #D4849A;  /* ← Rose/pink accent */
  --color-sage:       #8FAF8F;  /* ← Sage green accent */
  --color-champagne:  #F7E7CE;  /* ← Light background tint */
  --color-dark:       #2C2C2C;  /* ← Primary text color */
}
```

Also update the Tailwind config in each HTML file's `<script>` block:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',      // ← Change this
        rose: '#D4849A',      // ← Change this
        // ...
      }
    }
  }
}
```

### 🔤 Change Fonts

In `assets/css/style.css`, update the Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=YOUR+HEADING+FONT&family=YOUR+BODY+FONT&display=swap');
```

Then update the font variables:

```css
:root {
  --font-heading: 'Your Heading Font', serif;
  --font-body:    'Your Body Font', sans-serif;
}
```

### 🖼️ Replace Placeholder Images

All images currently use **Unsplash** URLs. To use real wedding photos:

1. Create an `assets/images/` folder
2. Add your photos (use WebP format for best performance)
3. Replace Unsplash URLs in HTML files, for example:

```html
<!-- Before (Unsplash placeholder) -->
<img src="https://images.unsplash.com/photo-xxx?w=800" alt="..." />

<!-- After (your real photo) -->
<img src="assets/images/wedding-sofia-miguel.webp" alt="Sofia and Miguel's wedding" />
```

### 📝 Update Business Information

Search and replace these placeholder values across all HTML files:

| Placeholder | Replace With |
|------------|-------------|
| `SoireeWeb` | Your business name |
| `hello@soireeweb.com` | Your email address |
| `+63 917 555 0123` | Your phone number |
| `123 Elegance Avenue, BGC` | Your office address |
| `Taguig, Metro Manila 1634` | Your city/postal code |
| `https://www.soireeweb.com` | Your actual domain |
| `soireeweb` | Your social media handle |

### 📬 Activate the Contact Form (Formspree)

1. Go to **[formspree.io](https://formspree.io)** → Sign up free
2. Click **"+ New Form"** → Name it "SoireeWeb Contact"
3. Copy the Form ID (looks like `xpzgkwvj`)
4. Open `contact.html` and find:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

5. Replace `YOUR_FORM_ID` with your actual Form ID:

```html
action="https://formspree.io/f/xpzgkwvj"
```

> ⚠️ **Note:** Formspree form submissions won't work on `localhost` — this is expected. The form will work correctly once deployed to your live domain.

### 📊 Activate Google Analytics

1. Go to **[analytics.google.com](https://analytics.google.com)**
2. Create a new **GA4 Property** for your website
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. In **all 8 HTML files**, find and replace:

```javascript
gtag('config', 'G-XXXXXXXXXX');
```

With your real ID:

```javascript
gtag('config', 'G-A1B2C3D4E5');
```

**Quick find & replace in VS Code:**
- Press `Ctrl + Shift + H` (Windows) or `Cmd + Shift + H` (Mac)
- Find: `G-XXXXXXXXXX`
- Replace: `G-YOUR_REAL_ID`
- Click **Replace All**

### 🗺️ Update Google Maps Embed

1. Go to **[google.com/maps](https://www.google.com/maps)**
2. Search for your business address
3. Click **Share → Embed a map → Copy HTML**
4. In `contact.html`, replace the entire `<iframe>` inside `.map-container`

---

## Before Going Live

Complete this checklist before uploading to Namecheap:

### Content
- [ ] Replace all placeholder business information (name, address, phone, email)
- [ ] Replace all Unsplash placeholder images with real wedding photos
- [ ] Update team member names, photos, and bios in `about.html`
- [ ] Update testimonials with real client reviews in `testimonials.html`
- [ ] Update portfolio gallery with real wedding photos in `portfolio.html`
- [ ] Review and update all package descriptions in `packages.html`

### Technical
- [ ] Set up Formspree account and replace `YOUR_FORM_ID` in `contact.html`
- [ ] Create GA4 property and replace `G-XXXXXXXXXX` in all 8 HTML files
- [ ] Update Google Maps embed in `contact.html` with your real address
- [ ] Update all `https://www.soireeweb.com` URLs in `sitemap.xml`
- [ ] Update social media links in footer of all pages
- [ ] Update canonical URLs in `<head>` of all pages

### SEO
- [ ] Customize `<meta name="description">` for each page
- [ ] Update structured data in `index.html` with real business details
- [ ] Upload an `og-image.jpg` (1200×630px) to `assets/images/`
- [ ] Update Open Graph image URLs in all pages

### Performance (Optional but Recommended)
- [ ] Convert all images to **WebP** format
- [ ] Compress images to under 200KB each
- [ ] Test on mobile devices (Chrome DevTools → Toggle Device Toolbar)

---

## Troubleshooting

### ❌ Page is blank / CSS not loading

**Cause:** Opening `index.html` directly by double-clicking (file:// protocol)

**Fix:** Always use Live Server. The `file://` protocol blocks some browser security features. Make sure you see `http://127.0.0.1:5500` in the browser address bar, **not** `file:///`.

---

### ❌ Fonts not loading (fallback fonts showing)

**Cause:** No internet connection or Google Fonts blocked

**Fix:** Ensure you have an active internet connection. The site loads Playfair Display and Poppins from Google Fonts CDN.

---

### ❌ Images not showing

**Cause:** Unsplash images require internet connection

**Fix:** Connect to the internet. If you've replaced images with local files, check that the file paths are correct and the image files exist in `assets/images/`.

---

### ❌ Lightbox not opening on Portfolio page

**Cause:** JavaScript file not loading correctly

**Fix:**
1. Open browser DevTools (`F12`)
2. Check the **Console** tab for errors
3. Check the **Network** tab to confirm `gallery.js` loaded (status 200)
4. Ensure you're using Live Server, not opening the file directly

---

### ❌ Contact form not submitting

**Cause:** Formspree doesn't allow submissions from `localhost`

**Fix:** This is normal behavior during local development. The form will work correctly on your live domain after deployment. To test locally, you can temporarily use [Formspree's test mode](https://help.formspree.io/hc/en-us/articles/360013470814).

---

### ❌ "Go Live" button not visible in VS Code

**Cause:** Live Server extension not installed or not activated

**Fix:**
1. Press `Ctrl + Shift + X`
2. Search "Live Server"
3. Install the extension by Ritwick Dey
4. Restart VS Code
5. The "Go Live" button should appear in the bottom status bar

---

### ❌ Port 5500 already in use

**Fix:** Change the Live Server port:
1. Go to **File → Preferences → Settings**
2. Search for `liveServer.settings.port`
3. Change `5500` to another port like `5501` or `8080`

Or use the terminal method with a different port:
```bash
http-server -p 8080 -o
```

---

### ❌ Animations not triggering on scroll

**Cause:** `animations.js` not loaded or IntersectionObserver not supported

**Fix:**
1. Check DevTools Console for errors
2. Confirm `animations.js` is linked at the bottom of each HTML page
3. Try scrolling down slowly — animations trigger when elements enter the viewport

---

## 💡 VS Code Tips for This Project

### Recommended Extensions

| Extension | Purpose |
|-----------|---------|
| **Live Server** — Ritwick Dey | Run site locally with hot reload |
| **Prettier** — Prettier | Format HTML/CSS/JS code |
| **HTML CSS Support** — ecmel | CSS class autocomplete in HTML |
| **Auto Rename Tag** — Jun Han | Rename opening/closing HTML tags together |
| **Tailwind CSS IntelliSense** — Tailwind Labs | Tailwind class autocomplete |
| **Color Highlight** — Naumovs | Preview color values in CSS |
| **GitLens** | Track code changes |

### Useful VS Code Shortcuts

| Shortcut (Windows) | Shortcut (Mac) | Action |
|-------------------|---------------|--------|
| `Ctrl + Shift + H` | `Cmd + Shift + H` | Find & Replace across all files |
| `Ctrl + Shift + F` | `Cmd + Shift + F` | Search across all files |
| `Alt + Shift + F` | `Option + Shift + F` | Format document (Prettier) |
| `Ctrl + /` | `Cmd + /` | Toggle line comment |
| `Ctrl + P` | `Cmd + P` | Quick file open |
| `F12` | `F12` | Open browser DevTools |

### Multi-file Find & Replace

To update business info across all files at once:

1. Press `Ctrl + Shift + H` (Windows) or `Cmd + Shift + H` (Mac)
2. Make sure **"Search across files"** is enabled
3. Enter your search and replacement text
4. Click **Replace All**

---

## 📞 Support

If you encounter issues not covered here:

- **Email:** hello@soireeweb.com
- **Website:** [www.soireeweb.com](https://www.soireeweb.com)
- **VS Code Docs:** [code.visualstudio.com/docs](https://code.visualstudio.com/docs)
- **Live Server Docs:** [github.com/ritwickdey/vscode-live-server](https://github.com/ritwickdey/vscode-live-server)

---

*SoireeWeb — Where Love Becomes Legend* 🌸

> **Built with:** HTML5 · Tailwind CSS · Vanilla JavaScript · Formspree · Google Analytics 4
> **Hosting:** Namecheap Shared Hosting
> **Philippines 🇵🇭**