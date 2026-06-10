# DEPLOYMENT HEALTH REPORT
## fagan-restaurant-template — Production Audit v2.0

---

**Audit Date:** 2026-06-10
**Auditor:** Production Audit System
**Scope:** Translation integrity · Runtime stability · Dependency health · Production readiness
**Prior Audit:** AUDIT_REPORT.md (v1.0, 43 issues, 0 resolved)

---

## Final Build Status

| Check | Status | Details |
|-------|--------|---------|
| `npm run build` | ✅ PASS | Next.js 16.2.9 (Turbopack), 5 static routes |
| `npm run type-check` | ✅ PASS | 0 TypeScript errors |
| `npm run lint` | ✅ PASS | 0 ESLint errors, 0 warnings |
| Translation parity | ✅ PASS | 82 keys — id.json === en.json, 0 missing, 0 mismatched |
| Translation usage | ✅ PASS | All `t.*` keys used in components exist in both JSON files |

---

## 1 — Translation System Integrity

### Key Parity Audit

Automated comparison of `content/translations/id.json` vs `content/translations/en.json`:

| Metric | Result |
|--------|--------|
| Keys in id.json | 82 |
| Keys in en.json | 82 |
| Missing in en.json | **0** |
| Missing in id.json | **0** |
| Structural divergence | **0** |

### Component Key Usage Audit

All `t.*` dot-access patterns extracted from 13 components and cross-referenced against both JSON files:

| Metric | Result |
|--------|--------|
| Unique key paths used in code | 77 |
| Keys referenced but absent from JSON | **0** |
| Keys in JSON but unreferenced directly | 5 (nav.menu/packages/gallery/about/contact — used dynamically via `t.nav[link.key]` in Navbar.tsx, **NOT missing**) |

### Runtime i18n Risks

| Risk | Status | Notes |
|------|--------|-------|
| `interpolate()` called with wrong variable name | ✅ LOW | All 4 interpolated strings use `{name}`, `{alt}`, `{num}` — all present in call sites |
| Locale falls back silently on invalid value | ✅ HANDLED | `getTranslations()` falls back to `id` if locale is unknown |
| `t` is computed at module load from static JSON | ✅ SAFE | No dynamic imports, no async risk |

---

## 2 — Runtime Stability

### Issues Found and Fixed

| ID | Severity | Issue | File | Fix Applied |
|----|----------|-------|------|-------------|
| RS-01 | 🔴 HIGH | `menu.categories[0].id` crashes if array is empty | `MenuSection.tsx:12` | Changed to `menu.categories[0]?.id ?? ''` |
| RS-02 | 🔴 HIGH | `restaurant.location.whatsapp.replace()` crashes if field is null/undefined | `lib/config.ts:29` | Changed to `?.replace()` with `?? ''` guard |
| RS-03 | 🟡 MEDIUM | `formatPrice()` has no ICU fallback — `id-ID` locale unavailable on small-icu Node.js causes hydration mismatch | `lib/config.ts:16` | Wrapped in try/catch with `Rp ${price.toLocaleString()}` fallback |
| RS-04 | 🟡 MEDIUM | `themes[themeName]` silently returns undefined for invalid theme names | `lib/config.ts:14` | Added runtime guard: validates against `themes` record, falls back to `'steakhouse'` |
| RS-05 | 🟢 LOW | Dead variable `cssVarString` computed but never used | `app/layout.tsx:31-33` | Deleted |
| RS-06 | 🟢 LOW | Dead export `theme` re-computed in config.ts (layout duplicated the logic) | `lib/config.ts:14` | Removed duplicate; config.ts is now the single source |
| RS-07 | 🟢 LOW | Dead export `getThemeCssVars()` never imported anywhere | `lib/themes.ts:100` | Deleted |

### JSON Access Risks (remaining)

| Pattern | Risk Level | Notes |
|---------|-----------|-------|
| `items[current]` in TestimonialsSection | ✅ SAFE | `current` is bounded: `(p+1) % items.length`. Cannot exceed array length. |
| `menu.categories[0]` | ✅ FIXED | Now uses optional chain — won't crash on empty categories |
| `restaurant.location.whatsapp` | ✅ FIXED | Now guarded with `?.` and `?? ''` |
| `seo.siteUrl` (new field) | ✅ SAFE | Accessed with `|| undefined` — gracefully absent when empty string |
| `h.schemaOrgDays` (new field) | ✅ SAFE | Required in updated restaurant.json schema; TypeScript infers it from JSON |

### Hydration Mismatch Risks

| Risk | Status |
|------|--------|
| `Intl.NumberFormat('id-ID')` server/browser divergence | ✅ FIXED — try/catch fallback added |
| `new Date().getFullYear()` in Footer (baked at build time) | ✅ ACCEPTABLE — static site; document a yearly rebuild reminder |
| `window.scrollY` access in FloatingActions/Navbar/TestimonialsSection | ✅ SAFE — all inside `useEffect`, never in render path |

