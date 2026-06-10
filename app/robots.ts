import type { MetadataRoute } from 'next'
import { restaurant } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = restaurant.seo.siteUrl || undefined
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(siteUrl && { sitemap: `${siteUrl}/sitemap.xml` }),
  }
}
