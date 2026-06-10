# Deployment Guide (Vercel)

## Prerequisites
- Node.js 18+
- A Vercel account (free tier works)

## Steps

### 1. Clone and install
```bash
git clone <your-repo>
cd fagan-restaurant-template
npm install
```

### 2. Customize content
Edit files in `/content/*.json` — see CUSTOMIZATION_GUIDE.md

### 3. Test locally
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B — GitHub Integration**
1. Push to GitHub
2. Go to vercel.com → New Project
3. Import your repository
4. Click Deploy (zero config needed)

## Environment Variables
No environment variables required. Everything is static.

## Custom Domain
In Vercel dashboard → Project → Settings → Domains → Add domain.

## Performance Tips
- Use Vercel Image Optimization (enabled by default)
- Keep images on a CDN (Unsplash, Cloudinary, etc.)
- Vercel CDN handles edge caching automatically
