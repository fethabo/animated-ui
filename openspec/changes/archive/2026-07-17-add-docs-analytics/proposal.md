## Why

Hoy no hay ninguna visibilidad sobre el uso de la web de documentación (visitas, componentes más consultados, idiomas). Agregar Google Analytics (gtag, propiedad `G-4KC2SY5E0K`) permite medir tráfico real y priorizar el roadmap de la librería con datos.

## What Changes

- Agregar el snippet oficial de Google tag (gtag.js) con el ID `G-4KC2SY5E0K` al `<head>` de `docs/index.html`.
- Agregar tracking de `page_view` en navegación SPA: la docs usa history routing (React Router), por lo que sin esto GA solo registraría la carga inicial y no la navegación entre componentes.
- Sin cambios en el paquete `@fethabo/animated-ui` (solo la app de docs; cero dependencias nuevas de runtime en la librería y ninguna dependencia npm nueva en la docs — gtag se carga desde el CDN de Google).

## Capabilities

### New Capabilities

- `docs-analytics`: medición de tráfico de la web de documentación con Google Analytics — carga del tag gtag.js y registro de page views tanto en la carga inicial como en cada cambio de ruta de la SPA.

### Modified Capabilities

<!-- Sin cambios de requirements en capabilities existentes. `docs-site` no cambia su comportamiento observable de navegación/render; analytics es una capability nueva ortogonal. -->

## Impact

- `docs/index.html`: se agrega el snippet gtag en el `<head>`.
- `docs/src/` (layout/routing): pequeño hook o efecto que envía `page_view` a gtag en cada cambio de `location` (no-op si `gtag` no está disponible, p. ej. con bloqueadores de anuncios).
- Sin impacto en `src/` (librería), builds ni release. El deploy de docs no cambia.
- Privacidad: se empieza a enviar telemetría de visitantes a Google Analytics desde la web pública de docs.
