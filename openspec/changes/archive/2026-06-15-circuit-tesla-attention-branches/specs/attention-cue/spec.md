## ADDED Requirements

### Requirement: AttentionCue detecta la inactividad del mouse y dispara tras un retardo

`AttentionCue` SHALL monitorear el movimiento del puntero dentro de su área y considerar al usuario "inactivo" cuando no hay movimiento durante un período configurable (`idleDelay`, ms). Al cumplirse `idleDelay`, SHALL comenzar a dibujar el cue de atención. Cualquier movimiento del puntero SHALL reiniciar el temporizador y disparar la retracción/desvanecimiento del cue. El temporizado y el tracking SHALL operar por ref/handlers sin re-renders de React por frame.

#### Scenario: Cue aparece tras inactividad

- **WHEN** el puntero permanece inmóvil dentro del área durante `idleDelay` ms
- **THEN** el cue de atención SHALL comenzar a dibujarse

#### Scenario: Cue se desvanece al moverse

- **WHEN** el usuario mueve el puntero mientras el cue está visible
- **THEN** el cue SHALL desvanecerse/retraerse y el temporizador de inactividad SHALL reiniciarse

#### Scenario: Inactividad configurable

- **WHEN** el consumer pasa `idleDelay={3000}`
- **THEN** el cue SHALL aparecer recién tras 3 segundos sin movimiento

### Requirement: AttentionCue dibuja un trazo dirigido hacia un elemento referenciado (modo directed)

`AttentionCue` SHALL aceptar una referencia a un elemento objetivo (`target`: un `RefObject`, un elemento, o un selector CSS). En modo directed (con `target` provisto), al activarse por inactividad SHALL dibujar un trazo/indicador animado que parte desde la posición del puntero y se dirige hacia el elemento objetivo, "mostrando el camino" hacia él. La dirección SHALL calcularse desde la posición del cursor hacia el centro (o borde) del rectángulo del target.

#### Scenario: Camino hacia un botón

- **WHEN** se referencia un botón como `target` y el usuario queda inactivo
- **THEN** SHALL dibujarse un trazo animado desde el puntero hacia el botón, indicando el camino

#### Scenario: Target por selector CSS

- **WHEN** el consumer pasa `target="#cta"`
- **THEN** el cue SHALL dirigirse hacia el elemento que matchea ese selector

#### Scenario: Target fuera de la posición del cursor

- **WHEN** el target está a la derecha del puntero inactivo
- **THEN** el trazo SHALL orientarse hacia la derecha, apuntando al target

### Requirement: AttentionCue soporta un modo ambient sin target

`AttentionCue` SHALL funcionar también sin `target` (modo ambient): al activarse por inactividad, SHALL dibujar el cue desde el puntero sin una dirección objetivo específica (por ejemplo, irradiando alrededor del puntero). El modo (ambient vs directed) SHALL determinarse por la presencia o ausencia de `target`.

#### Scenario: Cue ambiental sin target

- **WHEN** no se provee `target` y el usuario queda inactivo
- **THEN** el cue SHALL dibujarse alrededor/desde el puntero sin dirigirse a un elemento

### Requirement: AttentionCue es customizable via props y CSS custom properties

`AttentionCue` SHALL exponer props para `idleDelay` (ms de inactividad), `color`, `duration` (duración del dibujado del trazo), `speed` (velocidad de avance del trazo), `maxDistance` (distancia máxima desde el puntero que el cue puede alcanzar/dibujar), `lineWidth` (grosor), `head` (estilo de la punta), `marker` (haz de luz o huellas), `curve` (curvatura del trazo) y `showGuide` (mostrar u ocultar la línea-guía sólida). Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-cue-*` en el root, pisables desde CSS en cascada.

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mi-cue { --aui-cue-color: #fbbf24; }`
- **THEN** el trazo del cue SHALL dibujarse con ese color

#### Scenario: Distancia máxima desde el mouse

- **WHEN** el consumer pasa `maxDistance={240}`
- **THEN** el cue NO SHALL extenderse más de 240 px desde la posición del puntero

#### Scenario: Punta configurable

- **WHEN** el consumer pasa `head="dot"` (o `"none"`)
- **THEN** la punta del cue SHALL dibujarse con ese estilo (un punto, o sin punta) en vez de la flecha default

#### Scenario: Trazo curvable

- **WHEN** el consumer pasa `curve={0.5}`
- **THEN** el trazo SHALL arquearse hacia un costado en vez de ir en línea recta

#### Scenario: Recorrido por huellas

- **WHEN** el consumer pasa `marker="footprints"`
- **THEN** el recorrido SHALL dibujarse como una hilera de huellas que avanzan hacia el destino (alternando lados) en vez del haz de luz

### Requirement: AttentionCue se muestra como un destello de luz por defecto

`AttentionCue` SHALL dibujar el cue por default como **solo luz**: un cometa/destello con glow que aparece y se desvanece, sin una línea sólida de guía debajo. El consumer MAY activar la línea-guía tenue con `showGuide`. El destello SHALL aparecer y desvanecerse cíclicamente mientras el puntero permanezca inactivo.

#### Scenario: Solo luz por default

- **WHEN** el cue se activa sin `showGuide`
- **THEN** SHALL verse únicamente la luz (cometa con glow), sin una línea sólida bajo ella

#### Scenario: Guía opcional

- **WHEN** el consumer pasa `showGuide`
- **THEN** SHALL dibujarse además una línea-guía tenue a lo largo del recorrido del cue

### Requirement: AttentionCue respeta prefers-reduced-motion

`AttentionCue` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el cue de atención (efecto autónomo que aparece sin input directo) NO SHALL dibujarse, ya que es un efecto generado por temporizador y no una respuesta directa a una acción del usuario.

#### Scenario: Cue desactivado con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** el cue NO SHALL dibujarse al quedar inactivo el puntero

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el cue SHALL dibujarse tras la inactividad aunque la preferencia esté activa

### Requirement: AttentionCue es SSR-safe y no bloquea la interacción

`AttentionCue` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. El overlay donde se dibuja el cue SHALL tener `pointer-events: none` para no interceptar clicks sobre el contenido. El componente SHALL aceptar `children` (el área monitoreada y/o el contenido), `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Contenido sigue interactivo

- **WHEN** el cue está visible sobre un área con elementos interactivos
- **THEN** los clicks SHALL pasar a través del overlay del cue hacia el contenido
