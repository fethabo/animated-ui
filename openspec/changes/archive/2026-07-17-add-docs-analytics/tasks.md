## 1. Tag de Google Analytics

- [x] 1.1 Agregar el snippet oficial de gtag.js (ID `G-4KC2SY5E0K`) al `<head>` de `docs/index.html`, antes del `<script type="module">` de la app

## 2. Page views en navegación SPA

- [x] 2.1 Crear `docs/src/analytics.ts` con `trackPageView(path: string)`: no-op si `import.meta.env.DEV` o si `typeof window.gtag !== 'function'`; si no, envía `gtag('event', 'page_view', { page_path, page_location, page_title })`. Incluir el `declare global` para tipar `window.gtag` y `window.dataLayer`
- [x] 2.2 En `docs/src/layout/Layout.tsx`, agregar un `useEffect` sobre `useLocation()` que llame a `trackPageView(pathname)` en cada cambio de ruta, saltando el primer render con un ref (el page view inicial lo envía el snippet)

## 3. Verificación

- [x] 3.1 Correr `npx eslint` sobre los archivos modificados de `docs/` y corregir errores (repo sin ESLint configurado: paso omitido, ver `fix-border-beam-corner-mask`)
- [x] 3.2 Build de la docs (`npm run build` en `docs/`) sin errores, y verificar en el HTML generado que el snippet gtag quedó en el `<head>` — `npm run build` OK; `dist/index.html` contiene el snippet completo con el ID `G-4KC2SY5E0K` dentro de `<head>`
- [x] 3.3 Prueba manual con preview: con `window.dataLayer` en consola, navegar entre dos componentes y verificar que se pushea un `page_view` por navegación y ninguno duplicado en la carga inicial (en dev el hook no envía; verificar con build+preview o inspeccionando el guard) — verificado con Playwright sobre `vite preview`: deep-link inicial a `/es/components/tilt-card` → 0 eventos `page_view` en `dataLayer` (guard del primer render funciona); nav SPA a `dock` → 1 evento nuevo; nav SPA a `marquee` → otro evento nuevo, sin duplicados ni errores de consola
