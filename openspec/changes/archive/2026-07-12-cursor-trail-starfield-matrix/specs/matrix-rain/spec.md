## ADDED Requirements

### Requirement: MatrixRain renderiza lluvia de glifos por columnas

`MatrixRain` SHALL renderizar sobre `<canvas>` columnas de glifos que caen (code rain): cada columna mantiene una cabeza brillante que dibuja un glifo nuevo por avance, y los glifos anteriores SHALL desvanecerse mediante una veladura semitransparente del color de fondo aplicada por frame (trail sin buffer de historia). Las velocidades y los glifos SHALL derivar del PRNG seedable del paquete (`createPrng(seed)`): misma `seed` y mismo tamaño SHALL producir la misma secuencia. La grilla de columnas SHALL derivar de `fontSize` y el texto SHALL renderizarse con `fillText` y fuente monospace del sistema. El componente SHALL posicionarse `absolute, inset: 0`, o el viewport con `fixed`.

#### Scenario: Lluvia con trail

- **WHEN** el fondo está animando
- **THEN** cada columna SHALL mostrar una cabeza brillante descendiendo y una cola de glifos que se desvanece gradualmente

#### Scenario: Determinismo por seed

- **WHEN** dos instancias se montan con la misma `seed` y el mismo tamaño
- **THEN** ambas SHALL producir la misma disposición y secuencia de columnas

#### Scenario: Reinicio de columna

- **WHEN** la cabeza de una columna sale por el borde inferior
- **THEN** la columna SHALL reiniciar desde arriba tras un delay pseudoaleatorio

### Requirement: MatrixRain es customizable

`MatrixRain` SHALL aceptar `seed`, `charset` (string de glifos posibles, con default ASCII + katakana simple), `color` (color de la lluvia), `headColor` (color de la cabeza), `background`, `fontSize` (que determina la densidad de columnas), `speed` y `fixed`, además de `className` y `style`.

#### Scenario: Charset y color custom

- **WHEN** el consumer pasa `charset="01"` y `color="#22c55e"`
- **THEN** la lluvia SHALL mostrar solo ceros y unos en verde

#### Scenario: Densidad por fontSize

- **WHEN** el consumer aumenta `fontSize`
- **THEN** la cantidad de columnas SHALL disminuir proporcionalmente (palanca de performance)

### Requirement: MatrixRain respeta prefers-reduced-motion

`MatrixRain` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, SHALL pintarse un frame estático (columnas pre-dibujadas a distintas alturas con su fade), sin RAF.

#### Scenario: Frame estático

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el fondo SHALL verse como una composición estática de columnas, sin animación

### Requirement: MatrixRain es SSR-safe y extensible

`MatrixRain` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root. El canvas SHALL adaptarse al tamaño del contenedor via `useResizeObserver`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
