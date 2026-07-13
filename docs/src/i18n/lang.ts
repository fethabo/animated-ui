export const LANGS = ['es', 'en'] as const
export type Lang = (typeof LANGS)[number]

const STORAGE_KEY = 'aui-docs-lang'

export function isLang(value: string | undefined): value is Lang {
  return LANGS.includes(value as Lang)
}

/** Idioma preferido: última selección persistida → navigator.language → 'en'. */
export function preferredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isLang(stored ?? undefined)) return stored as Lang
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function persistLang(lang: Lang): void {
  localStorage.setItem(STORAGE_KEY, lang)
}
