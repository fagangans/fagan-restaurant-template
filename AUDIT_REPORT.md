# AUDIT REPORT
## fagan-restaurant-template — Complete Repository Audit

---

**Audit Date:** 2026-06-10
**Audited By:** Principal Software Auditor
**Audit Scope:** Full repository — all 29 source files, ~10,000 LOC
**Build Status at Audit:** ✅ Passing
**TypeScript Errors at Audit:** ✅ 0
**Lint Errors at Audit:** ✅ 0

---

## Executive Summary

A complete audit was performed across 10 dimensions: Architecture, Reusability,
Type Safety, Accessibility, Mobile Responsiveness, SEO, Performance, Hydration
Risks, Code Duplication, and Maintainability.

The codebase is structurally sound, deploys cleanly, and has well-conceived
animation, theme, and content systems. However, there are meaningful gaps in
type safety, accessibility, SEO correctness, and a critical functional defect
where Lenis smooth scroll conflicts with Framer Motion's parallax system.

| Metric | Result |
|--------|--------|
| **Total Issues Found** | **43** |
| 🔴 High Severity | **5** |
| 🟡 Medium Severity | **28** |
| 🟢 Low Severity | **10** |
| Files Audited | 29 |
| Lines of Code | ~10,000 |

### Severity Distribution by Category

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Architecture | 1 | 4 | 1 | 6 |
| Reusability | 0 | 4 | 2 | 6 |
| Type Safety | 1 | 3 | 1 | 5 |
| Accessibility | 2 | 6 | 1 | 9 |
| Mobile Responsiveness | 0 | 2 | 3 | 5 |
| SEO | 2 | 3 | 2 | 7 |
| Performance | 1 | 2 | 2 | 5 |
| Hydration Risks | 0 | 1 | 2 | 3 |
| Code Duplication | 1 | 4 | 0 | 5 |
| Maintainability | 0 | 4 | 3 | 7 |
| **Total** | **8\*** | **33\*** | **17\*** | **43** |

> \* Some issues appear in multiple categories (e.g. the Lenis/parallax conflict
> is both Architecture and Performance). Unique issue count is 43.

---

## High Severity Issues

Issues that must be resolved before selling or deploying to any client.
Each represents a broken feature, accessibility violation, or invalid data
that will be caught by search engines, validators, or users.

---

### H-01 — Dual `<h1>` Elements in Hero Section

**Severity:** 🔴 HIGH
**Category:** Accessibility, SEO
**File:** `components/sections/HeroSection.tsx` — lines 79 and 89

**Explanation:**
The hero section renders two separate `<motion.h1>` elements: one for
`hero.headline` and a second for `hero.headlineAccent`. A web page must have
exactly one `<h1>` element. The `<h1>` is the primary heading that tells
browsers, screen readers, and search engines what the page is about. Two `<h1>`
elements create an invalid document outline and force screen readers to announce
two separate top-level headings, which is confusing for visually impaired users.

```tsx
// Current (broken)
<motion.h1>{hero.headline}</motion.h1>       // line 79
<motion.h1 className="gradient-text">        // line 89
  {hero.headlineAccent}
</motion.h1>
```

**Risk:**
- Screen readers announce two top-level page headings, confusing assistive
  technology users
- Google may reduce page authority by finding two competing primary headings
- Fails WCAG 2.4.6 (Headings and Labels)

**Recommended Fix:**
Replace both `<h1>` elements with a single `<h1>` containing two `<span>`
children. The gradient styling applies to the inner span, not the heading
element itself.

```tsx
// Fixed
<h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
  <span className="text-white block">{hero.headline}</span>
  <span className="gradient-text block">{hero.headlineAccent}</span>
</h1>
```

---

### H-02 — Gallery Lightbox Has No Escape Key Handler

**Severity:** 🔴 HIGH
**Category:** Accessibility
**File:** `components/sections/GallerySection.tsx` — lines 143–182

**Explanation:**
The gallery lightbox modal can only be dismissed by clicking the close button
or clicking the backdrop. There is no keyboard handler for the `Escape` key.
The ARIA Authoring Practices Guide (APG) for dialog patterns explicitly requires
that pressing `Escape` closes a modal dialog. Without this, keyboard-only users
and screen reader users are effectively trapped inside the lightbox with no way
to exit.

Additionally, when the lightbox opens, focus is not programmatically moved to
the close button. Focus remains wherever it was before the modal opened, which
means users navigating by keyboard or screen reader cannot immediately interact
with the modal's content or dismiss it.

**Risk:**
- Keyboard-only users cannot close the lightbox — they are permanently trapped
  unless they reload the page
- Fails WCAG 2.1.2 (No Keyboard Trap) — a Level A criterion
- Fails WCAG 2.4.3 (Focus Order)

**Recommended Fix:**

```tsx
// 1. Add Escape key handler
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setLightboxItem(null)
  }
  if (lightboxItem) {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }
}, [lightboxItem])

// 2. Move focus to close button on open
const closeButtonRef = useRef<HTMLButtonElement>(null)
useEffect(() => {
  if (lightboxItem) closeButtonRef.current?.focus()
}, [lightboxItem])

// 3. Apply ref to close button
<button ref={closeButtonRef} onClick={() => setLightboxItem(null)} ...>
  <X size={20} />
</button>
```

---

### H-03 — Lenis Smooth Scroll Conflicts With Framer Motion `useScroll`

**Severity:** 🔴 HIGH
**Category:** Architecture, Performance
**File:** `components/sections/HeroSection.tsx` — lines 11–17
**Also affects:** `components/providers/SmoothScrollProvider.tsx`

