import restaurantData from '@/content/restaurant.json'
import menuData from '@/content/menu.json'
import packagesData from '@/content/packages.json'
import galleryData from '@/content/gallery.json'
import testimonialsData from '@/content/testimonials.json'
import type { ThemeName } from './themes'
import { getTranslations, type Locale } from './i18n'

export const restaurant = restaurantData
export const menu = menuData
export const packages = packagesData
export const gallery = galleryData
export const testimonials = testimonialsData

export const theme = (restaurant.theme as ThemeName) || 'steakhouse'
export const locale = (restaurant.language as Locale) || 'id'
export const t = getTranslations(locale)

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getWhatsAppUrl(message?: string): string {
  const phone = restaurant.location.whatsapp.replace(/[^0-9]/g, '')
  const defaultMsg = locale === 'en'
    ? `Hello ${restaurant.name}, I'd like to make a table reservation.`
    : `Halo ${restaurant.name}, saya ingin membuat reservasi meja.`
  const text = encodeURIComponent(message || defaultMsg)
  return `https://wa.me/${phone}?text=${text}`
}

export function getPhoneUrl(): string {
  return `tel:${restaurant.location.phone.replace(/\s/g, '')}`
}
