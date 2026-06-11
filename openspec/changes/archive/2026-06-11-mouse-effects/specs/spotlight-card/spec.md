## ADDED Requirements

### Requirement: SpotlightCard ilumina la zona bajo el cursor con un gradiente radial
El componente SHALL renderizar un overlay con `radial-gradient` centrado en la posición actual del cursor dentro del contenedor. El overlay SHALL tener `pointer-events: none` y NO SHALL interferir con la interacción del contenido.

#### Scenario: Spotlight sigue al cursor
- **WHEN** el usuario mueve el mouse dentro del componente
- **THEN** el centro del gradiente radial SHALL seguir la posición del cursor

#### Scenario: Spotlight aparece y desaparece con transición
- **WHEN** el cursor entra o sale del componente
- **THEN** el spotlight SHALL aparecer/desaparecer con una transición suave de opacidad, sin cortes bruscos

#### Scenario: El contenido sigue siendo interactivo
- **WHEN** el contenido del card incluye links o botones
- **THEN** estos SHALL recibir clicks y hover normalmente a pesar del overlay

### Requirement: La actualización de posición no provoca re-renders de React
El seguimiento del cursor SHALL implementarse escribiendo las CSS custom properties `--aui-spotlight-x` y `--aui-spotlight-y` directamente sobre el elemento root, sin pasar por estado de React.

#### Scenario: Mousemove sostenido sobre el card
- **WHEN** el usuario mueve el mouse continuamente sobre el componente
- **THEN** los children NO SHALL re-renderizarse por causa del movimiento

### Requirement: El spotlight es customizable via props y CSS custom properties
El componente SHALL aceptar las props `color`, `radius` (px) y `opacity`, materializadas como `--aui-spotlight-color`, `--aui-spotlight-radius` y `--aui-spotlight-opacity` en el root, pisables desde CSS en cascada.

#### Scenario: Customización via props
- **WHEN** el consumer pasa `color="rgba(56,189,248,0.25)"` y `radius={300}`
- **THEN** el spotlight SHALL usar ese color y ese radio

#### Scenario: Override via CSS
- **WHEN** el consumer define `.mi-card { --aui-spotlight-radius: 500px; }`
- **THEN** el valor de la cascada SHALL prevalecer sobre el default de la prop

### Requirement: SpotlightCard acepta className, style y demás props HTML del div
El componente SHALL pasar todas las props no reconocidas al elemento root `<div>`, permitiendo uso normal de className (Tailwind, CSS modules), style, aria attributes, etc.

#### Scenario: Estilizar con Tailwind
- **WHEN** el consumer pasa `className="rounded-xl border bg-zinc-900 p-6"`
- **THEN** el card SHALL tener esos estilos aplicados junto al efecto de spotlight

### Requirement: SpotlightCard permanece activo bajo prefers-reduced-motion
Dado que el spotlight es iluminación decorativa que responde a input directo del usuario y no desplaza contenido, SHALL permanecer activo con `prefers-reduced-motion: reduce` (precedente: behavior `hover` de PixelBackground). El componente SHALL aceptar `respectReducedMotion` (default `true`) por consistencia de API, sin efecto sobre este comportamiento en esta versión.

#### Scenario: Spotlight con reduced motion activo
- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el usuario mueve el mouse sobre el card
- **THEN** el spotlight SHALL seguir al cursor normalmente
