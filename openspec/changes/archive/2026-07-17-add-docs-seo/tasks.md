## 1. Metadatos base en el HTML

- [x] 1.1 Agregar a `docs/index.html` la `<meta name="description">` base y los tags estáticos `og:title`, `og:description`, `og:site_name`, `og:type`, `og:url` y `twitter:card` con los valores genéricos del sitio (en inglés)

## 2. Metadatos por ruta (SPA)

- [x] 2.1 Crear `docs/src/seo.ts` con la constante `SITE_URL` (`https://animated-ui-docs.fethabo.cloud`) y el hook `useSeo({ title, description, path, lang })` que actualiza `document.title`, meta description, canonical, alternates hreflang (es/en/x-default→en) y `og:title`/`og:description`/`og:url`, reemplazando los nodos existentes en cada navegación (sin acumular)
- [x] 2.2 Sincronizar `document.documentElement.lang` con el idioma activo en el `Layout`
- [x] 2.3 Llamar a `useSeo` en `HomePage` (título y descripción del sitio desde el diccionario i18n) y en `ComponentPage` (título `<Nombre> — animated-ui`, description desde la primera línea de la prosa traducida con fallback al genérico)

## 3. Sitemap y robots

- [x] 3.1 Crear `docs/scripts/build-seo.mjs` que lea `registry.json` y genere en `docs/public/`: `sitemap.xml` (home + componentes × es/en, con alternates `xhtml:link` por entrada) y `robots.txt` con `Sitemap: <SITE_URL>/sitemap.xml`
- [x] 3.2 Encadenar el script en el `npm run build` (y `dev` si aplica) de `docs/package.json`, y agregar `docs/public/sitemap.xml` y `docs/public/robots.txt` al `.gitignore`

## 4. Verificación

- [x] 4.1 Correr `npx eslint` sobre los archivos modificados de `docs/` y corregir errores (repo sin ESLint configurado: paso omitido, ver `fix-border-beam-corner-mask`)
- [x] 4.2 Build de la docs sin errores; verificar que `dist/` contiene `sitemap.xml` (con todas las rutas de ambos idiomas) y `robots.txt` — `npm run build` OK (prebuild + tsc --noEmit + vite build), `dist/sitemap.xml` con 102 URLs (home + 50 componentes × es/en) y `dist/robots.txt` presentes
- [x] 4.3 Prueba manual con preview: navegar home → componente → cambio de idioma verificando en el inspector title, description, canonical, hreflang y `html lang` correctos, y que no se acumulan tags tras varias navegaciones — verificado con Playwright sobre `vite preview`: home /es, /es/components/border-beam, cambio a EN (SPA) y navegación a /en/components/dock, todos con title/description/canonical/hreflang/`html lang` correctos y exactamente 1 canonical + 3 alternates en cada vista (sin acumulación), 0 errores de consola
