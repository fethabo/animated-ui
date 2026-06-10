/**
 * Genera el ID estable de un style tag inyectado.
 * Formato: `aui-<name>-styles` (e.g. `aui-animated-background-styles`).
 */
export function styleId(name: string): string {
  return `aui-${name}-styles`
}

/**
 * Inyecta un bloque de CSS en el `<head>` del documento.
 *
 * - Deduplica por ID: si ya existe un elemento con ese ID, no hace nada.
 *   Múltiples instancias del mismo componente comparten un único style tag.
 * - SSR-safe: si `document` no existe (render en servidor), retorna sin
 *   efecto. Los componentes la llaman desde `useEffect`, que nunca corre
 *   en SSR, pero el guard protege contra usos directos.
 */
export function injectStyles(id: string, css: string): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}
