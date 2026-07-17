declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Page view de navegación SPA (cambios de ruta post-montaje). No-op en dev y
 * si gtag no cargó (bloqueadores de anuncios): el snippet de index.html ya
 * envía el page_view de la carga inicial, este helper no debe duplicarlo.
 */
export function trackPageView(path: string): void {
  if (import.meta.env.DEV) return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
