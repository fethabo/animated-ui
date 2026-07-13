## ADDED Requirements

### Requirement: TextScrollReveal enciende las palabras progresivamente según el scroll

`TextScrollReveal` SHALL partir su texto por palabra y ligar el "encendido" de cada palabra (transición de un estado apagado a uno encendido) al progreso de scroll del contenedor a través del viewport. El progreso SHALL escribirse como una única CSS custom property de progreso (0→1) en el root via el scroll-driver del paquete; cada palabra SHALL resolver su estado con `calc()` a partir de su índice, sin JavaScript por palabra por frame y sin React state en el hot path. El tracking de scroll SHALL activarse solo con el contenedor cerca del viewport.

#### Scenario: Encendido progresivo

- **WHEN** el usuario scrollea y el contenedor avanza por el viewport
- **THEN** las palabras SHALL encenderse en orden, proporcionalmente al progreso de scroll

#### Scenario: Scroll reversible

- **WHEN** el usuario scrollea hacia atrás
- **THEN** las palabras SHALL volver a su estado apagado en orden inverso

#### Scenario: Sin trabajo fuera del viewport

- **WHEN** el contenedor está lejos del viewport
- **THEN** el componente NO SHALL ejecutar trabajo por frame

### Requirement: TextScrollReveal es customizable via props y CSS custom properties

`TextScrollReveal` SHALL exponer props para el estado apagado y encendido (`fromOpacity`, `toOpacity`, y opcionalmente `fromColor`/`toColor`) y para el rango de progreso (`offset`: en qué porción del recorrido por el viewport ocurre el encendido). Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-text-scroll-*` en el root, pisables desde CSS en cascada.

#### Scenario: Opacidad apagada configurable

- **WHEN** el consumer pasa `fromOpacity={0.15}`
- **THEN** las palabras no encendidas SHALL renderizarse con opacidad 0.15

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-parrafo { --aui-text-scroll-from-opacity: 0.3; }`
- **THEN** el valor de la cascada SHALL prevalecer sobre el default

### Requirement: TextScrollReveal preserva la accesibilidad del texto

El texto completo SHALL exponerse en `aria-label` sobre el elemento root y las unidades particionadas SHALL marcarse `aria-hidden`, siguiendo el patrón de `SplitReveal`. El split NO SHALL romper la selección/copia razonable del texto ni introducir espacios duplicados.

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el componente
- **THEN** SHALL anunciar el texto completo una sola vez, sin fragmentación por palabra

### Requirement: TextScrollReveal respeta prefers-reduced-motion

`TextScrollReveal` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el texto SHALL renderizarse completamente encendido y estático, sin tracking de scroll.

#### Scenario: Texto visible sin animación

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** todas las palabras SHALL verse en su estado encendido, sin cambios al scrollear

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el encendido progresivo SHALL operar aunque la preferencia esté activa

### Requirement: TextScrollReveal es SSR-safe y extensible

`TextScrollReveal` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL aceptar `className`, `style`, la prop `as` (elemento root, default `p`) y el spread de props HTML válidas del root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el markup SHALL contener el texto completo
