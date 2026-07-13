import { useParams } from 'react-router-dom'
import type { Category } from '../registry'
import { isLang, type Lang } from './lang'

/**
 * Diccionario del chrome de la UI. La interface obliga a que ES y EN tengan
 * exactamente las mismas claves: una clave faltante es error de typecheck,
 * y el typecheck corre en prebuild — la spec de "traducción faltante rompe
 * el build" queda cubierta por el compilador.
 */
interface Dict {
  siteTagline: string
  navHome: string
  searchPlaceholder: string
  onGitHub: string
  categories: Record<Category, string>
  demo: string
  examples: string
  usageTab: string
  standaloneTab: string
  copy: string
  copied: string
  props: string
  propName: string
  propType: string
  propDefault: string
  propDescription: string
  required: string
  noDefault: string
  previous: string
  next: string
  notFoundTitle: string
  notFoundBody: string
  homeHeroTitle: string
  homeHeroSubtitle: string
  homeComponentsCount: (n: number) => string
}

const es: Dict = {
  siteTagline: 'Componentes React animados, livianos y zero-config',
  navHome: 'Inicio',
  searchPlaceholder: 'Filtrar componentes…',
  onGitHub: 'Ver en GitHub',
  categories: {
    backgrounds: 'Fondos',
    'cards-mouse': 'Tarjetas & Mouse',
    text: 'Texto',
    'scroll-parallax': 'Scroll & Parallax',
    'cursor-idle': 'Cursor & Idle',
    celebration: 'Celebración',
    'svg-decoration': 'SVG & Decoración',
    'layout-navigation': 'Layout & Navegación',
  },
  demo: 'Demo',
  examples: 'Ejemplos',
  usageTab: 'Con el paquete',
  standaloneTab: 'Standalone (copy-paste)',
  copy: 'Copiar',
  copied: '¡Copiado!',
  props: 'Props',
  propName: 'Prop',
  propType: 'Tipo',
  propDefault: 'Default',
  propDescription: 'Descripción',
  required: 'requerida',
  noDefault: '—',
  previous: 'Anterior',
  next: 'Siguiente',
  notFoundTitle: 'Componente no encontrado',
  notFoundBody: 'No existe ningún componente con ese nombre en esta versión.',
  homeHeroTitle: 'animated-ui',
  homeHeroSubtitle:
    'Componentes React animados con cero dependencias de runtime, tree-shakeables y personalizables vía CSS custom properties.',
  homeComponentsCount: (n) => `${n} componentes`,
}

const en: Dict = {
  siteTagline: 'Lightweight, zero-config animated React components',
  navHome: 'Home',
  searchPlaceholder: 'Filter components…',
  onGitHub: 'View on GitHub',
  categories: {
    backgrounds: 'Backgrounds',
    'cards-mouse': 'Cards & Mouse',
    text: 'Text',
    'scroll-parallax': 'Scroll & Parallax',
    'cursor-idle': 'Cursor & Idle',
    celebration: 'Celebration',
    'svg-decoration': 'SVG & Decoration',
    'layout-navigation': 'Layout & Navigation',
  },
  demo: 'Demo',
  examples: 'Examples',
  usageTab: 'With the package',
  standaloneTab: 'Standalone (copy-paste)',
  copy: 'Copy',
  copied: 'Copied!',
  props: 'Props',
  propName: 'Prop',
  propType: 'Type',
  propDefault: 'Default',
  propDescription: 'Description',
  required: 'required',
  noDefault: '—',
  previous: 'Previous',
  next: 'Next',
  notFoundTitle: 'Component not found',
  notFoundBody: 'No component with that name exists in this version.',
  homeHeroTitle: 'animated-ui',
  homeHeroSubtitle:
    'Animated React components with zero runtime dependencies, tree-shakeable and customizable via CSS custom properties.',
  homeComponentsCount: (n) => `${n} components`,
}

const dicts: Record<Lang, Dict> = { es, en }

/** Idioma activo desde la ruta. Solo usable bajo `/:lang/...`. */
export function useLang(): Lang {
  const { lang } = useParams()
  return isLang(lang) ? lang : 'en'
}

/** Diccionario del idioma activo. */
export function useT(): Dict {
  return dicts[useLang()]
}
