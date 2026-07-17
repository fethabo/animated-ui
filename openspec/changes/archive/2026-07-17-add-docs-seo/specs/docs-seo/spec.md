## ADDED Requirements

### Requirement: Cada vista tiene title y meta description propios por idioma

Cada vista de la docs SHALL establecer un `document.title` único (home: nombre del sitio + tagline; componente: `<Nombre> — animated-ui`) y una `<meta name="description">` propia en el idioma activo (home: descripción del sitio desde el diccionario i18n; componente: derivada de su prosa traducida, con fallback a la descripción genérica del sitio). Ambos SHALL actualizarse en la navegación SPA sin recarga.

#### Scenario: Vista de componente en español

- **WHEN** el usuario navega a `/es/components/tilt-card`
- **THEN** `document.title` SHALL ser `TiltCard — animated-ui` y la meta description SHALL estar en español y referirse a TiltCard

#### Scenario: Cambio de idioma

- **WHEN** el usuario cambia de ES a EN en una vista de componente
- **THEN** la meta description SHALL actualizarse al inglés sin recarga de página

### Requirement: Cada ruta expone canonical y alternates hreflang

Cada vista SHALL exponer un `<link rel="canonical">` auto-referente con la URL absoluta bajo `https://animated-ui-docs.fethabo.cloud`, y `<link rel="alternate" hreflang>` para `es`, `en` y `x-default` (apuntando a la variante `en`) de la misma vista. Los tags SHALL reemplazarse (no acumularse) en cada navegación. Además, `document.documentElement.lang` SHALL reflejar el idioma activo.

#### Scenario: Canonical y alternates de una vista

- **WHEN** el usuario está en `/es/components/dock`
- **THEN** el canonical SHALL ser `https://animated-ui-docs.fethabo.cloud/es/components/dock` y SHALL existir exactamente un alternate por cada uno de `es`, `en` y `x-default` apuntando a la vista dock

#### Scenario: Sin tags acumulados tras navegar

- **WHEN** el usuario navega por tres vistas sucesivas
- **THEN** el documento SHALL contener exactamente un canonical y un set de alternates (los de la vista actual)

### Requirement: El sitio tiene metadatos Open Graph y Twitter card base

`docs/index.html` SHALL incluir estáticamente `og:title`, `og:description`, `og:site_name`, `og:type`, `og:url` y `twitter:card` con los valores genéricos del sitio, de modo que los scrapers que no ejecutan JS obtengan una card válida para cualquier URL. En las vistas, `og:title`, `og:description` y `og:url` SHALL actualizarse por ruta en el cliente.

#### Scenario: Scraper sin JS

- **WHEN** un scraper que no ejecuta JavaScript pide `/en/components/marquee`
- **THEN** el HTML servido SHALL contener los OG tags base del sitio (card genérica válida)

### Requirement: El build genera sitemap.xml y robots.txt desde el registry

El build de la docs SHALL generar `sitemap.xml` con las URLs absolutas de la home y de cada componente de `registry.json`, en ambos idiomas, incluyendo los alternates `xhtml:link` hreflang por entrada; y un `robots.txt` que permita el crawling completo y declare la ubicación del sitemap. Ambos SHALL quedar servidos en la raíz del sitio como archivos estáticos (sin pasar por el fallback SPA) y SHALL regenerarse en cada build.

#### Scenario: Componente nuevo publicado

- **WHEN** se agrega un componente al `registry.json` y se buildea la docs
- **THEN** `sitemap.xml` SHALL incluir las URLs `/es/components/<slug>` y `/en/components/<slug>` sin ningún paso manual

#### Scenario: robots.txt accesible

- **WHEN** un crawler pide `https://animated-ui-docs.fethabo.cloud/robots.txt`
- **THEN** el servidor SHALL responder el archivo estático con la línea `Sitemap: https://animated-ui-docs.fethabo.cloud/sitemap.xml`