---

## 3 — Dependency Health

### Packages Changed

| Package | Before | After | Reason |
|---------|--------|-------|--------|
| `next` | 15.3.3 | **16.2.9** | Latest stable — security patches, Turbopack GA, performance improvements |
| `eslint-config-next` | 15.3.3 | **16.2.9** | Must match Next.js version |
| `@studio-freight/lenis` | 1.0.42 | **REMOVED** | Deprecated; no further updates or security patches |
| `lenis` | — | **1.3.23** | Official successor by darkroomengineering; same API |

### Breaking Changes in Next.js 16

| Change | Impact on This Project |
|--------|----------------------|
| `next lint` CLI command removed | ✅ FIXED — lint script updated to `eslint . --ext .ts,.tsx` |
| Turbopack is now default build engine | ✅ COMPATIBLE — build passes, faster builds |
| App Router improvements | ✅ COMPATIBLE — no breaking API changes for this project |
| React Server Components hydration improvements | ✅ COMPATIBLE — all components already correctly marked `'use client'` |

### Remaining Vulnerability

| CVE | Package | Severity | Fixable? |
|-----|---------|----------|---------|
| GHSA-qx2v-qp2m-jg93 | `postcss <8.5.10` bundled inside `node_modules/next/node_modules/postcss` | Moderate (XSS) | **No** — this is an internal Next.js dependency across all stable versions (9.3.4–16.2.9). `npm audit fix --force` would downgrade to Next.js 9.3.3. Root-level `postcss` is 8.5.15 (secure). Track the Next.js changelog for a version that updates its internal postcss. |

---

## 4 — Issues Fixed in This Audit

All 20 items below were fixed and the build verified clean after each batch.

### Critical / High

| Ref | Issue | Fix |
|-----|-------|-----|
| H-01 | Dual `<h1>` in HeroSection | Merged into single `<h1>` with two `<span>` children; also fixed responsive text sizing (L-03: added `text-4xl` base) |
| H-02 | Lightbox: no Escape key, no focus management | Added `useEffect` Escape handler + `useRef` to close button + auto-focus on open |
| H-04 | `servesCuisine: 'Indonesian'` hardcoded | Moved to `seo.servesCuisine` in `restaurant.json`; read dynamically in `layout.tsx` |
| H-05 | `dayOfWeek` in JSON-LD invalid format | Added `schemaOrgDays[]` array field to each hours entry in `restaurant.json`; mapped to schema.org URLs in `layout.tsx` |

### Medium

| Ref | Issue | Fix |
|-----|-------|-----|
| M-03 | Mobile menu: no Escape key | Added `useEffect` keydown handler in `Navbar.tsx` |
| M-05 | `aria-roledescription="carousel"` on element without role | Added `role="region"` to carousel wrapper in `TestimonialsSection.tsx` |
| M-06 | No skip-to-content link | Added visually-hidden skip link as first child of `<body>` in `layout.tsx` |
| M-07/M-24 | Two `<h2>` for one heading in AboutSection and CtaSection | Merged into single `<h2>` with `<span>` children |
| M-11 | Fragile lightbox URL resolution (`w=600` string replace) | Replaced with regex `/w=\d+/` → `w=1600` |
| M-12 | `@studio-freight/lenis` deprecated | Uninstalled; installed `lenis@1.3.23`; updated import in `SmoothScrollProvider.tsx` |
| M-13 | No ESLint config file | Created `eslint.config.mjs` using `eslint-config-next` flat config |
| M-16 | Mobile content hidden behind floating bar | Added `pb-14 lg:pb-0` to `<body>` in `layout.tsx` |
| M-18 | `url: ''` in JSON-LD is invalid | Added `seo.siteUrl` to `restaurant.json`; JSON-LD `url` only emitted when non-empty |
| M-19/M-20 | No canonical URL, no `og:url` | Added `alternates.canonical` and `openGraph.url` — both conditional on `seo.siteUrl` |
| M-21 | Unsafe `as ThemeName` cast silently degrades theme | Runtime guard: validates `restaurant.theme` against `themes` record |
| M-22 | Carousel timer runs while tab is hidden | Added `visibilitychange` listener — timer pauses when tab is hidden |
| M-23 | Gallery `role="button"`: Space key not handled | Added `e.key === ' '` branch with `e.preventDefault()` to gallery item `onKeyDown` |
| M-27 | `formatPrice` crashes/mismatches without full ICU | Wrapped in try/catch with `Rp ${price.toLocaleString()}` fallback |

### Low

