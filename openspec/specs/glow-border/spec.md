# glow-border Specification

## Purpose
Componente `GlowBorder`: contenedor con un anillo de borde de gradiente cónico animado, en loop autónomo o apuntando hacia el cursor con momentum (WAAPI), customizable via props y CSS custom properties (`--aui-glow-*`) y respetuoso de `prefers-reduced-motion`.

## Requirements

### Requirement: GlowBorder renderiza un borde de gradiente cónico animado alrededor de su contenido
El componente SHALL envolver su contenido con un anillo de `conic-gradient` visible en el perímetro. La animación SHALL implementarse rotando una capa sobredimensionada con `transform` (animable en el compositor, soporte universal), no con `@property`.

#### Scenario: Loop autónomo por default
- **WHEN** el componente se renderiza sin props de modo
- **THEN** el gradiente del borde SHALL rotar continuamente en loop

#### Scenario: El contenido tapa el interior
- **WHEN** el consumer coloca contenido dentro del componente
- **THEN** el gradiente SHALL ser visible solo como anillo perimetral, nunca detrás del contenido

### Requirement: GlowBorder soporta modo cursor-reactivo
El componente SHALL aceptar la prop `followCursor` (default `false`). Cuando está activa, la rotación autónoma SHALL reemplazarse por orientar el gradiente hacia la posición del cursor, interpolando el ángulo con momentum (patrón WAAPI de TiltCard).

#### Scenario: El glow apunta al cursor
- **WHEN** `followCursor` está activo y el usuario mueve el mouse alrededor del componente
- **THEN** la zona más brillante del borde SHALL orientarse hacia el cursor con movimiento suave

#### Scenario: Cursor sale del componente
- **WHEN** `followCursor` está activo y el cursor sale del componente
- **THEN** el borde SHALL mantener una apariencia estable, sin saltos bruscos de ángulo

### Requirement: El glow es customizable via props y CSS custom properties
El componente SHALL aceptar props para colores (hasta 3), velocidad del loop, ancho del borde, border-radius e intensidad, materializadas como `--aui-glow-color-1..3`, `--aui-glow-speed`, `--aui-glow-width`, `--aui-glow-radius` y `--aui-glow-opacity` en el root, pisables desde CSS en cascada.

#### Scenario: Customización via props
- **WHEN** el consumer pasa `colors={['#22d3ee', '#a78bfa']}` y `width={2}`
- **THEN** el anillo SHALL usar esos colores con 2px de ancho

#### Scenario: Override via CSS
- **WHEN** el consumer define `.mi-borde { --aui-glow-speed: 3s; }`
- **THEN** la rotación SHALL completar un ciclo en 3 segundos

### Requirement: GlowBorder acepta className, style y demás props HTML del div
El componente SHALL pasar todas las props no reconocidas al elemento root `<div>`, permitiendo uso normal de className, style, aria attributes, etc.

#### Scenario: Estilizar el wrapper
- **WHEN** el consumer pasa `className="shadow-2xl"`
- **THEN** el wrapper SHALL tener esos estilos sin romper el anillo de glow

### Requirement: GlowBorder respeta prefers-reduced-motion
Con la preferencia activa y `respectReducedMotion` en su default `true`, el loop autónomo SHALL detenerse mostrando el gradiente estático. El modo `followCursor` MAY permanecer activo por responder a input directo del usuario.

#### Scenario: Loop detenido con reduced motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el componente está en modo loop
- **THEN** el borde SHALL mostrar el gradiente estático, sin rotación

#### Scenario: Opt-out explícito
- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el loop SHALL animar normalmente aunque la preferencia esté activa