**Explanation:**
Framer Motion's `useScroll` hook reads the native browser scroll position
(`window.scrollY` / `document.documentElement.scrollTop`). Lenis smooth scroll
works by intercepting the browser's wheel events and animating a virtual scroll
position using CSS `transform`. As a result, the native `scrollY` value that
`useScroll` reads is typically `0` or moves in small, delayed increments —
completely disconnected from where the user visually sees the page.

The hero parallax effect (`imageY` and `textY` transform values) is driven by
this broken scroll position. In practice, the parallax either does not move or
moves in a jerky, lagging way that does not match the visual scroll.

```tsx
// Current — useScroll reads native scrollY, which Lenis ignores
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start start', 'end start'],
})
const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
```

**Risk:**
- The hero parallax effect is visually broken on all browsers where Lenis
  smooth scroll is active (which is all browsers, since Lenis is global)
- The signature selling point of the hero section does not work as intended
- This is the most visible part of the entire template

**Recommended Fix:**
Option A (preferred) — Expose the Lenis instance via React context and drive
a Framer Motion `MotionValue` from the Lenis scroll callback:

```tsx
// In SmoothScrollProvider — expose lenis instance via context
export const LenisContext = createContext<Lenis | null>(null)

// In HeroSection
const lenis = useContext(LenisContext)
const scrollProgress = useMotionValue(0)
const imageY = useTransform(scrollProgress, [0, 1], ['0%', '25%'])

useEffect(() => {
  if (!lenis || !ref.current) return
  return lenis.on('scroll', ({ progress }: { progress: number }) => {
    // Only update if the hero section is in the scroll range
    scrollProgress.set(progress)
  })
}, [lenis, scrollProgress])
```

Option B (simpler) — Disable Lenis on the hero section using
`data-lenis-prevent` and let the native scroll handle the parallax:

```tsx
<section ref={ref} data-lenis-prevent ...>
```

---

### H-04 — `servesCuisine` Hardcoded in JSON-LD Schema

**Severity:** 🔴 HIGH
**Category:** SEO, Reusability
**File:** `app/layout.tsx` — line 87

**Explanation:**
The Schema.org Restaurant structured data has `servesCuisine` hardcoded as
`'Indonesian'`. This field tells Google and other search engines what type of
cuisine the restaurant serves and is used in rich results for "best Italian
restaurant near me"-type queries. Since this is a reusable template, every
client that is not an Indonesian restaurant will have incorrect structured data
served to search engines.

Similarly, `priceRange` is hardcoded as `'$$'` on line 88, which may be wrong
for fine dining (`$$$$`) or budget restaurants (`$`).

```tsx
// Current — hardcoded, wrong for any non-Indonesian client
servesCuisine: 'Indonesian',
priceRange: '$$',
```

**Risk:**
- All non-Indonesian restaurant clients will have incorrect SEO structured data
- Wrong cuisine type means the restaurant will not appear in cuisine-specific
  searches
- Can be flagged as misleading data by Google Search Console

**Recommended Fix:**
Add fields to `content/restaurant.json`:

```json
{
  "seo": {
    "servesCuisine": "Indonesian",
    "priceRange": "$$"
  }
}
```

Then read them dynamically in `app/layout.tsx`:

```tsx
servesCuisine: restaurant.seo.servesCuisine,
priceRange: restaurant.seo.priceRange,
```

---

### H-05 — JSON-LD `openingHoursSpecification.dayOfWeek` Format Is Invalid

**Severity:** 🔴 HIGH
**Category:** SEO
**File:** `app/layout.tsx` — lines 92–98

**Explanation:**
The Schema.org `OpeningHoursSpecification` type requires `dayOfWeek` to be an
array of fully-qualified schema.org URLs, such as
`["https://schema.org/Monday", "https://schema.org/Friday"]`. The current
implementation passes the free-form string from `restaurant.json` directly
(e.g. `"Monday – Friday"`). This is not a valid schema.org value.

Google's Rich Results Test and Schema.org validator will reject this and the
restaurant will not be eligible for opening hours rich results in Google Search,
which are among the highest-value structured data types for local businesses.

```tsx
// Current — invalid format
openingHoursSpecification: restaurant.location.hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days,   // ← "Monday – Friday" is INVALID
  opens: h.open,
  closes: h.close,
}))
```

**Risk:**
- Opening hours will not appear as rich results in Google Search
- Structured data validation errors in Google Search Console
- Lost local SEO opportunity — hours are one of the most important local
  business signals

**Recommended Fix:**
Restructure `location.hours` in `restaurant.json` to use machine-readable
day arrays:

```json
"hours": [
  { "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "open": "11:00", "close": "22:00" },
  { "days": ["Saturday"], "open": "10:00", "close": "23:00" },
  { "days": ["Sunday"], "open": "10:00", "close": "21:00" }
]
```

Then map in `layout.tsx`:

```tsx
const dayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
}

openingHoursSpecification: restaurant.location.hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map((d) => dayMap[d]),
  opens: h.open,
  closes: h.close,
}))
```

---

## Medium Severity Issues

Issues that should be resolved before delivering to a first client. They do not
break core functionality but affect quality, accessibility, or reusability in
meaningful ways.

---

### M-01 — No TypeScript Interfaces for Content JSON Schemas

