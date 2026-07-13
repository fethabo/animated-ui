## ADDED Requirements

### Requirement: ImageTrail hace brotar imágenes siguiendo el puntero

`ImageTrail` SHALL emitir imágenes efímeras en el recorrido del puntero dentro de su contenedor: cada imagen aparece en el punto actual, anima (escala/rotación leve/fade) y se remueve sola del DOM al terminar su animación (nodo efímero autolimpiado en `animationend`, con keyframes inyectados). Las imágenes SHALL tomarse del array `images` rotando secuencialmente, y la emisión SHALL dispararse por umbral de distancia recorrida. La capa de imágenes SHALL ser `pointer-events: none` y los `children` SHALL permanecer interactivos.

#### Scenario: Emisión en el recorrido

- **WHEN** el puntero recorre el contenedor una distancia mayor al umbral con `images` provistas
- **THEN** una imagen SHALL aparecer en el punto actual, animar y removerse del DOM al terminar

#### Scenario: Rotación secuencial del pool

- **WHEN** se emiten más imágenes que las provistas en `images`
- **THEN** la selección SHALL reiniciar desde la primera (rotación cíclica en orden)

#### Scenario: Autolimpieza

- **WHEN** el puntero deja de moverse y las animaciones activas terminan
- **THEN** NO SHALL quedar nodos de imagen residuales en el DOM

### Requirement: ImageTrail precarga las imágenes

El componente SHALL precargar las URLs de `images` tras el montaje (fuera del render), para evitar jank de carga/decode en la primera emisión.

#### Scenario: Precarga tras montar

- **WHEN** el componente se monta con `images` provistas
- **THEN** las imágenes SHALL solicitarse en un efecto, antes de la primera emisión

### Requirement: ImageTrail es customizable

`ImageTrail` SHALL aceptar `images` (URLs, requerida), `size` (ancho máximo de cada imagen), `emitEvery` (umbral de distancia en px), `duration` (vida de cada imagen) y `maxConcurrent` (cap de nodos vivos; al alcanzarlo, la emisión SHALL esperar), además de `imageClassName`/`imageStyle` para estilar las imágenes (border-radius, sombras).

#### Scenario: Cap de concurrencia

- **WHEN** hay `maxConcurrent` imágenes vivas y el puntero sigue moviéndose
- **THEN** NO SHALL emitirse imágenes nuevas hasta que alguna termine

### Requirement: ImageTrail respeta prefers-reduced-motion

`ImageTrail` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el efecto SHALL ser no-op (sin emisión), con los `children` intactos.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el puntero se mueve
- **THEN** NO SHALL emitirse imágenes

### Requirement: ImageTrail es SSR-safe y extensible

`ImageTrail` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
