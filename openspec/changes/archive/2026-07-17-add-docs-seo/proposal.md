## Why

La web de docs (`https://animated-ui-docs.fethabo.cloud`) no tiene ningún trabajo de SEO: un único `<title>` estático para todas las vistas, sin meta description, sin canonical/hreflang pese a ser bilingüe, y sin `sitemap.xml`/`robots.txt`. Eso limita el descubrimiento orgánico de la librería, que es el canal principal para que lleguen usuarios nuevos. Complementa el change `add-docs-analytics`: sin tráfico orgánico medible, analytics tiene poco que medir.

## What Changes

- Título y meta description únicos por vista e idioma (home y cada componente), actualizados en la navegación SPA.
- `link rel="canonical"` y alternates `hreflang` (es, en, x-default) por ruta, coherentes con el i18n por segmento de URL.
- Metadatos base Open Graph / Twitter card en `docs/index.html` (título, descripción, URL, tipo).
- Generación en build de `sitemap.xml` (todas las rutas: home y componentes × ambos idiomas, derivadas de `registry.json`) y `robots.txt` con la directiva `Sitemap`.
- `lang` correcto en el documento según el idioma activo.

## Capabilities

### New Capabilities

- `docs-seo`: metadatos por vista (title, description, canonical, hreflang, Open Graph), sitemap y robots de la web de documentación.

### Modified Capabilities

<!-- Sin cambios de requirements en capabilities existentes: docs-site, docs-i18n y docs-deploy
     conservan su comportamiento; el sitemap/robots son archivos estáticos nuevos que el build
     ya sirve tal cual (nginx sirve archivos existentes antes del fallback SPA). -->

## Impact

- `docs/index.html`: meta description base + tags Open Graph/Twitter estáticos.
- `docs/src/`: hook/helper de metadatos por ruta (sin dependencias nuevas — no se agrega react-helmet ni similar) usado por las vistas de home y componente.
- `docs/scripts/`: script de build que genera `sitemap.xml` y `robots.txt` desde `registry.json`.
- Limitación conocida (se detalla en design): al ser una SPA client-rendered, los scrapers de redes sociales que no ejecutan JS verán solo los OG tags base de `index.html`; el prerender por ruta queda explícitamente fuera de alcance.
