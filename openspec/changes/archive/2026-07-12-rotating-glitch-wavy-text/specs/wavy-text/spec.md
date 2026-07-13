## ADDED Requirements

### Requirement: WavyText ondula sus caracteres en loop continuo con CSS puro

`WavyText` SHALL partir su texto por carácter y animar cada uno con una ondulación vertical continua (solo `transform: translateY`, compositado), con un `animation-delay` escalonado por índice que produce el efecto de ola recorriendo el texto. El efecto SHALL implementarse con CSS puro inyectado, sin JavaScript por frame; el índice de cada carácter SHALL setearse inline una sola vez en render.

#### Scenario: Ola recorriendo el texto

- **WHEN** el componente está montado
- **THEN** los caracteres SHALL ondular con desfase progresivo, formando una ola continua de izquierda a derecha

#### Scenario: Solo transform

- **WHEN** la ondulación está activa
- **THEN** la animación SHALL operar únicamente sobre `transform`, sin alterar la métrica de línea del texto circundante

### Requirement: WavyText es customizable via props y CSS custom properties

`WavyText` SHALL exponer props para `amplitude` (desplazamiento vertical máximo), `speed` (duración de un ciclo de ola) y `stagger` (desfase entre caracteres consecutivos). Los parámetros SHALL materializarse como CSS custom properties con namespace `--aui-wavy-*` en el root, pisables desde CSS en cascada.

#### Scenario: Amplitud configurable

- **WHEN** el consumer pasa `amplitude={4}`
- **THEN** los caracteres SHALL desplazarse como máximo 4 px desde su línea base

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-texto { --aui-wavy-speed: 3s; }`
- **THEN** el ciclo de ola SHALL durar 3 segundos

### Requirement: WavyText preserva la accesibilidad del texto

El texto completo SHALL exponerse en `aria-label` sobre el root y los caracteres particionados SHALL marcarse `aria-hidden`, siguiendo el patrón de split del paquete. Los espacios SHALL preservarse sin colapsar.

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el componente
- **THEN** SHALL anunciar el texto completo una sola vez, sin fragmentación por carácter

### Requirement: WavyText respeta prefers-reduced-motion

`WavyText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el texto SHALL renderizarse estático en su línea base, sin ondulación.

#### Scenario: Estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el texto SHALL verse estático, sin animación

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la ondulación SHALL operar aunque la preferencia esté activa

### Requirement: WavyText es SSR-safe y extensible

`WavyText` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL aceptar `className`, `style`, la prop `as` (elemento root, default `span`) y el spread de props HTML válidas del root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el markup SHALL contener el texto completo
