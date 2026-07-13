/**
 * Generates the stable ID of an injected style tag.
 * Format: `aui-<name>-styles` (e.g. `aui-animated-background-styles`).
 */
export function styleId(name: string): string {
  return `aui-${name}-styles`
}

/**
 * Injects a CSS block into the document's `<head>`.
 *
 * - Deduplicates by ID: if an element with that ID already exists, it does
 *   nothing. Multiple instances of the same component share a single style tag.
 * - SSR-safe: if `document` does not exist (server render), it returns with
 *   no effect. Components call it from `useEffect`, which never runs during
 *   SSR, but the guard protects against direct usage.
 */
export function injectStyles(id: string, css: string): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}