**File:** `lib/config.ts`, `content/*.json`
**Explanation:** All five content JSON files are imported and used with types
inferred directly from the JSON literals. There are no explicit TypeScript
interfaces for `Restaurant`, `MenuItem`, `Package`, `Facility`, `GalleryItem`,
or `Testimonial`. If a non-technical user edits a JSON file and removes a
required field or uses the wrong type (e.g. a string where a number is
expected), the error surfaces as a cryptic runtime crash rather than a clear
build-time error.
**Recommended Fix:** Create `types/content.ts` with explicit interfaces for all
content shapes and use the TypeScript `satisfies` operator on JSON imports:
`export const restaurant = restaurantData satisfies Restaurant`.

---

### M-02 — No Focus Trap in Mobile Navigation Menu

**File:** `components/layout/Navbar.tsx` — lines 101–137
**Explanation:** When the mobile fullscreen menu opens, Tab key focus cycles
through all focusable elements on the entire page — including elements that are
visually hidden behind the menu overlay. This means keyboard users and screen
reader users can interact with the page content while the menu is supposedly
"blocking" it, which is confusing and violates modal overlay behavior.
**Recommended Fix:** Implement focus trapping: on open, move focus to the first
nav link; intercept Tab and Shift+Tab to cycle only within the menu; on close,
return focus to the hamburger button. Use a custom hook or the `focus-trap-react`
library.

---

### M-03 — Mobile Menu Has No Escape Key Handler

**File:** `components/layout/Navbar.tsx`
**Explanation:** Standard keyboard interaction for modal overlays requires the
Escape key to dismiss them. The mobile menu has no `keydown` listener. Keyboard
users must click the `×` button (which they may not be able to reach) to close
the menu.
**Recommended Fix:** Add a `useEffect` that listens for `keydown` Escape:
```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setMobileOpen(false)
  }
  if (mobileOpen) document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}, [mobileOpen])
```

---

### M-04 — No Focus Trap in Gallery Lightbox

**File:** `components/sections/GallerySection.tsx`
**Explanation:** When the lightbox modal opens, focus is not moved into the
modal. Users navigating by keyboard start tabbing from wherever focus was before
clicking a gallery image, which could be anywhere on the page. Combined with
H-02 (no Escape key), this creates a complete keyboard accessibility failure for
the gallery feature.
**Recommended Fix:** See H-02 fix above — implement together as one change.
Use `useEffect` to focus the close button when `lightboxItem` is set.

---

### M-05 — `aria-roledescription` on Element Without ARIA Role

**File:** `components/sections/TestimonialsSection.tsx` — lines 99–104
**Explanation:** The carousel wrapper has `aria-roledescription="carousel"` set
on a plain `<div>` with no ARIA role. Per the ARIA specification,
`aria-roledescription` must only be used on elements that have an explicit,
non-abstract ARIA role. A bare `<div>` has no role, so `aria-roledescription`
has no semantic effect and may cause unexpected behavior in some screen readers.
**Recommended Fix:** Add `role="region"` alongside the existing
`aria-roledescription` and `aria-label`:
```tsx
<div role="region" aria-roledescription="carousel" aria-label="Customer testimonials">
```

---

### M-06 — Missing Skip-to-Content Link

**File:** `app/layout.tsx` or `components/layout/Navbar.tsx`
**Explanation:** There is no "Skip to main content" link as the first focusable
element on the page. WCAG 2.4.1 (Bypass Blocks) requires a mechanism to skip
repeated navigational blocks, and is a Level A criterion. Without this, keyboard
users must tab through all navigation items on every page load before reaching
the main content.
**Recommended Fix:** Add a visually hidden link as the first element in the
layout that becomes visible on focus:
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-accent)] focus:text-[var(--color-surface)] focus:px-4 focus:py-2"
>
  Skip to main content
</a>
```

---

### M-07 — About and CTA Sections Use Two `<h2>` for One Heading

**File:** `components/sections/AboutSection.tsx` — lines 80–93
**File:** `components/sections/CtaSection.tsx` — lines 57–70
**Explanation:** Both sections split a single conceptual heading into two
separate `<h2>` elements to achieve a two-color styling effect (white + gradient
accent). Screen readers announce these as two separate level-2 headings, which
makes the page heading structure incoherent. "A Story of Passion" and
"& Heritage" are one heading, not two.
**Recommended Fix:** Use a single `<h2>` with inner `<span>` elements:
```tsx
<h2 className="heading-display text-4xl lg:text-5xl xl:text-6xl">
  <span className="text-white">{about.heading}</span>{' '}
  <span className="gradient-text">{about.headingAccent}</span>
