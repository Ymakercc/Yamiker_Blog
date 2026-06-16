# Yamiekr_Home

Personal homepage and blog built with Next.js 15, TypeScript, and Tailwind CSS. Supports Chinese/English language switching without any external services.

**Live site:** [yamiker.cloud](https://yamiker.cloud)

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **i18n:** Built-in React context (no third-party services)
- **Hosting:** Vercel

## Local development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev
```

## Build

```bash
# Type-check and lint
npm run lint

# Production build
npm run build

# Start production server locally
npm start
```

## Deploy to Vercel

### Option A — Vercel CLI

```bash
# Install Vercel CLI (one-time, project-local)
npx vercel

# Follow the prompts to link/create a Vercel project.
# Subsequent deploys:
npx vercel --prod
```

### Option B — GitHub integration (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no extra configuration needed.
4. Every push to `main` triggers a production deploy automatically.

### Environment variables

No environment variables are required for the base site. If you add features that need secrets (e.g. email API keys), add them in **Vercel → Project → Settings → Environment Variables**.

## Custom domain — yamiker.cloud

### 1. Add domain in Vercel

1. In your Vercel project go to **Settings → Domains**.
2. Add `yamiker.cloud` and `www.yamiker.cloud`.
3. Vercel will show you the DNS records to create.

### 2. Configure DNS at your registrar

Create the following records (values shown are Vercel's standard records — confirm in the Vercel dashboard):

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | `76.76.21.21`            | 3600 |
| CNAME | www  | `cname.vercel-dns.com`   | 3600 |

> If your registrar supports **ALIAS / ANAME** records, you can use `cname.vercel-dns.com` for the root (`@`) instead of the A record — this is more portable.

### 3. Propagation

DNS changes typically propagate within a few minutes to an hour. Vercel will automatically provision a TLS certificate once the domain resolves correctly.

### 4. Verify

```bash
dig yamiker.cloud A
dig www.yamiker.cloud CNAME
```

Both should point to Vercel's infrastructure after propagation.

## Project structure

```
src/
  app/
    layout.tsx       # Root layout, metadata, SEO
    page.tsx         # Landing page
    opengraph-image.tsx # Dynamic Open Graph image
    globals.css      # Tailwind base styles
  components/
    Navbar.tsx       # Sticky nav with language toggle
    Hero.tsx         # Full-screen hero section
    About.tsx        # About + skills
    BlogPreview.tsx  # Latest posts preview
    Projects.tsx     # Project showcase
    Contact.tsx      # Contact links
    Footer.tsx       # Footer
  contexts/
    LanguageContext.tsx  # zh/en state + toggle
  lib/
    translations.ts  # All UI strings in zh and en
```

## Language switching

Translations live entirely in `src/lib/translations.ts`. To add a new language:

1. Add a new key (`"fr"`, `"ja"`, etc.) alongside `"zh"` and `"en"`.
2. Update the `Lang` type.
3. Add a new toggle step in `LanguageContext.tsx`.

No build-time route generation or external i18n library is required.
