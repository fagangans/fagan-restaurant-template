import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { restaurant } from '@/lib/config'
import { themes } from '@/lib/themes'
import type { ThemeName } from '@/lib/themes'
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
const themeName = (restaurant.theme as ThemeName) || 'steakhouse'
const themeVars = themes[themeName]?.cssVars || {}
const cssVarString = Object.entries(themeVars)
  .map(([k, v]) => `${k}: ${v}`)
  .join('; ')

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
      lang="id"
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
              url: '',
              image: restaurant.hero.backgroundImage,
              servesCuisine: 'Indonesian',
              priceRange: '$$',
              openingHoursSpecification: restaurant.location.hours.map((h) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: h.days,
                opens: h.open,
                closes: h.close,
              })),
            }),
          }}
        />
      </head>
      <body className="noise-texture">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