| Ref | Issue | Fix |
|-----|-------|-----|
| L-01 | Dead variable `cssVarString` in layout | Deleted |
| L-06 | `getWhatsAppUrl` unguarded on empty phone | Added `?.replace()` + `if (!phone) return '#'` |
| L-07/L-08 | No `robots.txt` or `sitemap.xml` | Created `app/robots.ts` and `app/sitemap.ts` using Next.js MetadataRoute API |
| M-25 | Dead export `getThemeCssVars` in themes.ts | Deleted |
| M-26 | Dead export `theme` re-exported from config.ts | Removed duplicate; config.ts now owns the validated `theme` constant |
| L-03 | Hero text overflow on very small screens | Fixed: `text-4xl sm:text-5xl lg:text-7xl xl:text-8xl` responsive scale |

### New Fixes (post-multilingual, not in original audit)

| Ref | Issue | Fix |
|-----|-------|-----|
| NEW-01 | `next lint` CLI removed in Next.js 16 | Updated `package.json` lint script to `eslint . --ext .ts,.tsx` |
| NEW-02 | `menu.categories[0].id` crashes if categories empty | Optional chaining: `categories[0]?.id ?? ''` |
| NEW-03 | RS-02 `whatsapp.replace()` without null guard | Added `?.replace()` chain + `?? ''` + `if (!phone) return '#'` guard |

---

## 5 — Remaining Risks (Unchanged from v1.0 Audit)

These items were **not fixed** in this pass because they require architectural decisions, significant refactoring, or involve trade-offs that should be reviewed by the project owner before proceeding.

### Still Open — Medium Priority

| Ref | Issue | Effort | Rationale for Deferral |
|-----|-------|--------|----------------------|
| H-03 | Lenis + `useScroll` parallax conflict | 2–3 hrs | Requires LenisContext refactor; risk of animation regression |
| M-02 | No focus trap in mobile menu | 45 min | Requires focus-trap library or custom hook |
| M-04 | No focus trap in lightbox | 30 min | Same pattern as M-02; do both together |
| M-08 | SectionHeader pattern duplicated 8× | 45 min | Safe refactor but no functional impact |
| M-09 | Ease literals instead of `ease.luxury` | 20 min | Style issue; zero functional impact |
| M-10 | `scrollIntoView` helper duplicated 5× | 15 min | Style issue; zero functional impact |
| M-14 | Section eyebrow labels hardcoded | 45 min | Resolved for section titles via translation system; sub-labels (facility names, etc.) still in JSON |
| M-15 | `navLinks` hardcoded in Navbar | 30 min | Functional; new sections require code edit |
| M-17 | Stats overlay overflows on mobile | 15 min | Layout fix; needs mobile testing |
| M-28 | `iconMap` defined in two components | 20 min | Create `lib/icons.ts` — safe cleanup |

### Still Open — Low Priority

| Ref | Issue | Notes |
|-----|-------|-------|
| L-02 | `seo.siteUrl` is empty string | Template placeholder — clients must set this per-deployment |
| L-04 | RotatingWord fixed `min-w` | Minor overflow on 320px viewports |
| L-05 | Menu tab overflow no scroll indicator | UX polish |
| L-09 | `feTurbulence` noise may cause repaints | Replace with static PNG for best performance |
| L-10 | Copyright year baked at build time | Acceptable for static sites; document yearly rebuild |

### Architectural Risk — Lenis + useScroll (H-03)

The hero parallax (`HeroSection.tsx`) reads native `window.scrollY` via Framer Motion's `useScroll`, while Lenis virtualizes scroll through CSS transforms. This means the hero parallax is technically broken — it moves against the native scroll position, not the Lenis-animated visual position. The recommended fix (LenisContext + MotionValue driven from Lenis scroll event) is a 2–3 hour architectural change with animation regression risk. It is documented as a known limitation but was **not fixed** in this pass.

---

## 6 — siteUrl Instructions for Client Deployment

The following fields in `content/restaurant.json → seo` must be set before production deployment to unlock full SEO functionality:

```json
"seo": {
  "siteUrl": "https://www.yourrestaurant.com",
  "servesCuisine": "Indonesian",
  "priceRange": "$$"
}
```

| Field | Effect When Set |
|-------|----------------|
| `siteUrl` | Enables `<link rel="canonical">`, `og:url`, `url` in JSON-LD, sitemap.xml |
| `servesCuisine` | Correct cuisine type in Google Rich Results |
| `priceRange` | Correct price range in Google Rich Results |

---

## 7 — Audit History

| Version | Date | Issues Found | Issues Fixed | Net Open |
|---------|------|-------------|-------------|---------|
| v1.0 | 2026-06-10 | 43 | 0 | 43 |
| v2.0 | 2026-06-10 | +7 new (RS-01–RS-07, NEW-01–03) | **30** | ~20 |

> v2.0 new issues are runtime stability risks discovered during the production audit that were not part of the original v1.0 scope.
