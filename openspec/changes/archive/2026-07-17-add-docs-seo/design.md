## Context

La docs es una SPA client-rendered (Vite + React Router, history routing) servida por nginx en `https://animated-ui-docs.fethabo.cloud`, bilingüe con el idioma como primer segmento de ruta (`/es/...`, `/en/...`, spec `docs-i18n`). Hoy el único metadato es el `<title>` estático de `docs/index.html` («animated-ui — docs») compartido por todas las vistas; no hay description, canonical, hreflang, Open Graph, sitemap ni robots. El índice de componentes vive en `docs/src/registry.json` (slug + nombre + categoría), que es la fuente natural para enumerar todas las rutas en build.

## Goals / Non-Goals

**Goals:**

- Que cada vista (home y componente, en cada idioma) tenga title, meta description, canonical y alternates hreflang propios, actualizados en la navegación SPA.
- Que Google pueda descubrir todas las rutas vía `sitemap.xml` y que exista `robots.txt`.
- Metadatos Open Graph/Twitter razonables para compartir el sitio.
- Cero dependencias npm nuevas (sin react-helmet ni similares) y cero impacto en el paquete.

**Non-Goals:**

- Prerender/SSG por ruta: los scrapers sociales que no ejecutan JS verán los OG base de `index.html` para cualquier URL. Se acepta; si se quiere OG por componente, será un change aparte (prerender en build).
- Datos estructurados JSON-LD, imágenes OG generadas por componente, Search Console/verificación.
- SEO del README o de npm.

## Decisions

**1. Hook propio `useSeo` en `docs/src/seo.ts`, sin librería.**
Un hook que recibe `{ title, description, path, lang }` y actualiza imperativamente `document.title`, `<meta name="description">`, `<link rel="canonical">`, los `<link rel="alternate" hreflang>` (es, en, `x-default` → en) y los `og:title`/`og:description`/`og:url`, reutilizando los nodos existentes (buscándolos por selector; los crea si faltan). React 19 permite hoistear `<title>`/`<meta>` desde JSX, pero el manejo de tags que deben *reemplazarse* por ruta (canonical, hreflang) queda más explícito y testeable en un helper único. Alternativa react-helmet-async: descartada, dependencia extra para un caso que son ~30 líneas.

**2. Los metadatos se declaran en las páginas, no en el Layout.**
`HomePage` y `ComponentPage` llaman a `useSeo` con su contenido: la home usa el diccionario i18n; la vista de componente usa el nombre del componente (`TiltCard — animated-ui`) y como description la primera línea de su prosa traducida (ya disponible en la vista vía el content pipeline). El Layout solo mantiene `document.documentElement.lang` sincronizado con el segmento de idioma.

**3. Base URL hardcodeada en `docs/src/seo.ts` y en el script de build.**
`https://animated-ui-docs.fethabo.cloud` como constante: hay un único deploy público y parametrizarlo por env agregaría configuración sin beneficio (mismo criterio que el ID de GA en `add-docs-analytics`).

**4. `sitemap.xml` y `robots.txt` generados en build a `docs/public/`.**
Un script `docs/scripts/build-seo.mjs` (encadenado en el `npm run build` de la docs, junto a `build-content.mjs`) lee `registry.json` y emite: `sitemap.xml` con `2 + 2×N` URLs (home y cada componente, en es y en, con `xhtml:link` alternates por entrada) y `robots.txt` con `Allow` general y la directiva `Sitemap`. Vite copia `public/` a `dist/` tal cual, y nginx sirve archivos existentes antes del fallback SPA, así que no hay cambios de deploy. Ambos archivos generados se agregan a `.gitignore` de la docs (son derivados del registry).

**5. OG base estáticos en `index.html`.**
`og:title`, `og:description`, `og:site_name`, `og:type`, `og:url` y `twitter:card` con los valores del sitio (en inglés, idioma por defecto del x-default). El hook los sobreescribe por ruta para los crawlers que ejecutan JS; para los que no, queda la card genérica del sitio — trade-off aceptado (ver Non-Goals).

## Risks / Trade-offs

- [Googlebot debe ejecutar JS para ver los metadatos por ruta] → Google renderiza SPAs de forma confiable desde hace años y el sitemap + canonical + hreflang le dan la estructura completa; si el indexado resultara pobre, el siguiente paso es prerender (change aparte).
- [Scrapers sociales sin JS muestran siempre la card genérica] → aceptado explícitamente (Non-Goal); la card base es correcta para el sitio.
- [Contenido duplicado es/en a ojos del crawler] → canonical auto-referente por idioma + pares hreflang recíprocos en páginas y sitemap indican que son alternativas, no duplicados.
- [El sitemap queda desactualizado si se agrega un componente] → se genera en cada build desde `registry.json`, la misma fuente del sidebar: no puede divergir de lo publicado.
- [Description del componente depende de la prosa traducida] → si un componente no tiene prosa (el build de i18n ya rompe en ese caso, spec `docs-i18n`), el hook cae al description genérico del sitio.
