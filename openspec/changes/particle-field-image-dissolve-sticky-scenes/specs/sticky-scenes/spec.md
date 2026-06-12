## ADDED Requirements

### Requirement: StickyScenes ancla el viewport durante el scroll y transiciona entre escenas

`StickyScenes` SHALL renderizar un contenedor exterior con altura total `viewportHeight + nScenes × sceneDuration` (px). El inner wrapper SHALL ser `position: sticky; top: 0; height: 100dvh`, manteniéndose fijo mientras el usuario scrollea dentro del rango del contenedor. El motor `subscribeScroll` (de `src/utils/scroll-driver.ts`) SHALL calcular el progreso del scroll dentro de ese rango y descomponerlo en la escena activa y el progreso dentro de ella.

#### Scenario: Inner wrapper permanece fijo durante el scroll

- **WHEN** el usuario scrollea dentro del rango sticky del componente
- **THEN** el inner wrapper SHALL permanecer fijo en la parte superior del viewport hasta que se alcance el final del contenedor exterior

#### Scenario: Escena activa cambia al avanzar el scroll

- **WHEN** el progreso de scroll supera el umbral de la siguiente escena
- **THEN** la escena anterior SHALL perder `data-aui-active` y la nueva SHALL recibirlo

### Requirement: Las escenas se declaran con StickyScenes.Scene

El paquete SHALL exponer `StickyScenes.Scene`, que acepta `children` y `className`/`style`. Cada Scene SHALL recibir el atributo `data-aui-active="true"` cuando es la escena en curso, permitiendo al consumer usar selectores CSS (`[data-aui-active] .mi-elemento { ... }`) para activar sus transiciones propias.

#### Scenario: Dos escenas declaradas

- **WHEN** el consumer declara `<StickyScenes.Scene>` y `<StickyScenes.Scene>` como hijos
- **THEN** al scrollear SHALL activarse una escena a la vez; la primera SHALL estar activa al inicio

#### Scenario: Transición CSS activada por data-aui-active

- **WHEN** una Scene pasa de inactiva a activa
- **THEN** el consumer SHALL poder observar el cambio de `data-aui-active` y disparar cualquier CSS transition o animation definida en su propio stylesheet

### Requirement: El progreso de scroll se expone como CSS vars sin React state en el hot path

`StickyScenes` SHALL escribir `--aui-scene-progress` (0–1 dentro de la escena activa) y `--aui-scene-index` (índice entero) directamente sobre el inner wrapper con `element.style.setProperty`, sin pasar por `setState`. El hot path del scroll NO SHALL provocar re-renders de React.

#### Scenario: CSS var disponible en cada frame

- **WHEN** el usuario scrollea dentro de una escena
- **THEN** `--aui-scene-progress` SHALL actualizarse en cada frame con el progreso 0–1 dentro de esa escena, usable con `calc()` en CSS del consumer

#### Scenario: Sin re-renders por scroll

- **WHEN** el usuario scrollea continuamente dentro del componente
- **THEN** los children de las Scene NO SHALL re-renderizarse por causa del movimiento de scroll

### Requirement: StickyScenes es customizable via props y CSS custom properties

`StickyScenes` SHALL aceptar `sceneDuration` (px de scroll dedicados a cada escena, default `600`) como prop. `--aui-scene-progress` y `--aui-scene-index` son variables de runtime escritas por el motor; no se setean desde props pero SE documentan como API de customización CSS para efectos derivados.

#### Scenario: Duración de escena más larga

- **WHEN** el consumer pasa `sceneDuration={1200}`
- **THEN** cada escena SHALL ocupar 1200 px de scroll antes de transicionar a la siguiente

### Requirement: StickyScenes respeta prefers-reduced-motion manteniendo el scroll funcional

`StickyScenes` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el tracking de scroll SHALL seguir activo (el usuario navega con propósito), pero las transitions CSS de las escenas SHALL deshabilitarse: la escena activa SHALL mostrarse de forma inmediata mediante CSS inyectado con `transition: none` bajo reduced motion.

#### Scenario: Escena activa visible inmediatamente con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el scroll avanza a una nueva escena
- **THEN** la nueva escena SHALL hacerse visible inmediatamente, sin ninguna transición animada

#### Scenario: Scroll funcional con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el sticky wrapper SHALL seguir funcionando y las escenas SHALL activarse según el progreso de scroll

### Requirement: StickyScenes es SSR-safe y extensible

`StickyScenes` y `StickyScenes.Scene` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni a `getBoundingClientRect` durante el render. El motor de scroll SHALL suscribirse en `useEffect`. `StickyScenes` SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root `<div>`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, con el contenedor visible y la primera escena activa hasta la hidratación
