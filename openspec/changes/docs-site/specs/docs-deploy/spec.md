# docs-deploy

## ADDED Requirements

### Requirement: El build produce un sitio estático servible en Apache con URLs limpias

`docs/` SHALL buildear a un directorio estático autocontenido que incluya un `.htaccess` con rewrite de rutas no-archivo a `index.html`, de modo que las rutas de la SPA (`/es/components/<slug>`) funcionen con acceso directo y recarga en el hosting Apache (Hostinger).

#### Scenario: Recarga de una ruta profunda en el hosting

- **WHEN** el usuario recarga `https://<host>/en/components/marquee` en el servidor de producción
- **THEN** el servidor SHALL responder `index.html` y la app SHALL renderizar la vista de Marquee (no un 404)

### Requirement: El deploy está atado al release y refleja solo lo publicado

La publicación de la docs SHALL dispararse desde el flujo de release (tag/release publicada), buildeando la librería y la docs desde ese tag y subiendo el resultado al hosting. La web NO SHALL deployarse desde estados intermedios de `main`, de modo que nunca muestre componentes aún no publicados en npm.

#### Scenario: Release nueva

- **WHEN** se publica la versión X.Y.Z del paquete
- **THEN** el pipeline SHALL buildear la docs desde ese tag y actualizar el sitio, y el header SHALL mostrar X.Y.Z

#### Scenario: Merge a main sin release

- **WHEN** se mergea a `main` un componente nuevo sin publicar release
- **THEN** el sitio en producción NO SHALL cambiar

### Requirement: Existe un deploy manual documentado como fallback

El repo SHALL incluir un comando documentado (`docs:deploy` o equivalente) que permita buildear y subir la docs manualmente con las mismas garantías (build desde un tag), para usar ante fallas del pipeline automático.

#### Scenario: Pipeline caído

- **WHEN** el workflow automático falla tras una release
- **THEN** un mantenedor SHALL poder publicar el mismo build con el comando manual documentado en el README de `docs/`