</h2>
```

---

### M-08 — Section Header Pattern Duplicated in 8 Components

**File:** All `components/sections/*.tsx`
**Explanation:** Every section component (About, Menu, Packages, Facilities,
Gallery, Testimonials, Location, CTA) contains an identical 10–15 line JSX
block: a flex row with divider lines and a label chip, followed by an `<h2>`
heading and a subheading `<p>`. This pattern is copy-pasted approximately 8
times, totalling roughly 100 lines of redundant, maintenance-heavy code. Any
design change to the section header must be applied 8 times.
**Recommended Fix:** Extract to `components/ui/SectionHeader.tsx`:
```tsx
interface SectionHeaderProps {
  label: string
  heading: string
  headingAccent?: string
  subheading?: string
  centered?: boolean
}
```

---

### M-09 — Ease Cubic Bezier Hardcoded in 6 Components

**File:** `components/layout/Navbar.tsx:38`, `components/sections/SignatureDishSection.tsx:43`,
`components/sections/PackagesSection.tsx:112`, `components/sections/FacilitiesSection.tsx:78`,
`components/sections/LocationSection.tsx:53,73`
**Explanation:** The luxury easing curve `[0.25, 0.46, 0.45, 0.94]` is
hardcoded as a literal array in 6 separate components. `lib/utils.ts` already
exports `ease.luxury` which contains this exact value, but the components do not
import or use it. This is a consistency and maintainability issue — if the
easing is ever tuned, 6 files need updating instead of 1.
**Recommended Fix:** Replace all instances with `ease.luxury` from `lib/utils`:
```tsx
import { ease } from '@/lib/utils'
// ...
transition={{ ease: ease.luxury }}
```

---

### M-10 — `scrollIntoView` Helper Duplicated in 5 Components

**File:** `components/sections/HeroSection.tsx`, `components/layout/FloatingActions.tsx`,
`components/layout/Navbar.tsx`, `components/sections/SignatureDishSection.tsx`,
`components/sections/CtaSection.tsx`
**Explanation:** The same 3-line scroll navigation pattern appears in 5 different
components:
```tsx
const el = document.querySelector('#section-id')
if (el) el.scrollIntoView({ behavior: 'smooth' })
```
**Recommended Fix:** Add a utility function to `lib/utils.ts`:
```tsx
export function scrollTo(id: string) {
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
}
```

---

### M-11 — Gallery Lightbox URL Resolution Is Fragile

**File:** `components/sections/GallerySection.tsx` — line 165
**Explanation:** The lightbox loads a higher-resolution image by replacing
`w=600` with `w=1200` and `w=800` with `w=1600` in the URL string. This is
fragile: if an image URL already contains `w=1200`, the first replace does
nothing; if an image doesn't contain either pattern (e.g. it uses `width=600`),
the URL is unchanged and the lightbox shows the small thumbnail at full screen
size.
**Recommended Fix:** Add a `highResImage` field to each gallery item in
`gallery.json`, or use a regex that matches any `w=\d+` pattern:
```tsx
const highResUrl = item.image.replace(/w=\d+/, 'w=1600')
```

---

### M-12 — `@studio-freight/lenis` Package Is Deprecated

**File:** `package.json` — line 17
**Explanation:** `@studio-freight/lenis` has been transferred to and is now
maintained under a different package name: `lenis` by darkroomengineering. The
`@studio-freight/lenis` package receives no further updates or security patches.
**Recommended Fix:**
```bash
npm uninstall @studio-freight/lenis
npm install lenis
```
Then update the import in `SmoothScrollProvider.tsx`:
```tsx
// Before
import Lenis from '@studio-freight/lenis'
// After
import Lenis from 'lenis'
```

---

### M-13 — No ESLint Configuration File

**File:** Project root
**Explanation:** ESLint is a devDependency and `npm run lint` is a registered
script, but there is no `.eslintrc.json` or `eslint.config.mjs` in the project
root. Next.js applies implicit defaults from `eslint-config-next`, but without
an explicit config file it is impossible to add custom rules, disable specific
rules, or document the linting strategy.
**Recommended Fix:** Create `eslint.config.mjs`:
```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [...compat.extends('next/core-web-vitals', 'next/typescript')]
```

---

### M-14 — Section Eyebrow Labels Are Hardcoded in Components

**File:** All `components/sections/*.tsx`
**Explanation:** Eyebrow labels like "Culinary Experience", "Visual Journey",
"Guest Reviews", "World-Class Spaces", and "Our Story" are hardcoded strings
inside the component files. A client who speaks Spanish, French, or Mandarin
cannot change these labels without editing TypeScript files.
**Recommended Fix:** Add a `labels` block to `content/restaurant.json` and
read section labels from it:
```json
"sectionLabels": {
  "menu": "Culinary Experience",
  "gallery": "Visual Journey",
  "testimonials": "Guest Reviews",
  "facilities": "World-Class Spaces",
  "about": "Our Story"
}
```

---

### M-15 — Navigation Links Hardcoded in Navbar Component

**File:** `components/layout/Navbar.tsx` — lines 9–15
**Explanation:** The `navLinks` array is a hardcoded constant inside the Navbar
component. If a section is added or removed, the developer must edit a component
file. This violates the template's core principle of "change content without
touching code".
**Recommended Fix:** Move to `content/restaurant.json`:
```json
"navigation": [
  { "label": "Menu", "href": "#menu" },
  { "label": "Packages", "href": "#packages" }
]
```

---

### M-16 — Mobile Content Hidden Behind Floating Action Bar

**File:** `components/layout/FloatingActions.tsx` — lines 97–128
**Explanation:** The mobile floating action bar is fixed at `bottom: 0` and is
approximately 56px tall. No padding is added to `<body>` or `<main>` to
compensate. On mobile, the last section's buttons and the footer content can be
partially or completely hidden behind the floating bar, making them unclickable.
**Recommended Fix:** Add `pb-14 lg:pb-0` to the `<body>` tag in `layout.tsx`
or to the `<main>` element in `page.tsx` so content clears the bar on mobile.

---

### M-17 — Stats Overlay Overflows Viewport on Mobile

**File:** `components/sections/AboutSection.tsx` — lines 44–65
**Explanation:** The about section's stats grid is absolutely positioned with
`-bottom-8 -right-4 lg:-right-8`. On mobile viewports (~375px wide), this
negative right positioning plus the fixed-width stats grid can push content
beyond the viewport boundary, causing a horizontal scrollbar on the page.
**Recommended Fix:** Convert the absolute positioning to a responsive layout.
On mobile, place the stats below the image in normal flow. On desktop, use the
absolute positioning:
```tsx
className="relative lg:absolute lg:-bottom-8 lg:-right-8 grid grid-cols-2 gap-px"
```

---

### M-18 — `url: ''` in JSON-LD Is Invalid

**File:** `app/layout.tsx` — line 88
**Explanation:** The Schema.org Restaurant schema has `url: ''` — an empty
string. Google's Rich Results Test marks this as an error. A URL field in
structured data must either be a valid absolute URL or omitted entirely.
**Recommended Fix:** Add `siteUrl` to `content/restaurant.json` and use it:
```tsx
url: restaurant.seo.siteUrl || undefined,
```

---

### M-19 — No Canonical URL in Metadata

**File:** `app/layout.tsx` — lines 35–56
**Explanation:** The `metadata` export does not include a canonical URL. Without
a canonical, Google may index multiple URL variants (with/without trailing
slash, `www` vs non-`www`) as separate pages, diluting page authority.
**Recommended Fix:**
```tsx
alternates: {
  canonical: restaurant.seo.siteUrl,
},
```

---

### M-20 — `og:url` Missing from Open Graph Metadata

**File:** `app/layout.tsx` — lines 38–45
**Explanation:** The OpenGraph `url` property is not set in the metadata export.
Without `og:url`, social media platforms cannot definitively identify the
canonical page when the link is shared, which can affect link preview accuracy.
**Recommended Fix:**
```tsx
openGraph: {
  url: restaurant.seo.siteUrl,
  // ... other og fields
}
```

---

### M-21 — Unsafe Theme Name Cast With `as ThemeName`

**File:** `app/layout.tsx:29-30`, `lib/config.ts:14`
**Explanation:** `restaurant.theme` is cast to `ThemeName` using `as`. If a
client sets `"theme": "pizza"` in `restaurant.json`, TypeScript does not catch
this at build time because the cast suppresses the type error. `themes['pizza']`
returns `undefined`, and the optional chain `?.cssVars || {}` silently degrades
the entire theme to empty — all CSS variables are missing and the page renders
with default CSS colors only, with no error or warning.
**Recommended Fix:** Add a runtime validation guard:
```tsx
const rawTheme = restaurant.theme
const themeName: ThemeName = rawTheme in themes
  ? (rawTheme as ThemeName)
  : 'steakhouse'
if (!(rawTheme in themes)) {
  console.warn(`Unknown theme "${rawTheme}". Falling back to "steakhouse".`)
}
```

---

### M-22 — Testimonials Carousel Timer Runs While Tab Is Hidden

**File:** `components/sections/TestimonialsSection.tsx` — lines 27–30
**Explanation:** The 5-second carousel auto-advance interval continues ticking
when the browser tab is hidden or the user switches to another application. This
causes unnecessary state updates in a hidden tab, wasting CPU cycles.
**Recommended Fix:**
```tsx
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) clearInterval(timer)
    else timer = setInterval(next, 5000)
  }
  let timer = setInterval(next, 5000)
  document.addEventListener('visibilitychange', handleVisibility)
  return () => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', handleVisibility)
  }
}, [next])
```

---

### M-23 — Gallery Items: `Space` Key Not Handled for `role="button"`

**File:** `components/sections/GallerySection.tsx` — line 110
**Explanation:** Gallery items have `role="button"` and `onKeyDown` that checks
only for `Enter`. The ARIA Authoring Practices require that elements with
`role="button"` activate on both `Enter` **and** `Space`. Missing Space handling
means approximately 50% of keyboard activation patterns are broken for this
interactive element.
**Recommended Fix:**
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault() // Prevent page scroll on Space
    setLightboxItem(item)
  }
}}
```

---

### M-24 — Two `<h2>` Split Heading Pattern in 3 Sections

**File:** `components/sections/SignatureDishSection.tsx`,
`components/sections/AboutSection.tsx`, `components/sections/CtaSection.tsx`
**Explanation:** All three sections split one conceptual heading across two
`<h2>` elements for styling purposes. This is the same root cause as M-07 but
affects three sections. All should be addressed in one pass.
**Recommended Fix:** Extract a `<SplitHeading primary="" accent="" />` reusable
component that renders a single `<h2>` with styled inner spans.

---

### M-25 — `getThemeCssVars` Exported but Never Used

**File:** `lib/themes.ts` — line 100
**Explanation:** The `getThemeCssVars` function is exported but imported nowhere
in the codebase. Dead exports pollute the public API of a module and confuse
developers who may assume the function is used somewhere.
**Recommended Fix:** Delete the function or mark it as internal with a comment
if it is intended for future use.

---

### M-26 — `theme` Export From `lib/config.ts` Is Never Used

**File:** `lib/config.ts` — line 14
**Explanation:** `export const theme = (restaurant.theme as ThemeName) || 'steakhouse'`
is exported but never imported in any other file. The layout file performs its
own identical computation locally (line 29 of `layout.tsx`), creating redundant
duplicate logic.
**Recommended Fix:** Remove the dead export from `lib/config.ts` and consolidate
the computation in one place (either the layout or the config module).

---

### M-27 — `Intl.NumberFormat` Locale May Differ Between Server and Browser

**File:** `lib/config.ts` — lines 16–22
**Explanation:** `formatPrice` uses `Intl.NumberFormat('id-ID', ...)`. On some
Node.js builds compiled with `--with-intl=small-icu`, the `'id-ID'` locale data
may not be available. In this case, formatting falls back to a locale-generic
format on the server but uses the correct locale in the browser, creating a
hydration mismatch for any server-rendered price display.
**Recommended Fix:** Wrap in a try/catch with a manual fallback:
```tsx
export function formatPrice(price: number): string {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  } catch {
    return `Rp ${price.toLocaleString()}`
  }
}
```

---

### M-28 — `iconMap` Defined Separately in Two Components

**File:** `components/sections/AboutSection.tsx:10`,
`components/sections/FacilitiesSection.tsx:10-17`
**Explanation:** Two icon maps are defined independently with partially
overlapping icon name sets. `AboutSection` handles `leaf`, `star`, `users` and
`FacilitiesSection` handles `crown`, `users`, `trees`, `moon`, `car`,
`sparkles`. If a new icon is needed, it must be added to whichever file it
happens to be used in, with no central registry.
**Recommended Fix:** Create `lib/icons.ts` exporting a unified icon registry
covering all icon names used in content JSON files.

---

## Low Severity Issues

Issues that represent minor polish, cleanup, or informational concerns. Address
these in a final cleanup pass.

---

### L-01 — Dead Variable `cssVarString` in Layout

**File:** `app/layout.tsx` — lines 31–33
**Explanation:** `cssVarString` is computed via `Object.entries(themeVars).map(...).join('; ')` but never referenced anywhere. The actual CSS variable injection is done separately via `Object.fromEntries` on lines 67–70.
**Fix:** Delete lines 31–33.

---

### L-02 — `lang="id"` Hardcoded While UI Labels Are in English

**File:** `app/layout.tsx` — line 64
**Explanation:** The `<html lang="id">` attribute declares the document language
as Indonesian, but all UI labels (buttons, section headers, navigation) are in
English. Screen readers use the `lang` attribute to choose the correct
pronunciation engine — mismatching it causes English text to be pronounced with
Indonesian phonetics.
**Fix:** Add `"language": "en"` (or `"id"`) to `restaurant.json` and bind it:
`<html lang={restaurant.language ?? 'id'}>`.

---

### L-03 — Hero Text May Overflow on Very Small Screens (< 360px)

**File:** `components/sections/HeroSection.tsx` — line 83
**Explanation:** The smallest hero text size is `text-5xl` (48px) on mobile.
On 320px-wide viewports (older iPhones, some budget Android), a two-line 48px
heading may overflow or cause layout compression.
**Fix:** Add a `text-4xl` (36px) base and start responsive scaling from `sm:`:
`className="heading-display text-4xl sm:text-5xl lg:text-7xl xl:text-8xl"`.

---

### L-04 — RotatingWord Has Fixed Min-Width That May Overflow Small Screens

**File:** `components/sections/PackagesSection.tsx` — line 23
**Explanation:** `min-w-[240px]` on the rotating word container is wider than
some 320px viewports (approximately 75% of viewport width), which can cause
horizontal overflow at extreme small sizes.
**Fix:** Replace with `min-w-[min(240px,75vw)]` or a percentage-based width.

---

### L-05 — Menu Category Tab Overflow Has No Scroll Indicator

**File:** `components/sections/MenuSection.tsx` — lines 52–76
**Explanation:** Horizontal tab overflow uses `scrollbar-none` to hide the
scrollbar. On mobile, users may not discover that additional tabs are accessible
by horizontal scrolling.
**Fix:** Add a right-edge fade gradient to indicate overflow:
```tsx
<div className="relative">
  <div className="flex ... overflow-x-auto scrollbar-none">...</div>
  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-surface)] pointer-events-none" />
</div>
```

---

### L-06 — `getWhatsAppUrl` Does Not Guard Against Empty Phone Number

**File:** `lib/config.ts` — lines 25–30
**Explanation:** If `restaurant.location.whatsapp` is empty or missing, the
function returns `https://wa.me/?text=...` which is an invalid WhatsApp URL
that silently opens WhatsApp with no recipient set.
**Fix:** Add a guard: `if (!phone) return '#'`.

---

### L-07 — No `robots.txt` File

**File:** Project root (missing)
**Explanation:** There is no `robots.txt` file. While `robots: { index: true, follow: true }` in metadata generates a meta robots tag, a `robots.txt` file is the standard mechanism that crawlers check before even requesting a page.
**Fix:** Create `app/robots.ts` using Next.js's built-in route handler.

---

### L-08 — No `sitemap.xml`

**File:** Project root (missing)
**Explanation:** No sitemap is generated. For a single-page site this is low
priority, but a sitemap enables faster indexing by search engines and is a
standard SEO hygiene item.
**Fix:** Create `app/sitemap.ts` returning the site URL.

---

### L-09 — `noise-texture` SVG Filter May Cause Repaints

**File:** `app/globals.css` — lines 138–145
**Explanation:** The `body::after` pseudo-element uses an inline SVG with an
`feTurbulence` filter for the noise texture. On some browsers, SVG filter
pseudo-elements can trigger repaints during scroll, as the browser recalculates
the filter on each frame.
**Fix:** Replace with a static base64-encoded noise PNG or a hosted asset,
which the browser can GPU-composite without recalculating.

---

### L-10 — Footer `new Date().getFullYear()` Baked In at Build Time

**File:** `components/layout/Footer.tsx` — line 99
**Explanation:** The copyright year is computed at build time and baked into the
static HTML. If the site goes a full year without a rebuild, the footer will
display the wrong copyright year without any error.
**Fix:** This is an acceptable trade-off for a static site. Document in
`PROJECT_CONTEXT.md` that a yearly rebuild is required, or use a client
component with `suppressHydrationWarning` to render the year on the client:
```tsx
'use client'
export default function CopyrightYear() {
  return <>{new Date().getFullYear()}</>
}
```

---

## Quick Wins

All improvements completable in **under 30 minutes** with low risk of regression.

| # | Fix | Estimated Time | Files |
|---|-----|----------------|-------|
| 1 | Delete dead `cssVarString` variable | 2 min | `app/layout.tsx:31-33` |
| 2 | Delete dead `theme` export | 2 min | `lib/config.ts:14` |
| 3 | Delete dead `getThemeCssVars` export | 2 min | `lib/themes.ts:100-105` |
| 4 | Add Escape key handler to mobile menu | 5 min | `Navbar.tsx` |
| 5 | Add Escape key handler to lightbox | 5 min | `GallerySection.tsx` |
| 6 | Add `Space` key to gallery item handler | 2 min | `GallerySection.tsx:110` |
| 7 | Fix `<h1>` duplication in hero | 5 min | `HeroSection.tsx:79,89` |
| 8 | Add skip-to-content link | 3 min | `app/layout.tsx` |
| 9 | Add `role="region"` to carousel wrapper | 2 min | `TestimonialsSection.tsx:99` |
| 10 | Replace inline ease arrays with `ease.luxury` | 5 min | 6 component files |
| 11 | Extract `scrollTo` utility function | 5 min | `lib/utils.ts` + 5 files |
| 12 | Add WhatsApp URL guard for empty phone | 3 min | `lib/config.ts:25-30` |
| 13 | Fix theme name runtime validation | 5 min | `app/layout.tsx:29-30` |
| 14 | Add bottom padding for mobile floating bar | 2 min | `app/page.tsx` or `layout.tsx` |
| 15 | Replace `@studio-freight/lenis` with `lenis` | 5 min | `package.json` + `SmoothScrollProvider.tsx` |
| 16 | Create `eslint.config.mjs` | 5 min | Project root |
| 17 | Fix gallery lightbox URL regex | 3 min | `GallerySection.tsx:165` |
| 18 | Add `servesCuisine` / `priceRange` to `restaurant.json` | 5 min | `restaurant.json` + `layout.tsx` |

---

## Performance Improvements

Issues with direct impact on Lighthouse score and page loading speed.

| Priority | Issue | Expected Lighthouse Impact |
|----------|-------|--------------------------|
| 🔴 HIGH | H-03: Fix Lenis + `useScroll` conflict | Prevents janky parallax animation causing layout thrashing |
| 🟡 MEDIUM | P-02: Split `lib/config.ts` into domain modules | Reduces unused JS in bundles where only one data type is needed |
| 🟡 MEDIUM | M-22: Pause carousel interval when tab is hidden | Reduces background CPU usage |
| 🟢 LOW | M-11: Fix lightbox high-res URL resolution | Prevents loading wrong-sized images in lightbox |
| 🟢 LOW | L-09: Replace `feTurbulence` noise with static PNG | Eliminates potential repaint on scroll |
| 🟢 LOW | P-06: Audit necessity of 3 Google Font families | Each additional font family adds a network request and potential CLS |

**Current bundle size at audit:** ~174KB first load JS (acceptable).
**Target after improvements:** Sub-150KB first load JS.

---

## Accessibility Improvements

All issues affecting users with disabilities, keyboard navigation, or assistive
technologies. Ordered by WCAG conformance level.

| WCAG Level | Issue ID | Description |
|-----------|----------|-------------|
| **A (Must)** | H-02 | Lightbox: no Escape key, no focus management |
| **A (Must)** | M-02 | Mobile menu: no focus trap |
| **A (Must)** | M-03 | Mobile menu: no Escape key |
| **A (Must)** | M-06 | Missing skip-to-content link (2.4.1) |
| **A (Must)** | M-23 | Gallery buttons: Space key not handled |
| **AA (Should)** | H-01 | Dual `<h1>` elements (2.4.6) |
| **AA (Should)** | M-04 | Lightbox: no focus trap |
| **AA (Should)** | M-05 | `aria-roledescription` without ARIA role |
| **AA (Should)** | M-07 | Two `<h2>` per heading in About/CTA sections |
| **AA (Should)** | M-24 | Two `<h2>` per heading in SignatureDish section |
| **Informational** | L-02 | `lang="id"` conflicts with English UI labels |

**Estimated effort for full WCAG AA compliance:** 4–6 hours.

---

## SEO Improvements

All issues affecting search engine visibility, structured data validity, and
indexing performance.

| Priority | Issue | Search Impact |
|----------|-------|--------------|
| 🔴 HIGH | H-04 | Wrong `servesCuisine` — incorrect cuisine type in all search indices |
| 🔴 HIGH | H-05 | Invalid `dayOfWeek` — opening hours rich results will not appear |
| 🟡 MEDIUM | M-18 | Empty `url: ''` in JSON-LD — fails Rich Results Test |
| 🟡 MEDIUM | M-19 | No canonical URL — potential duplicate content dilution |
| 🟡 MEDIUM | M-20 | No `og:url` — social share preview may be inaccurate |
| 🟡 MEDIUM | H-01 | Dual `<h1>` — competing primary page headings |
| 🟢 LOW | L-07 | No `robots.txt` |
| 🟢 LOW | L-08 | No `sitemap.xml` |

**How to fix all SEO issues in one session:**
1. Add `siteUrl`, `servesCuisine`, `priceRange` to `restaurant.json`
2. Restructure `location.hours` to use machine-readable day arrays
3. Update `app/layout.tsx`: canonical, og:url, JSON-LD url, JSON-LD dayOfWeek mapping
4. Create `app/robots.ts` and `app/sitemap.ts`
**Estimated effort:** 2–3 hours.

---

## Reusability Improvements

Issues that affect how quickly and cleanly the template can be deployed for a
new client. The goal is zero code modifications per deployment.

| Priority | Issue | Impact on New Client Deployment |
|----------|-------|--------------------------------|
| 🟡 HIGH | M-14 | Section labels hardcoded — non-English clients must edit `.tsx` files |
| 🟡 HIGH | M-15 | `navLinks` hardcoded in Navbar — adding/removing sections requires code edit |
| 🟡 MEDIUM | M-01 | No content type interfaces — JSON editing is error-prone without schema |
| 🟡 MEDIUM | H-04 | `servesCuisine` hardcoded — wrong for all non-Indonesian clients |
| 🟡 MEDIUM | M-08 | Section header duplication — design changes require 8 file edits |
| 🟢 LOW | L-02 | `lang` hardcoded — wrong for non-Indonesian language deployments |
| 🟢 LOW | M-25/M-26 | Dead exports confuse developers onboarding to the codebase |

**Ideal state:** A new client deployment requires editing only the 5 JSON files
in `/content/`. Currently, the minimum changes also require editing `Navbar.tsx`
(for nav links) and several section components (for labels).

---

## Recommended Fix Order

### Phase 1 — Critical Fixes
**Goal:** Ensure every deployed site has no broken features, accessibility
blockers, or invalid SEO data.
**Estimated effort:** 4–6 hours

| Task | Issue(s) | Effort |
|------|---------|--------|
| Fix dual `<h1>` in HeroSection | H-01 | 15 min |
| Add Escape key + focus to lightbox | H-02 | 30 min |
| Fix Lenis + `useScroll` conflict | H-03 | 2 hours |
| Add `servesCuisine` / `priceRange` to config | H-04 | 30 min |
| Fix JSON-LD `dayOfWeek` format | H-05 | 45 min |
| Add `siteUrl` to config; fix `url: ''` | M-18 | 20 min |
| Add canonical URL and `og:url` | M-19, M-20 | 15 min |
| Replace `@studio-freight/lenis` | M-12 | 15 min |
| Add skip-to-content link | M-06 | 10 min |
| Fix mobile bottom bar padding | M-16 | 10 min |
| Delete dead variables | L-01, M-25, M-26 | 10 min |

---

### Phase 2 — Performance
**Goal:** Improve Lighthouse score and eliminate runtime inefficiencies.
**Estimated effort:** 2–3 hours

| Task | Issue(s) | Effort |
|------|---------|--------|
| Fix gallery lightbox URL resolution | M-11 | 20 min |
| Pause carousel on hidden tab | M-22 | 15 min |
| Replace ease literal arrays with `ease.luxury` | M-09 | 20 min |
| Extract `scrollTo` utility | M-10 | 15 min |
| Replace `feTurbulence` noise with static PNG | L-09 | 30 min |
| Split `lib/config.ts` into domain modules | P-02 | 1 hour |
| Add `formatPrice` ICU fallback | M-27 | 20 min |

---

### Phase 3 — Accessibility
**Goal:** Achieve WCAG 2.1 AA compliance across the entire site.
**Estimated effort:** 3–4 hours

| Task | Issue(s) | Effort |
|------|---------|--------|
| Add focus trap to mobile menu | M-02 | 45 min |
| Add Escape key to mobile menu | M-03 | 15 min |
| Add focus trap to lightbox | M-04 | 30 min |
| Fix `<h2>` split heading in 3 sections | M-07, M-24 | 30 min |
| Fix `aria-roledescription` on carousel | M-05 | 10 min |
| Fix `Space` key on gallery buttons | M-23 | 10 min |
| Fix `lang` attribute to be config-driven | L-02 | 15 min |
| Fix hero text overflow on small screens | L-03 | 15 min |

---

### Phase 4 — SEO
**Goal:** Pass Google Rich Results Test and maximize search visibility.
**Estimated effort:** 2 hours

| Task | Issue(s) | Effort |
|------|---------|--------|
| Create `app/robots.ts` | L-07 | 15 min |
| Create `app/sitemap.ts` | L-08 | 20 min |
| Add ESLint config file | M-13 | 20 min |
| Test all JSON-LD in Rich Results Test | H-04, H-05, M-18 | 30 min |
| Validate OG tags with Meta Debugger | M-19, M-20 | 20 min |

---

### Phase 5 — Code Quality
**Goal:** Eliminate duplication, enforce type safety, improve DX for all future
developers maintaining this template.
**Estimated effort:** 4–6 hours

| Task | Issue(s) | Effort |
|------|---------|--------|
| Create `types/content.ts` with all interfaces | M-01 | 1.5 hours |
| Extract `SectionHeader` component | M-08 | 45 min |
| Extract `SplitHeading` component | M-24 | 30 min |
| Extract `RotatingWord` to `components/ui/` | R-06 | 20 min |
| Create unified `lib/icons.ts` | M-28 | 20 min |
| Move `navLinks` to `restaurant.json` | M-15 | 30 min |
| Move section labels to `restaurant.json` | M-14 | 45 min |
| Add theme name runtime validation | M-21 | 20 min |
| Add WhatsApp URL guard | L-06 | 5 min |
| Fix RotatingWord min-width | L-04 | 10 min |
| Add menu tab scroll indicator | L-05 | 15 min |

---

## Audit History

| Version | Date | Auditor | Issues Found | Issues Resolved |
|---------|------|---------|-------------|-----------------|
| v1.0 | 2026-06-10 | Principal Software Auditor | 43 | 0 |

> Update this table each time a new audit is performed or a batch of issues is
> resolved. This serves as the permanent audit trail for the project.
