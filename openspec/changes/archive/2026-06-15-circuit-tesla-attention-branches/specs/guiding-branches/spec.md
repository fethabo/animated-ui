## ADDED Requirements

### Requirement: GuidingBranches dibuja ramas orgánicas desde el puntero tras la inactividad

`GuidingBranches` SHALL monitorear el movimiento del puntero y, cuando el usuario permanece inactivo durante `idleDelay` ms, SHALL hacer crecer ramas orgánicas (trazos ramificados que se dibujan progresivamente, tipo raíces/relámpago) que parten desde la posición del puntero. El crecimiento SHALL animarse (las ramas "se dibujan" en el tiempo, con sub-ramificaciones). Cualquier movimiento del puntero SHALL retraer/desvanecer las ramas y reiniciar el temporizador. El tracking y el temporizado SHALL operar sin re-renders de React por frame, y la aleatoriedad del crecimiento SHALL provenir del PRNG seedable del paquete.

#### Scenario: Ramas crecen tras inactividad

- **WHEN** el puntero permanece inmóvil durante `idleDelay` ms y `respectReducedMotion` no lo inhibe
- **THEN** SHALL comenzar a dibujarse ramas que crecen desde la posición del puntero, ramificándose

#### Scenario: Ramas se retraen al moverse

- **WHEN** el usuario mueve el puntero con ramas visibles
- **THEN** las ramas SHALL desvanecerse/retraerse y el temporizador SHALL reiniciarse

### Requirement: GuidingBranches soporta modo ambient y modo directed hacia un target

`GuidingBranches` SHALL soportar dos modos según la presencia de `target` (un `RefObject`, elemento o selector CSS). El modo **ambient** (sin target) es el uso principal: las ramas SHALL crecer en **todas las direcciones (360°)** alrededor del puntero hasta la frontera (`maxDistance`), como interacción del puntero pausado con su entorno. El `target` SHALL ser **opcional**; en modo **directed** (con target) el crecimiento de las ramas SHALL sesgarse hacia el elemento objetivo, de modo que la rama dominante se oriente hacia él, aunque las ramas secundarias puedan dispersarse.

#### Scenario: Ramas en todas direcciones (ambient)

- **WHEN** no se provee `target` y el usuario queda inactivo
- **THEN** las ramas SHALL crecer en direcciones diversas alrededor del puntero

#### Scenario: Ramas sesgadas hacia el target (directed)

- **WHEN** se provee `target` y el usuario queda inactivo
- **THEN** la dirección dominante del crecimiento SHALL orientarse hacia el elemento objetivo, indicando el camino hacia él

### Requirement: GuidingBranches admite estéticas intercambiables y personalizables

`GuidingBranches` SHALL estar diseñado para soportar múltiples estéticas de trazo intercambiables (incluidas `'roots'`, `'lightning'` y `'circuit'`; otras como `'vines'` quedan como extensión), seleccionables via prop `aesthetic` (o equivalente), con una arquitectura que permita **agregar nuevas estéticas sin cambiar la API pública** (cada estética encapsulada como módulo de generación/dibujo, siguiendo el patrón de `variants/`/`behaviors/` del paquete). Cada estética SHALL respetar los mismos parámetros de personalización: `color`, `duration` (duración del crecimiento), `speed` (velocidad de dibujado), `maxDistance` (distancia máxima desde el puntero), `curl` (curvatura del trazo; las estéticas ortogonales MAY ignorarlo) y la densidad/profundidad de ramificación.

#### Scenario: Cambiar de estética

- **WHEN** el consumer pasa `aesthetic="lightning"`
- **THEN** las ramas SHALL dibujarse con la estética de relámpago en lugar de la default, respetando los mismos parámetros de personalización

#### Scenario: Agregar una estética nueva sin romper la API

- **WHEN** se agrega un módulo de estética nuevo al componente
- **THEN** SHALL quedar disponible via la misma prop `aesthetic` sin cambiar la firma del componente ni los demás parámetros

#### Scenario: Distancia máxima desde el mouse

- **WHEN** el consumer pasa `maxDistance={300}`
- **THEN** ninguna rama SHALL extenderse más de 300 px desde la posición del puntero

#### Scenario: Velocidad y duración de crecimiento

- **WHEN** el consumer pasa `speed` y `duration`
- **THEN** las ramas SHALL dibujarse a esa velocidad y completar su crecimiento en esa duración

#### Scenario: Curvatura de las raíces configurable

- **WHEN** el consumer sube `curl` en la estética `roots`
- **THEN** las raíces SHALL arquearse más (trazo sinuoso, orgánico) en vez de crecer casi rectas

#### Scenario: Trazo estático por default (sin bucle)

- **WHEN** el puntero queda inactivo y `loop` no está activado
- **THEN** el trazo SHALL crecer una vez y quedar **estático** mientras el puntero no se mueva (sin re-crecer en bucle)

#### Scenario: Re-crecimiento en bucle opt-in

- **WHEN** el consumer pasa `loop`
- **THEN** el trazo SHALL re-crecer cíclicamente (completar, esperar `duration`, volver a crecer) mientras el puntero siga quieto

### Requirement: GuidingBranches expone su personalización via CSS custom properties

Los parámetros estéticos de `GuidingBranches` SHALL materializarse como CSS custom properties con namespace `--aui-branches-*` en el root (color, velocidad, distancia máxima, etc.), pisables desde CSS en cascada, además de las props.

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mis-ramas { --aui-branches-color: #34d399; }`
- **THEN** las ramas SHALL dibujarse con ese color

### Requirement: GuidingBranches respeta prefers-reduced-motion

`GuidingBranches` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, las ramas (efecto autónomo disparado por temporizador, no por input directo) NO SHALL dibujarse.

#### Scenario: Ramas desactivadas con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** las ramas NO SHALL crecer al quedar inactivo el puntero

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** las ramas SHALL crecer tras la inactividad aunque la preferencia esté activa

### Requirement: GuidingBranches es SSR-safe y no bloquea la interacción

`GuidingBranches` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni al contexto canvas durante el render. El canvas/overlay donde crecen las ramas SHALL tener `pointer-events: none` para no interceptar clicks sobre el contenido (en particular, sobre el `target` al que apunta). El componente SHALL aceptar `children`, `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM ni al canvas

#### Scenario: El target sigue clickeable

- **WHEN** las ramas apuntan a un botón y el usuario hace click en él
- **THEN** el click SHALL llegar al botón (el overlay de ramas no SHALL interceptarlo)
