export type ThemeName = 'steakhouse' | 'seafood' | 'coffee' | 'bakery'

export interface Theme {
  name: ThemeName
  label: string
  cssVars: Record<string, string>
}

export const themes: Record<ThemeName, Theme> = {
  steakhouse: {
    name: 'steakhouse',
    label: 'Steakhouse',
    cssVars: {
      '--color-brand-50': '#fdf8f0',
      '--color-brand-100': '#faefd9',
      '--color-brand-200': '#f4dbb0',
      '--color-brand-300': '#ecc07d',
      '--color-brand-400': '#e29f48',
      '--color-brand-500': '#d4822b',
      '--color-brand-600': '#c06b20',
      '--color-brand-700': '#9f531d',
      '--color-brand-800': '#81421e',
      '--color-brand-900': '#6a381c',
      '--color-accent': '#c8963c',
      '--color-accent-light': '#e8b96a',
      '--color-accent-dark': '#9a6e25',
      '--color-surface': '#0d0b08',
      '--color-surface-elevated': '#1a1510',
      '--color-surface-overlay': '#221c14',
    },
  },
  seafood: {
    name: 'seafood',
    label: 'Seafood',
    cssVars: {
      '--color-brand-50': '#f0f9ff',
      '--color-brand-100': '#e0f2fe',
      '--color-brand-200': '#bae6fd',
      '--color-brand-300': '#7dd3fc',
      '--color-brand-400': '#38bdf8',
      '--color-brand-500': '#0ea5e9',
      '--color-brand-600': '#0284c7',
      '--color-brand-700': '#0369a1',
      '--color-brand-800': '#075985',
      '--color-brand-900': '#0c4a6e',
      '--color-accent': '#06b6d4',
      '--color-accent-light': '#67e8f9',
      '--color-accent-dark': '#0e7490',
      '--color-surface': '#040d14',
      '--color-surface-elevated': '#081824',
      '--color-surface-overlay': '#0c2236',
    },
  },
  coffee: {
    name: 'coffee',
    label: 'Coffee',
    cssVars: {
      '--color-brand-50': '#fdf6f0',
      '--color-brand-100': '#fae8d8',
      '--color-brand-200': '#f3cfaf',
      '--color-brand-300': '#e8ae7e',
      '--color-brand-400': '#db8b4d',
      '--color-brand-500': '#c97030',
      '--color-brand-600': '#b45924',
      '--color-brand-700': '#964521',
      '--color-brand-800': '#7a3720',
      '--color-brand-900': '#65301e',
      '--color-accent': '#a0522d',
      '--color-accent-light': '#c8845a',
      '--color-accent-dark': '#7a3820',
      '--color-surface': '#0c0906',
      '--color-surface-elevated': '#1a1208',
      '--color-surface-overlay': '#231a0d',
    },
  },
  bakery: {
    name: 'bakery',
    label: 'Bakery',
    cssVars: {
      '--color-brand-50': '#fffbf0',
      '--color-brand-100': '#fef3d8',
      '--color-brand-200': '#fce5a8',
      '--color-brand-300': '#f9d070',
      '--color-brand-400': '#f5ba3a',
      '--color-brand-500': '#e8a015',
      '--color-brand-600': '#cc820d',
      '--color-brand-700': '#a8630e',
      '--color-brand-800': '#8a4e12',
      '--color-brand-900': '#724113',
      '--color-accent': '#d4921c',
      '--color-accent-light': '#f0b84a',
      '--color-accent-dark': '#a87015',
      '--color-surface': '#0d0c08',
      '--color-surface-elevated': '#1c1a0f',
      '--color-surface-overlay': '#26240f',
    },
  },
}

export function getThemeCssVars(themeName: ThemeName): string {
  const theme = themes[themeName]
  return Object.entries(theme.cssVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ')
}
