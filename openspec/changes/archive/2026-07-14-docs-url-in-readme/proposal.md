## Why

La web de documentación de `@fethabo/animated-ui` ya está publicada en `https://animated-ui-docs.fethabo.cloud`, pero ni el README ni la metadata del paquete la enlazan: el README solo apunta a la carpeta local [`docs/`](docs/) y el campo `homepage` de `package.json` apunta al README de GitHub. Un usuario que llega desde npm no tiene forma de descubrir la documentación interactiva online (demos vivos, ejemplos copiables) de la última versión.

## What Changes

- **README**: reemplazar/ampliar la línea de "Documentación interactiva" para enlazar la URL online (`https://animated-ui-docs.fethabo.cloud`), aclarando que ahí se ve la documentación completa y los ejemplos de la última versión publicada, además del código en `docs/`.
- **package.json**: apuntar el campo `homepage` a la URL de la documentación online (hoy apunta a `…/github…#readme`), para que el link "homepage" de la página de npm lleve a la documentación.

Cambio doc-only: no toca el código del paquete ni su API pública.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `readme-docs`: se agrega el requerimiento de que el README (y la metadata de descubrimiento del paquete) enlacen la documentación online publicada, no solo la carpeta local.

## Impact

- **Archivos afectados**: `README.md` (línea de documentación), `package.json` (campo `homepage`).
- **Sin impacto** en el código del paquete, el build, ni el test-app.
- **Dependencia externa**: la URL `https://animated-ui-docs.fethabo.cloud` debe estar sirviendo la documentación (ya desplegada).
