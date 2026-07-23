# docs-deploy Specification

## Purpose

Definir el deploy de la web de documentación: un build estático autocontenido con fallback SPA para URLs limpias, la publicación atada al flujo de release (nunca desde estados intermedios de `main`), y un comando de deploy manual documentado como fallback ante fallas del pipeline automático.

## Requirements

### Requirement: El build produce un sitio estático con fallback SPA para URLs limpias

`docs/` SHALL buildear a un directorio estático autocontenido servible por un
servidor web con fallback SPA (rutas no-archivo → `index.html`), de modo que las
rutas de la SPA (`/es/components/<slug>`) funcionen con acceso directo y recarga
sin 404. El repo SHALL incluir la configuración de fallback documentada para el
servidor objetivo (nginx `try_files`), y un `.htaccess` equivalente para Apache.

#### Scenario: Recarga de una ruta profunda en el hosting

- **WHEN** el usuario recarga `https://<host>/en/components/marquee` en el servidor de producción
- **THEN** el servidor SHALL responder `index.html` y la app SHALL renderizar la vista de Marquee (no un 404)

#### Scenario: Configuración de servidor incluida en el repo

- **WHEN** un mantenedor prepara el servidor
- **THEN** el repo SHALL proveer un ejemplo de configuración con el fallback SPA (`deploy/nginx.conf.example`) que documente el `root` y el `try_files`

### Requirement: El deploy está atado al publish exitoso y refleja solo lo publicado

La publicación de la docs SHALL dispararse al completarse el workflow de publish
a npm, y SHALL ejecutarse solo si ese publish terminó exitosamente y fue
disparado por una release. El pipeline SHALL buildear la librería y la docs
desde el commit del tag publicado (no desde el estado actual de `main`) y subir
el resultado al hosting por SSH. La web NO SHALL deployarse desde estados
intermedios de `main` ni cuando el publish falló, de modo que nunca muestre una
versión que no existe en npm.

#### Scenario: Release nueva con publish exitoso

- **WHEN** se publica la versión X.Y.Z del paquete y el workflow de publish a npm termina en success
- **THEN** el pipeline SHALL buildear la docs desde el commit del tag X.Y.Z y actualizar el sitio, y el header SHALL mostrar X.Y.Z

#### Scenario: Publish fallido

- **WHEN** el workflow de publish a npm de la versión X.Y.Z termina en failure
- **THEN** el deploy de la docs NO SHALL ejecutarse y el sitio en producción NO SHALL cambiar

#### Scenario: Publish re-corrido tras un fallo

- **WHEN** el publish fallido de X.Y.Z se re-corre y termina en success
- **THEN** el deploy de la docs SHALL dispararse automáticamente desde el commit del tag X.Y.Z, sin intervención manual adicional

#### Scenario: Merge a main sin release

- **WHEN** se mergea a `main` un componente nuevo sin publicar release
- **THEN** el sitio en producción NO SHALL cambiar

### Requirement: Existe un deploy manual documentado como fallback

El repo SHALL incluir un comando documentado (`npm run deploy`) que permita
buildear y subir la docs manualmente por SSH/SFTP con las mismas garantías
(build desde un tag), para usar ante fallas del pipeline automático.

#### Scenario: Pipeline caído

- **WHEN** el workflow automático falla tras una release
- **THEN** un mantenedor SHALL poder publicar el mismo build con el comando manual documentado en el README de `docs/`

### Requirement: La conexión SSH del deploy tolera fallas transitorias y deja errores diagnosticables

Los pasos de red del deploy automático SHALL reintentar ante fallas transitorias
(obtención de host keys con `ssh-keyscan` y transferencia con `rsync`), con
timeout explícito y espera entre intentos, antes de marcar el job como fallido.
Los errores de estos pasos NO SHALL silenciarse (stderr visible en el log del
workflow), y el pipeline SHALL validar que `known_hosts` quedó poblado antes de
intentar la transferencia.

#### Scenario: El servidor no responde al primer intento de keyscan

- **WHEN** `ssh-keyscan` no obtiene respuesta del servidor en un intento
- **THEN** el pipeline SHALL reintentar tras una espera, y SHALL completar el deploy sin intervención manual si algún intento posterior responde

#### Scenario: Reintentos agotados

- **WHEN** todos los reintentos de un paso de red fallan
- **THEN** el job SHALL fallar con la salida de error del comando visible en el log (sin redirecciones a `/dev/null`)
