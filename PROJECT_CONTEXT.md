# PROJECT_CONTEXT.md
## Fagan Restaurant Template — Complete Developer Reference

> This document provides full project context for any developer joining this codebase.
> Reading this file should eliminate the need to read every source file individually.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Theme System](#3-theme-system)
4. [Content System](#4-content-system)
5. [Animation System](#5-animation-system)
6. [SEO System](#6-seo-system)
7. [Reusability Strategy](#7-reusability-strategy)
8. [Known Issues](#8-known-issues)
9. [Future Roadmap](#9-future-roadmap)
10. [Developer Handover Notes](#10-developer-handover-notes)

---

## 1. Project Overview

### Purpose

This is a **commercial restaurant website template** designed to be sold repeatedly to different restaurant businesses. It is not built for a single client — every piece of business-specific content is externalized into JSON configuration files so a new client can be onboarded by editing files only, with zero code changes.

### Business Goals

| Goal | Implementation |
|------|---------------|
| Look premium and build trust | Cinematic dark design, Framer Motion animations, luxury typography |
| Increase table reservations | Multiple CTAs throughout, floating action panel, WhatsApp deep links |
| Showcase menu items | Full categorized menu section with food cards, badges, dietary labels |
| Showcase catering packages | Dedicated packages section with rotating word animation and inquiry buttons |
| Showcase facilities | Facility cards with capacity and feature lists |
| Increase WhatsApp inquiries | Every CTA generates a WhatsApp deep link from a single phone number config |
| Fast client deployment | All content in 5 JSON files — new client live in under 15 minutes |

### Target Customers

- **Template buyers**: Freelance web developers and agencies who purchase the template and resell deployments to restaurant clients
- **End clients**: Indonesian restaurant businesses (and adaptable to any cuisine) ranging from casual dining to fine dining, catering companies, and event venues
- **Scale**: Single-location restaurants, multi-facility venues, catering-focused businesses

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 15.3.3 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4 |
| Animation | Framer Motion | ^11.15 |
| Smooth Scroll | @studio-freight/lenis | ^1.0.42 |
| Icons | Lucide React | ^0.469 |
| Scroll Triggers | react-intersection-observer | ^9.13 |
| Utilities | clsx + tailwind-merge | — |

> ⚠️ **Known:** `@studio-freight/lenis` is deprecated. Successor package is `lenis` by darkroomengineering. Migrate when convenient.

---

## 2. Architecture Overview

### Folder Structure

```
fagan-restaurant-template/
│
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx                # Root layout: fonts, theme CSS vars, SEO metadata, JSON-LD
│   ├── page.tsx                  # Home page: composes all sections in order
│   └── globals.css               # Tailwind directives + global CSS utilities + component classes
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Fixed header, scroll detection, mobile menu
│   │   ├── Footer.tsx            # Footer grid: brand, contact, hours, social
│   │   └── FloatingActions.tsx   # Persistent CTA panel (WhatsApp/Reserve/Call)
│   │
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx  # Lenis smooth scroll initialization
│   │
│   └── sections/                 # One file per page section, in render order
│       ├── HeroSection.tsx           # Full-viewport hero with parallax
│       ├── SignatureDishSection.tsx  # Featured dish spotlight
│       ├── AboutSection.tsx          # Restaurant story + stats
│       ├── MenuSection.tsx           # Tabbed menu with food cards
│       ├── PackagesSection.tsx       # Catering packages + rotating word
│       ├── FacilitiesSection.tsx     # Venue facilities grid
│       ├── GallerySection.tsx        # Masonry gallery + lightbox
│       ├── TestimonialsSection.tsx   # Auto-advancing review carousel
│       ├── LocationSection.tsx       # Map + contact + hours
│       └── CtaSection.tsx            # Final conversion section
│
├── lib/
│   ├── config.ts                 # Imports all JSON, exports data + utility functions
│   ├── themes.ts                 # Theme definitions as CSS variable maps
│   └── utils.ts                  # cn(), ease constants, Framer Motion variant presets
│
├── content/                      # ← CLIENT EDITS ONLY THESE FILES
│   ├── restaurant.json           # Core business info, hero, about, facilities, SEO
│   ├── menu.json                 # Menu categories + all menu items
│   ├── packages.json             # Catering packages + rotating words
│   ├── gallery.json              # Gallery images + categories
│   └── testimonials.json         # Customer reviews + rating stats
│
├── types/                        # (Recommended: not yet created — see Known Issues)
│   └── content.ts                # TypeScript interfaces for all content schemas
│
├── public/
│   └── images/                   # Local image assets (optional — template uses Unsplash URLs)
│
├── next.config.ts                # Image domains whitelist (Unsplash)
├── tailwind.config.ts            # Theme token extensions + font variables
├── tsconfig.json                 # TypeScript config with @/* path alias
├── package.json
├── CUSTOMIZATION_GUIDE.md
├── DEPLOYMENT_GUIDE.md
└── PROJECT_CONTEXT.md            # ← This file
```

### Component Hierarchy

```
app/layout.tsx  (Server Component)
└── SmoothScrollProvider  (Client — Lenis)
    └── app/page.tsx  (Server Component)
        ├── Navbar  (Client — scroll state, mobile menu)
        ├── main#main-content
        │   ├── HeroSection  (Client — useScroll parallax)
        │   ├── SignatureDishSection  (Client — useInView)
        │   ├── AboutSection  (Client — useInView)
        │   ├── MenuSection  (Client — category state)
        │   ├── PackagesSection  (Client — rotating word interval)
        │   ├── FacilitiesSection  (Client — useInView)
        │   ├── GallerySection  (Client — filter state, lightbox)
        │   ├── TestimonialsSection  (Client — carousel interval)
        │   ├── LocationSection  (Client — useInView)
        │   └── CtaSection  (Client — useInView)
        ├── Footer  (Server Component)
        └── FloatingActions  (Client — scroll visibility)
```

> All section components are `'use client'` because they use Framer Motion, `useInView`, or interactive state. `Footer` and `page.tsx` are server components.

### Data Flow

```
content/*.json
      │
      ▼
lib/config.ts  (imports JSON, exports named constants + utility functions)
      │
      ├──► app/layout.tsx     (theme CSS vars → <html style>, SEO metadata, JSON-LD)
      │
      └──► components/**      (each component imports only what it needs)
                │
                ▼
           Rendered HTML (static — no API calls, no database)
```

**Key principle:** Data flows one way. Content JSON → lib/config.ts → components. No component imports JSON directly. All data access is through `lib/config.ts` exports.

---

## 3. Theme System

### How Themes Work

The theme system uses **CSS custom properties (variables)** injected at the `<html>` element level. Every color in the UI references a CSS variable (e.g. `var(--color-accent)`) rather than a hardcoded hex. Changing the theme changes all variables simultaneously.

**Theme selection:** Set `"theme"` in `content/restaurant.json`:
```json
{
  "theme": "steakhouse"
}
```

**Supported themes:**

| Theme | Accent Color | Mood |
|-------|-------------|------|
| `steakhouse` | Warm amber/gold `#c8963c` | Masculine, bold, fire |
| `seafood` | Ocean cyan `#06b6d4` | Fresh, coastal, bright |
| `coffee` | Rich sienna `#a0522d` | Warm, rustic, artisanal |
| `bakery` | Golden wheat `#d4921c` | Bright, approachable, sweet |

### CSS Variable Map

Each theme defines 16 CSS variables:

```
--color-brand-50 through --color-brand-900  (full palette, 10 steps)
--color-accent          (primary interactive color)
--color-accent-light    (hover state of accent)
--color-accent-dark     (pressed/muted variant)
--color-surface         (page background, darkest)
--color-surface-elevated (card backgrounds)
--color-surface-overlay  (modal/overlay backgrounds)
```

### How Variables Are Applied

`app/layout.tsx` reads the theme at build time and injects variables as an inline style on `<html>`:

```tsx
// lib/themes.ts → cssVars object
// app/layout.tsx
<html
  style={Object.fromEntries(
    Object.entries(themeVars).map(([k, v]) => [k, v])
  ) as React.CSSProperties}
>
```

Because this is a Server Component, the variables are present in the initial HTML — no flash of unstyled content.

Tailwind uses these variables via `tailwind.config.ts`:
```ts
colors: {
  brand: { 500: 'var(--color-brand-500)', ... },
  accent: { DEFAULT: 'var(--color-accent)', ... },
}
```

### How to Add a New Theme

1. Open `lib/themes.ts`
2. Add the theme name to the `ThemeName` union type:
   ```ts
   export type ThemeName = 'steakhouse' | 'seafood' | 'coffee' | 'bakery' | 'japanese'
   ```
3. Add the theme object to the `themes` record:
   ```ts
   japanese: {
     name: 'japanese',
     label: 'Japanese',
     cssVars: {
       '--color-accent': '#c0392b',
       '--color-surface': '#0a0808',
       // ... all 16 variables required
     },
   },
   ```
4. Set `"theme": "japanese"` in `content/restaurant.json`
5. Rebuild — done.

> All 16 variables must be defined. Missing variables cause silent fallback to the `:root` defaults (steakhouse colors).

---

## 4. Content System

All client-editable content lives in `/content/*.json`. **No component file should be edited to change business content.**

---

### `content/restaurant.json`

The master configuration file. Controls almost everything.

**Top-level structure:**
```json
{
  "name": "Restaurant Name",
  "tagline": "Tagline displayed in navbar/hero",
  "description": "Long description (used in SEO)",
  "shortDescription": "1-line description (used in footer)",
  "theme": "steakhouse",
  "logo": { "text": "Primary", "subtext": "SECONDARY", "image": null },
  "hero": { ... },
  "signatureDish": { ... },
  "about": { ... },
  "facilities": [ ... ],
  "location": { ... },
  "seo": { ... }
}
```

**`hero` block:** Controls the hero section background image, headline text, and subheadline.

**`signatureDish` block:** Controls the featured dish section. Set `"enabled": false` to hide the entire section.

**`about` block:** Story text, mission text, value propositions (with icon names), stats grid, and image URL.

**`facilities` array:** Each object renders one facility card. Fields: `id`, `name`, `description`, `capacity`, `icon` (maps to Lucide icon — see `FacilitiesSection.tsx`'s `iconMap`), `image`, `features[]`.

**`location` block:** Address, city, country, Google Maps embed URL, phone, WhatsApp number, email, opening hours array, social media links.

> ⚠️ **Critical:** `whatsapp` must be in E.164 format (`+62812...`). All WhatsApp deep links are generated from this single field.

**`seo` block:** `title`, `description`, `keywords`, `ogImage` URL. These populate `<title>`, meta description, OG tags, and Twitter cards.

---

### `content/menu.json`

Controls the Menu section.

**Structure:**
```json
{
  "categories": [
    { "id": "signature", "name": "Signature", "description": "..." }
  ],
  "items": [
    {
      "id": "1",
      "categoryId": "signature",
      "name": "Dish Name",
      "description": "...",
      "price": 285000,
      "image": "https://...",
      "badge": "Best Seller",
      "isSpicy": true,
      "isHalal": true,
      "isVegetarian": false
    }
  ]
}
```

- `categoryId` must match an `id` in the `categories` array
- `price` is a number in the local currency (IDR). Formatted by `formatPrice()` in `lib/config.ts` using `Intl.NumberFormat('id-ID', { currency: 'IDR' })`
- `badge` is optional — set to `null` to suppress the badge chip
- `isSpicy` renders a flame icon overlay on the card image
- `isHalal` / `isVegetarian` render small label badges below the price

**Adding a category:** Add to `categories[]`. The tab nav auto-populates.
**Adding an item:** Add to `items[]` with a matching `categoryId`.

---

### `content/packages.json`

Controls the Packages/Catering section.

**Structure:**
```json
{
  "rotatingWords": ["Prasmanan", "Set Menu", "Coffee Break", ...],
  "heading": "We Provide",
  "subheading": "...",
  "packages": [ ... ],
  "cta": { ... }
}
```

- `rotatingWords`: The animated words that rotate below "We Provide". Add or remove words freely — the animation adapts automatically.
- Each `package` object: `id`, `name`, `subtitle`, `description`, `priceFrom` (number), `priceUnit` (string), `minGuests`, `image`, `highlight` (boolean — makes this card stand out with an accent ring), `badge` (optional chip), `features[]` (only first 4 shown), `includes[]`.
- `highlight: true` on one package styles it as the "Most Popular" featured card.
- Each package's inquiry button generates a WhatsApp message pre-filled with the package name.

---

### `content/gallery.json`

Controls the Gallery section.

**Structure:**
```json
{
  "heading": "A Feast for the Eyes",
  "subheading": "...",
  "items": [
    {
      "id": "1",
      "image": "https://...",
      "alt": "Descriptive alt text",
      "category": "food",
      "span": "large"
    }
  ],
  "categories": [
    { "id": "all", "name": "All" },
    { "id": "food", "name": "Food" }
  ]
}
```

- `span`: Controls aspect ratio in the masonry grid. Values: `"large"` (3:2), `"medium"` (4:3), `"small"` (1:1 square).
- `category` must match an `id` in the `categories` array.
- The lightbox loads a higher-resolution version of the image using string replacement (`w=600` → `w=1200`). If using non-Unsplash images, ensure the URL pattern is compatible or add a `highResImage` field.
- Always include the `"all"` category — it shows all items and is the default filter.

---

### `content/testimonials.json`

Controls the Testimonials carousel.

**Structure:**
```json
{
  "heading": "What Our Guests Say",
  "subheading": "...",
  "items": [
    {
      "id": "1",
      "name": "Reviewer Name",
      "role": "Food Blogger",
      "avatar": "https://...",
      "rating": 5,
      "review": "Full review text...",
      "date": "2 weeks ago",
      "platform": "Google",
      "verified": true
    }
  ],
  "stats": {
    "rating": "4.9",
    "totalReviews": "2,847",
    "platform": "Google Reviews"
  }
}
```

- `rating` must be 1–5 (integer). Renders filled star icons.
- `verified: true` shows a blue checkmark badge.
- `stats` block is displayed as a single rating badge above the carousel.
- The carousel auto-advances every 5 seconds and supports manual prev/next navigation and dot pagination.

---

## 5. Animation System

### Framer Motion Architecture

Animations are built on three patterns:

**Pattern 1 — Stagger container + fadeUp variants (most common)**
```tsx
// lib/utils.ts exports these presets
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: ease.luxury, delay },
  }),
}

// Usage in a section:
<motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}>
  <motion.h2 variants={fadeUp} custom={0}>Heading</motion.h2>
  <motion.p variants={fadeUp} custom={0.1}>Subheading</motion.p>
</motion.div>
```

**Pattern 2 — Inline animate (for image/card reveals)**
```tsx
<motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={inView ? { opacity: 1, x: 0 } : {}}
  transition={{ duration: 1, ease: ease.luxury }}
/>
```

**Pattern 3 — Scroll-linked parallax (HeroSection only)**
```tsx
const { scrollYProgress } = useScroll({ target: ref })
const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
```

### Easing Constants (`lib/utils.ts`)

```ts
export const ease = {
  luxury:    [0.25, 0.46, 0.45, 0.94],  // smooth deceleration — most elements
  cinematic: [0.77, 0, 0.175, 1],        // sharp in, slow out — headlines
  smooth:    [0.43, 0.13, 0.23, 0.96],   // balanced — transitions
}
```

> ⚠️ Several components inline `[0.25, 0.46, 0.45, 0.94]` as a literal instead of using `ease.luxury`. This is a known inconsistency — see Known Issues.

### Lenis Smooth Scroll Integration

Lenis is initialized in `SmoothScrollProvider` (a Client Component wrapping the entire app):

```ts
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
})

// Driven by requestAnimationFrame loop
function raf(time: number) {
  lenis.raf(time)
  rafId = requestAnimationFrame(raf)
}
```

> ⚠️ **Critical known issue:** Framer Motion's `useScroll` reads native browser `scrollY`, not Lenis's virtual scroll position. The hero parallax (`HeroSection.tsx`) runs against native scroll and will feel disconnected from the Lenis-driven visual scroll. Fix by subscribing to the Lenis scroll event and driving a `MotionValue` manually. See Known Issues §8.

### Scroll-Triggered Animations

All sections except the Hero use `useInView` from `react-intersection-observer`:

```tsx
const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
```

- `threshold: 0.1` — animation triggers when 10% of the element is visible
- `triggerOnce: true` — animation only plays once (does not replay on scroll-up)
- The `ref` is attached to the motion container, `inView` controls the `animate` prop

### Performance Considerations

- All `useInView` hooks use `triggerOnce: true` to avoid re-running animations
- `Next/Image` handles lazy loading, WebP/AVIF conversion, and responsive sizing
- `priority` is set only on the hero image (LCP element)
- Framer Motion's `AnimatePresence` with `mode="wait"` ensures old content fades before new content appears (menu tabs, gallery filter)
- The `noise-texture` pseudo-element uses an inline SVG with `feTurbulence` — this can cause repaints on some browsers. Consider a static PNG for production optimization.

---

## 6. SEO System

### Metadata (`app/layout.tsx`)

Next.js 15 `Metadata` API is used for all meta tags. All values are dynamic from `content/restaurant.json`:

```ts
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630 }],
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: { index: true, follow: true },
}
```

### Open Graph

OG tags are generated from the `seo` block in `restaurant.json`. The `ogImage` URL should be a 1200×630px image. Update `seo.ogImage` per client.

> ⚠️ Known gap: `og:url` is not set. Add `url: restaurant.seo.siteUrl` to the `openGraph` block once `siteUrl` is added to `restaurant.json`.

### JSON-LD Structured Data

Schema.org `Restaurant` type is injected as a `<script type="application/ld+json">` in `<head>` via `dangerouslySetInnerHTML`:

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "...",
  "description": "...",
  "address": { "@type": "PostalAddress", ... },
  "telephone": "...",
  "openingHoursSpecification": [ ... ]
}
```

**Known issues with current JSON-LD:**
- `servesCuisine` is hardcoded as `"Indonesian"` — must be config-driven
- `priceRange` is hardcoded as `"$$"` — must be config-driven
- `url` is an empty string `""` — must be config-driven
- `openingHoursSpecification.dayOfWeek` uses natural language strings instead of `https://schema.org/Monday` URLs — will fail Google Rich Results validation

See Known Issues for full details and fix recommendations.

---

## 7. Reusability Strategy

### The Core Principle

**No business-specific content should exist in `.tsx` files.** All of the following must come from `content/*.json`:
- Restaurant name, tagline, description
- All menu items, categories, prices
- All catering packages
- All gallery images
- All testimonials
- Address, phone, WhatsApp, hours, social media
- Hero text and images
- About/story text
- Facilities list
- SEO title, description, og:image

### Deploying a New Client in 15 Minutes

**Step 1 — Clone the repo (2 min)**
```bash
git clone https://github.com/your-account/fagan-restaurant-template.git client-restaurant-name
cd client-restaurant-name
npm install
```

**Step 2 — Edit content files (8 min)**

Edit these 5 files with client information:
```
content/restaurant.json   ← name, tagline, theme, hero, about, facilities, contact, SEO
content/menu.json         ← all menu items and categories
content/packages.json     ← catering packages (or leave as-is)
content/gallery.json      ← replace image URLs with client photos
content/testimonials.json ← add real client reviews
```

Minimum required changes for a functional deployment:
1. `restaurant.json` → `name`, `tagline`, `theme`, `location.whatsapp`, `location.address`, `location.phone`, `location.email`, `hero.backgroundImage`
2. `restaurant.json` → `seo.title`, `seo.description`, `seo.ogImage`
3. `menu.json` → replace all items with client's actual menu

**Step 3 — Test locally (2 min)**
```bash
npm run dev
# Open http://localhost:3000 and verify
npm run build  # Confirm no build errors
```

**Step 4 — Deploy to Vercel (3 min)**
```bash
npx vercel --prod
# Or: push to GitHub → connect Vercel → auto-deploy
```

### What Requires Code Changes (don't do this for standard clients)

The following currently require touching `.tsx` files and should be avoided — these are logged as improvements in the roadmap:
- Changing section subtitle labels ("Culinary Experience", "Visual Journey", etc.)
- Adding or removing navigation links
- Changing the HTML `lang` attribute

---

## 8. Known Issues

Full details with file paths are in `AUDIT_REPORT.md`. Summary by priority:

### 🔴 Critical (fix before production)

| ID | Issue | File |
|----|-------|------|
| A1/P1 | **Lenis + `useScroll` conflict**: Framer Motion parallax in HeroSection reads native `scrollY`, not Lenis virtual scroll. Parallax is functionally broken. | `HeroSection.tsx:11-17` |
| AC1 | **Dual `<h1>` tags**: Two `<h1>` elements rendered — violates accessibility and SEO. | `HeroSection.tsx:79,89` |
| AC2 | **Lightbox has no Escape key handler**: Keyboard users cannot close the gallery lightbox. | `GallerySection.tsx:143-182` |
| S1 | **`servesCuisine: 'Indonesian'` hardcoded**: Wrong for every non-Indonesian restaurant client. | `app/layout.tsx:87` |
| S2 | **JSON-LD `dayOfWeek` format invalid**: Uses natural language strings; schema.org requires URL values. Rich results will fail. | `app/layout.tsx:92-98` |

### 🟡 Medium (address before first client delivery)

| ID | Issue |
|----|-------|
| T1 | No TypeScript interfaces for content JSON — missing schema validation |
| AC3–AC5 | No focus traps in mobile menu or lightbox |
| AC4 | Mobile menu has no Escape key handler |
| AC7 | `aria-roledescription="carousel"` on element with no ARIA role |
| AC8 | No skip-to-content link (WCAG 2.4.1) |
| AC9 | Two `<h2>` elements for split headings (should be one `<h2>` with `<span>`) |
| D1/R1 | Section header JSX duplicated in 8 components (~100 lines) |
| D2 | Cubic bezier inline-duplicated 6×; should use `ease.luxury` from utils |
| D5 | `scrollIntoView` helper duplicated in 5 components |
| MA1 | `@studio-freight/lenis` is deprecated — migrate to `lenis` |
| MA2 | No `types/content.ts` file with interfaces for content schemas |
| MA3 | No ESLint config file |
| M1 | Mobile floating bar obscures page content (no bottom padding on body) |
| M2 | Stats overlay in AboutSection overflows viewport on mobile |
| R2 | `navLinks` hardcoded in Navbar — not driven from config |
| R3 | Section eyebrow labels ("Visual Journey", etc.) hardcoded in components |
| S3 | `url: ''` in JSON-LD is invalid |
| S4/S5 | No canonical URL or `og:url` in metadata |

### 🟢 Low (cleanup pass)

| ID | Issue |
|----|-------|
| A5/A6 | Dead variables: `cssVarString`, exported `theme`, `getThemeCssVars` |
| T5 | `getWhatsAppUrl` doesn't guard against empty phone |
| MA5 | `iconMap` defined twice (AboutSection + FacilitiesSection) |
| M3–M5 | Minor mobile UX: hero text sizing, masonry on very small screens, no scroll hint on menu tabs |
| P4 | Testimonials carousel timer doesn't pause when tab is hidden |
| P5 | `noise-texture` SVG filter may cause repaints |
| S6/S7 | No `robots.txt` or `sitemap.xml` |
| AC10 | `lang="id"` hardcoded while UI labels are in English |
| H1 | `Intl.NumberFormat` may differ on servers without full ICU data |

---

## 9. Future Roadmap

### Recommended Improvements (high value, low effort)

These should be done before selling the template to a second client:

1. **Fix all 🔴 Critical issues** — especially the Lenis/parallax conflict and JSON-LD
2. **Extract `SectionHeader` component** — eliminates ~100 lines of duplication
3. **Create `types/content.ts`** — type safety for all JSON content
4. **Replace `@studio-freight/lenis` with `lenis`** — import path change only
5. **Add skip-to-content link** — one-line accessibility win
6. **Add `siteUrl` to `restaurant.json`** — unlocks canonical URL, og:url, JSON-LD url
7. **Add `servesCuisine` and `priceRange` to `restaurant.json`** — correct JSON-LD for all cuisine types
8. **Move section labels to `restaurant.json`** — full localization support
9. **Add `robots.txt` and `sitemap.ts`** — basic SEO hygiene
10. **Add bottom padding for mobile floating bar** — stops content being hidden behind the CTA bar

### Nice-to-Have Features (v1.1)

- **`SectionHeader` component** — DRY up all section headers
- **Focus trap hook** — reusable focus management for mobile menu and lightbox
- **`scrollTo` utility** — replace all inline `document.querySelector` calls
- **Pause-on-blur for carousel** — testimonials timer pauses when tab is hidden
- **Gallery high-res field** — `highResImage` field on gallery items instead of URL string replacement
- **Navigation from config** — `restaurant.json` drives the nav links so adding sections doesn't require component edits
- **Dark/light mode toggle** — extend the theme engine to support light variants
- **ESLint configuration file** — explicit `.eslintrc.json` for consistent linting

### Premium Features (v2.0)

These would make the template significantly more valuable as a higher-tier product:

- **Reservation form** — Static form submission via Formspree, Netlify Forms, or EmailJS (no backend needed)
- **Multi-language support** — i18n via `next-intl` with language switcher; content JSON per locale
- **Online menu PDF export** — Generate a printable menu PDF from `menu.json`
- **WhatsApp order flow** — Pre-structured WhatsApp messages for ordering specific menu items
- **Instagram feed integration** — Pull latest Instagram posts via public API for gallery section
- **Google Reviews live feed** — Real-time review widget via Google Places API
- **Promotions/specials section** — Time-limited banner or section for daily specials
- **Loading screen** — Branded intro animation on first visit
- **Horizontal scroll section** — Alternative showcase layout for menu items or gallery
- **Video hero option** — Background video support alongside image in `restaurant.json`
- **Multiple branch support** — Config array of locations with individual maps/hours
- **Cookie consent** — GDPR-compliant consent banner (required for European clients)
- **Analytics integration** — Config-driven GA4/Plausible/Fathom setup

### Architecture Improvements (for scale)

- **Content validation at build time** — Use `zod` to parse and validate all JSON files during `next build`. Build fails with clear errors if content is malformed.
- **Image CDN integration** — Replace hardcoded Unsplash URLs with a proper CDN workflow (Cloudinary, ImageKit) with upload instructions for non-technical clients
- **Preview mode** — Next.js draft mode for clients to preview content changes before going live
- **Component testing** — Vitest + Testing Library for critical components

---

## 10. Developer Handover Notes

### If you're new to this project, read in this order:

1. **This file** (PROJECT_CONTEXT.md) — complete picture
2. **`content/restaurant.json`** — understand the data shape
3. **`lib/config.ts`** — understand how data is accessed
4. **`lib/themes.ts`** — understand the theme engine
5. **`app/layout.tsx`** — understand how themes are applied and SEO is generated
6. **`app/page.tsx`** — understand section composition order
7. **One section component** (e.g., `MenuSection.tsx`) — understand the animation pattern

### Mental model for the codebase

Think of it in three layers:
1. **Content layer** (`/content/*.json`) — client edits, never touched by developers after setup
2. **Config layer** (`/lib/*.ts`) — bridges content to components, exports utilities
3. **UI layer** (`/components/**`, `/app/**`) — renders everything, reads from config layer only

### Common tasks and where to look

| Task | File(s) |
|------|---------|
| Change restaurant info | `content/restaurant.json` |
| Add a menu item | `content/menu.json` → `items[]` |
| Change accent color | `content/restaurant.json` → `"theme"` field |
| Add a new theme | `lib/themes.ts` |
| Add a catering package | `content/packages.json` → `packages[]` |
| Change rotating words | `content/packages.json` → `rotatingWords[]` |
| Change WhatsApp number | `content/restaurant.json` → `location.whatsapp` |
| Add a gallery image | `content/gallery.json` → `items[]` |
| Update opening hours | `content/restaurant.json` → `location.hours[]` |
| Change SEO title | `content/restaurant.json` → `seo.title` |
| Add/remove nav links | `components/layout/Navbar.tsx` → `navLinks[]` *(needs code change — see roadmap)* |
| Disable signature dish | `content/restaurant.json` → `signatureDish.enabled: false` |
| Change animation timing | `lib/utils.ts` → `ease`, `fadeUp`, `staggerContainer` |
| Add new image domains | `next.config.ts` → `images.remotePatterns[]` |
| Change font family | `app/layout.tsx` → Google Fonts imports + CSS variable names |

### Environment requirements

- Node.js 18+ (required for `Intl.NumberFormat` with full ICU, Next.js 15)
- npm 9+
- No environment variables required
- No external services required (map embed URL is in config, all content is static)

### Deployment

The project is **fully static** (`output: 'export'` is not set — it uses Next.js default SSG). Every page is pre-rendered at build time. It deploys to Vercel with zero configuration.

```bash
npm run build    # Build for production
npm run start    # Test production build locally
npx vercel       # Deploy to Vercel
```

Build output: ~174KB first load JS. Static HTML. Lighthouse target: 90+.

### Code style conventions

- All components use named default exports
- `'use client'` directive at the top of every interactive component
- Tailwind utility classes preferred; component classes in `globals.css` `@layer components` for repeated patterns
- Animation variants defined in `lib/utils.ts` for reuse; inline for one-off animations
- Content accessed only through `lib/config.ts` — never import JSON directly in components
- `cn()` utility used for conditional class merging (from `lib/utils.ts`)

---

*Last updated: Built and audited as part of initial template release.*
*Audit report: 43 issues identified — 5 critical, 28 medium, 10 low. See §8 for full list.*
