## ADDED Requirements

### Requirement: TopographicBackground dibuja curvas de nivel extraídas de un campo de ruido

`TopographicBackground` SHALL renderizar sobre `<canvas>` un conjunto de curvas de nivel (estilo mapa topográfico) extraídas de un campo de ruido coherente mediante marching squares sobre una grilla de celdas (no por pixel). El algoritmo de extracción SHALL vivir en un módulo puro testeable (`marching-squares.ts`). Las curvas SHALL dibujarse sobre una capa offscreen que se recalcula solo cuando cambia el tiempo de evolución o el tamaño — nunca en cada frame del RAF.

#### Scenario: Mapa topográfico

- **WHEN** el componente está montado
- **THEN** SHALL verse un patrón de curvas de nivel cerradas y anidadas, orgánico y sin artefactos de grilla evidentes

#### Scenario: Extracción pura testeable

- **WHEN** se ejecutan los tests del módulo de marching squares
- **THEN** SHALL verificarse la extracción correcta de contornos sobre campos sintéticos conocidos, sin DOM

### Requirement: TopographicBackground evoluciona lentamente de forma opcional

`TopographicBackground` SHALL exponer `speed` (default lento, `0` = estático): con `speed > 0`, el campo SHALL evolucionar desplazando la coordenada temporal del ruido y las curvas SHALL recalcularse a intervalos espaciados (no cada frame), produciendo una deformación gradual del terreno.

#### Scenario: Evolución gradual

- **WHEN** `speed` es mayor que 0
- **THEN** las curvas SHALL deformarse lenta y continuamente, sin parpadeos ni saltos

#### Scenario: Terreno fijo

- **WHEN** el consumer pasa `speed={0}`
- **THEN** las curvas SHALL dibujarse una vez y permanecer estáticas sin RAF corriendo

### Requirement: TopographicBackground es determinista por seed

`TopographicBackground` SHALL aceptar `seed`; el campo y las curvas SHALL derivarse del ruido seedeado del paquete, sin `Math.random()`/`Date.now()` en la generación. La misma seed y dimensiones SHALL producir el mismo mapa.

#### Scenario: Misma seed, mismo mapa

- **WHEN** el componente se monta dos veces con la misma `seed` y dimensiones
- **THEN** el patrón de curvas SHALL ser idéntico

### Requirement: TopographicBackground es customizable via props y CSS custom properties

`TopographicBackground` SHALL exponer props para `levels` (cantidad de niveles/curvas), `color` (o paleta por profundidad), `lineWidth`, `scale` (zoom del terreno), `speed` y `seed`. Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-topo-*` donde aplique, pisables desde CSS en cascada.

#### Scenario: Densidad de niveles

- **WHEN** el consumer pasa `levels={12}`
- **THEN** SHALL dibujarse 12 niveles de contorno distribuidos por el rango del campo

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mi-fondo { --aui-topo-color: #94a3b8; }`
- **THEN** las curvas SHALL dibujarse con ese color

### Requirement: TopographicBackground respeta prefers-reduced-motion

`TopographicBackground` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el componente SHALL renderizar el mapa estático (equivalente a `speed={0}`), sin evolución temporal.

#### Scenario: Estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el mapa SHALL dibujarse una vez sin evolución

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la evolución SHALL operar aunque la preferencia esté activa

### Requirement: TopographicBackground es SSR-safe, responsivo y extensible

`TopographicBackground` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL posicionarse `absolute, inset: 0`, adaptarse al contenedor via observer (con debounce en el recálculo por resize) y aceptar `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Resize del contenedor

- **WHEN** el contenedor cambia de tamaño
- **THEN** el mapa SHALL regenerarse de forma determinista tras el debounce, sin recálculos por frame durante el arrastre del resize
