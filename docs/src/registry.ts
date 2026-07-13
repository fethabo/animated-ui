import registryData from './registry.json'

export type Category = (typeof registryData.categories)[number]

export interface ComponentEntry {
  /** Kebab-case, igual al subpath export del paquete y al segmento de URL. */
  slug: string
  /** Nombre exportado del componente (PascalCase). */
  name: string
  category: Category
}

export const categories: readonly Category[] = registryData.categories

export const components: readonly ComponentEntry[] = registryData.components

export function componentBySlug(slug: string | undefined): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug)
}

export function componentsByCategory(category: Category): ComponentEntry[] {
  return components.filter((c) => c.category === category)
}
