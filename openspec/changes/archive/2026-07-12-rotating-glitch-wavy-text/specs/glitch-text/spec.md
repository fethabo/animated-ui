## ADDED Requirements

### Requirement: GlitchText aplica un glitch RGB-split intermitente con CSS puro

`GlitchText` SHALL renderizar un texto plano (string) con un efecto glitch de separación de canales de color: dos capas desplazadas del mismo texto (via pseudo-elementos con `content: attr(data-text)`) recortadas con `clip-path` animado, más jitter posicional intermitente. El efecto SHALL implementarse con CSS puro inyectado, sin JavaScript por frame. El glitch SHALL ser intermitente (ráfagas breves separadas por pausas), no continuo.

#### Scenario: Glitch intermitente

- **WHEN** el componente está montado con el modo default
- **THEN** el texto SHALL mostrar ráfagas breves de glitch separadas por períodos estables

#### Scenario: Solo texto plano

- **WHEN** el consumer pasa `children` que no es un string
- **THEN** el componente SHALL tipar `children` como `string` (el markup arbitrario no es soportado por la duplicación via `attr(data-text)`)

### Requirement: GlitchText soporta modos loop y hover

`GlitchText` SHALL exponer `trigger` con valores `loop` (default; glitch intermitente autónomo) y `hover` (el glitch SHALL activarse únicamente mientras el cursor está sobre el texto).

#### Scenario: Glitch solo en hover

- **WHEN** el consumer pasa `trigger="hover"` y el cursor no está sobre el texto
- **THEN** el texto SHALL verse estable, y el glitch SHALL activarse al entrar el cursor

### Requirement: GlitchText es accesible

Las capas del glitch SHALL vivir en pseudo-elementos (fuera del árbol de accesibilidad), de modo que el texto se lea una sola vez. El efecto NO SHALL alterar el contenido textual real del elemento.

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el componente
- **THEN** SHALL anunciar el texto una sola vez, sin duplicaciones

### Requirement: GlitchText es customizable via props y CSS custom properties

`GlitchText` SHALL exponer props para los colores de los canales desplazados (`colors`, default rojo/cyan), la intensidad del desplazamiento (`intensity`), la frecuencia de las ráfagas (`frequency`) y la duración de cada ráfaga. Los parámetros SHALL materializarse como CSS custom properties con namespace `--aui-glitch-*` en el root, pisables desde CSS en cascada.

#### Scenario: Canales custom

- **WHEN** el consumer pasa `colors={['#f0f', '#0ff']}`
- **THEN** las capas desplazadas SHALL usar esos colores

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-titulo { --aui-glitch-intensity: 6px; }`
- **THEN** el desplazamiento SHALL usar el valor de la cascada

### Requirement: GlitchText respeta prefers-reduced-motion

`GlitchText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el glitch autónomo (`trigger="loop"`) SHALL desactivarse mostrando el texto estático; el modo `hover` (respuesta a input directo) MAY permanecer activo con una versión atenuada sin jitter.

#### Scenario: Estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` con `trigger="loop"`
- **THEN** el texto SHALL renderizarse estático, sin ráfagas

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el glitch SHALL operar aunque la preferencia esté activa

### Requirement: GlitchText es SSR-safe y extensible

`GlitchText` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL aceptar `className`, `style`, la prop `as` (elemento root, default `span`) y el spread de props HTML válidas del root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el markup SHALL contener el texto
