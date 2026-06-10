# Customization Guide

## Quick Start — Deploy in 15 Minutes

### 1. Edit `content/restaurant.json`

Change these fields to match your client:

```json
{
  "name": "Your Restaurant Name",
  "tagline": "Your Tagline",
  "theme": "steakhouse",        // steakhouse | seafood | coffee | bakery
  "location": {
    "whatsapp": "+62812XXXXXXX",  // Client's WhatsApp number
    "phone": "+62 21 XXXX XXXX",
    "address": "Full address here",
    "email": "reservations@yourrestaurant.com"
  }
}
```

### 2. Edit `content/menu.json`

Add/remove menu items. Each item follows this structure:
```json
{
  "id": "unique-id",
  "categoryId": "signature",
  "name": "Dish Name",
  "description": "Description",
  "price": 150000,
  "image": "https://your-image-url.jpg",
  "badge": "Best Seller",
  "isSpicy": false,
  "isHalal": true,
  "isVegetarian": false
}
```

### 3. Edit `content/packages.json`

Update catering packages and the rotating words list.

### 4. Update images

Replace all `image` URLs in the content files with your client's actual photos.

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

---

## Theme System

Change the `"theme"` value in `restaurant.json`:

| Value | Appearance |
|-------|-----------|
| `steakhouse` | Warm amber/gold tones (default) |
| `seafood` | Cool ocean blue tones |
| `coffee` | Rich coffee brown tones |
| `bakery` | Golden wheat tones |

---

## Image Guidelines

- Hero background: 1920×1080px minimum
- Food photos: 800×600px minimum
- Gallery: Mixed sizes (600–1600px wide)
- Use Unsplash, client photos, or a CDN
- All images are lazy-loaded automatically

---

## WhatsApp Integration

All WhatsApp buttons auto-generate from `content/restaurant.json`:
```json
"whatsapp": "+6281234567890"
```

Custom messages per button are in `packages.json` and `lib/config.ts`.
