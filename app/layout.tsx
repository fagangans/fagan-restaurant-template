import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { restaurant, locale, theme } from '@/lib/config'
import { themes } from '@/lib/themes'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const { seo } = restaurant
const themeVars = themes[theme]?.cssVars ?? {}
const siteUrl = seo.siteUrl || undefined

const schemaOrgDayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ...(siteUrl && { alternates: { canonical: siteUrl } }),
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630 }],
    type: 'website',
    locale: locale === 'en' ? 'en_US' : 'id_ID',
    ...(siteUrl && { url: siteUrl }),
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
      style={Object.fromEntries(
        Object.entries(themeVars).map(([k, v]) => [k, v])
      ) as React.CSSProperties}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: restaurant.name,
              description: restaurant.description,
              address: {
                '@type': 'PostalAddress',
                streetAddress: restaurant.location.address,
                addressLocality: restaurant.location.city,
                addressCountry: restaurant.location.country,
              },
              telephone: restaurant.location.phone,
              email: restaurant.location.email,
              ...(siteUrl && { url: siteUrl }),
              image: restaurant.hero.backgroundImage,
              servesCuisine: seo.servesCuisine,
              priceRange: seo.priceRange,
              openingHoursSpecification: restaurant.location.hours.map((h) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: h.schemaOrgDays.map(
                  (d) => schemaOrgDayMap[d] ?? `https://schema.org/${d}`
                ),
                opens: h.open,
                closes: h.close,
              })),
            }),
          }}
        />
      </head>
      <body className="noise-texture pb-14 lg:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-accent)] focus:text-[var(--color-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-sans"
        >
          Skip to main content
        </a>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <script
  src="http://localhost:3001/widget/chat-widget.js"
  data-widget-key="04ac3359-5ef7-4ab0-ba7d-ee71f744e984"
  data-api-url="http://localhost:3001/api/chat"
></script>
      </body>
    </html>
  )
}
