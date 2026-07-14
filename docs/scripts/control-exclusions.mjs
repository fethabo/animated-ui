// Qué props NO exigen un control en el panel de un demo (validación de cobertura
// en build-content.mjs). Todo lo demás debe tener control.

// Excluidas globalmente por nombre: contenido, refs, opacas, estructura.
// `respectReducedMotion` la inyecta el ControlPanel en TODO demo, así que no
// hace falta declararla en cada `controls`.
export const GLOBAL_EXCLUDE = new Set([
  'children',
  'className',
  'style',
  'seed',
  'target',
  'src',
  'alt',
  'respectReducedMotion',
])

// Excluidas por heurística de tipo (desde props.json `type`):
// funciones (callbacks) y nodos/elementos React no tienen input razonable.
export function isExcludedByType(type) {
  if (!type) return false
  return (
    type.includes('=>') || // función
    /\bReactNode\b/.test(type) ||
    /\bElementType\b/.test(type) ||
    /\bReactElement\b/.test(type)
  )
}

// Excluidas por componente: props de contenido/estructura específicas que no
// se controlan (el contenido del demo es fijo; solo se varían props de efecto).
export const CONTROLS_EXCLUDE = {
  'rotating-text': ['words'],
  'typewriter-text': ['text', 'cursor'],
  'scramble-text': ['text', 'charset'],
  'split-reveal': ['text'],
  'text-scroll-reveal': ['as', 'offset'], // offset es tupla [number, number]
  'count-up': ['value', 'prefix', 'suffix', 'separator'],
  'wavy-text': ['as'],
  'glitch-text': ['as'],
  'matrix-rain': ['charset'],
  'pixel-background': ['cellColor'], // callback
  'emoji-burst': ['emojis', 'origin'],
  'confetti-burst': ['origin'], // objeto {x, y}
  'fireworks-burst': ['origin'],
  'sparkle-burst': ['origin'],
  'tesla-coil': ['origin'],
  'horizontal-scroll-section': ['easing'], // función
  'animated-list': ['as', 'itemClassName', 'itemStyle'],
  'glow-border': ['contentClassName', 'contentStyle'],
  'image-trail': ['images', 'imageClassName', 'imageStyle'], // contenido/estructura
}

export function excludedProps(slug) {
  return new Set(CONTROLS_EXCLUDE[slug] ?? [])
}
