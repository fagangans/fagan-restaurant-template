import type { MetadataRoute } from 'next'
import { restaurant } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = restaurant.seo.siteUrl
  if (!siteUrl) return []
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
