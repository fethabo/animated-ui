## Context

La web de documentación es una SPA (Vite + React Router con `createBrowserRouter`, history routing) que vive en `docs/`. El HTML de entrada es `docs/index.html` y el layout compartido es `docs/src/layout/Layout.tsx`, montado bajo la ruta `/:lang`. Hoy no hay ninguna telemetría. Se quiere agregar Google Analytics 4 con el snippet oficial de gtag.js y la propiedad `G-4KC2SY5E0K`.

Restricción clave: gtag.js solo envía un `page_view` automático en la carga inicial del documento. Como la docs navega con `history.pushState` (sin recargas), la navegación entre componentes no generaría eventos si solo se pega el snippet.

## Goals / Non-Goals

**Goals:**

- Cargar gtag.js con el ID `G-4KC2SY5E0K` en la web de docs (snippet oficial, tal como lo entrega Google).
- Registrar `page_view` en cada cambio de ruta de la SPA (home, vistas de componente, cambio de idioma).
- Cero dependencias npm nuevas y cero impacto en el paquete `@fethabo/animated-ui`.
- Degradación silenciosa: si gtag no cargó (bloqueador de anuncios, sin red), la app funciona igual sin errores en consola.

**Non-Goals:**

- Eventos custom (clicks en "copiar", uso del filtro del sidebar, etc.) — se pueden agregar después sobre esta base.
- Banner de consentimiento de cookies / Consent Mode.
- Analytics en `test-app/` o en los ejemplos standalone.

## Decisions

**1. Snippet oficial en `docs/index.html`, no un paquete npm (react-ga4, etc.).**
El snippet `async` en el `<head>` es la integración canónica de GA4, no agrega dependencias ni peso al bundle (se carga del CDN de Google en paralelo) y es exactamente lo que pidió el usuario. Un wrapper npm solo agregaría una dependencia para hacer `dataLayer.push`.

**2. Page views de SPA con un hook sobre `useLocation` en `Layout`.**
`Layout` es el único componente compartido por todas las vistas y ya vive dentro del router, así que un `useEffect` sobre `location.pathname` cubre toda la navegación. Se envía `gtag('event', 'page_view', { page_path, page_title, page_location })` en cada cambio, **saltando el primer render** porque el snippet de `index.html` ya envía el `page_view` inicial (evita doble conteo). Alternativa considerada: `send_page_view: false` en el config y enviar todo manualmente — descartada para mantener el snippet verbatim y que la carga inicial se registre aunque React falle en montar.

**3. Helper `trackPageView` en `docs/src/analytics.ts` con guard de entorno.**
La función accede a `window.gtag` vía `typeof window.gtag === 'function'` (no-op si no existe) y no hace nada en dev (`import.meta.env.DEV`) para no contaminar la propiedad con tráfico local. Tipado local mínimo de `window.gtag`/`dataLayer` (declaración `declare global`), sin instalar `@types/gtag.js`.

**4. El ID de medición queda hardcodeado.**
`G-4KC2SY5E0K` aparece en `index.html` (snippet) y no se parametriza por env var: la docs tiene un único deploy público y el ID de GA es público por naturaleza (viaja en el HTML). Menos configuración = zero-config, coherente con el proyecto.

## Risks / Trade-offs

- [Bloqueadores de anuncios impiden cargar gtag.js] → el helper es no-op si `window.gtag` no existe; la docs funciona igual. El sub-registro de tráfico es inherente a GA y se acepta.
- [Doble conteo del primer page view] → el hook salta el primer render (ref); el `page_view` inicial lo envía solo el snippet.
- [Tráfico de desarrollo contamina las métricas] → el helper no envía eventos en dev; el `page_view` inicial del snippet sí se dispararía en `localhost`, mitigable con un filtro de `localhost` en la propiedad GA si molesta (volumen despreciable).
- [Privacidad: se envía telemetría a Google sin banner de consentimiento] → decisión asumida por el owner del sitio; si a futuro se requiere cumplimiento (GDPR, etc.), se agrega Consent Mode en un change aparte.
