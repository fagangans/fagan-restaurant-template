import idTranslations from '@/content/translations/id.json'
import enTranslations from '@/content/translations/en.json'

export type Locale = 'id' | 'en'

export type Translations = typeof idTranslations

const translations: Record<Locale, Translations> = {
  id: idTranslations,
  en: enTranslations,
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.id
}

/** Interpolate {key} placeholders: t('hello {name}', { name: 'World' }) */
export function interpolate(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}
