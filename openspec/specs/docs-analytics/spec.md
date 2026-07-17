# docs-analytics Specification

## Purpose
Medición de tráfico con Google Analytics para la web de docs: carga del tag oficial de gtag.js (ID de medición `G-4KC2SY5E0K`) y tracking de page views en la navegación SPA por cambio de ruta.

## Requirements

### Requirement: La web de docs carga Google Analytics con el tag oficial de gtag.js

`docs/index.html` SHALL incluir en el `<head>` el snippet oficial de Google tag (gtag.js) con el ID de medición `G-4KC2SY5E0K`: el `<script async>` que carga `https://www.googletagmanager.com/gtag/js?id=G-4KC2SY5E0K` y el script inline que inicializa `dataLayer`, define `gtag`, ejecuta `gtag('js', new Date())` y `gtag('config', 'G-4KC2SY5E0K')`. La carga SHALL ser asíncrona y no bloquear el render de la app.

#### Scenario: Page view inicial

- **WHEN** un usuario abre cualquier URL de la web de docs con gtag.js cargado correctamente
- **THEN** GA SHALL recibir un `page_view` de la carga inicial del documento, enviado por el propio snippet de configuración

#### Scenario: El tag no bloquea la app

- **WHEN** el navegador no puede descargar gtag.js (sin red hacia Google, bloqueador de anuncios)
- **THEN** la app de docs SHALL renderizar y navegar con normalidad, sin errores no capturados en consola

### Requirement: La navegación SPA registra un page view por cambio de ruta

La app SHALL enviar a GA un evento `page_view` (con `page_path`, `page_location` y `page_title`) cada vez que cambia la ruta del router (navegación entre home y componentes, o cambio de idioma), sin duplicar el `page_view` inicial que ya envía el snippet. El envío SHALL ser un no-op cuando `window.gtag` no está disponible y cuando la app corre en modo desarrollo.

#### Scenario: Navegación entre componentes

- **WHEN** el usuario navega de `/es/components/tilt-card` a `/es/components/dock` usando el sidebar
- **THEN** la app SHALL enviar exactamente un `page_view` con `page_path` `/es/components/dock`

#### Scenario: Sin doble conteo en la carga inicial

- **WHEN** el usuario abre `/es/components/tilt-card` directamente (deep link)
- **THEN** GA SHALL recibir exactamente un `page_view` para esa vista (el del snippet), y el hook de la SPA NO SHALL enviar otro en el primer render

#### Scenario: gtag bloqueado

- **WHEN** `window.gtag` no existe (script bloqueado) y el usuario navega entre vistas
- **THEN** la app SHALL continuar funcionando sin lanzar errores

#### Scenario: Modo desarrollo

- **WHEN** la app corre con `vite dev` (`import.meta.env.DEV`) y el usuario navega entre vistas
- **THEN** el hook NO SHALL enviar eventos `page_view` a GA
