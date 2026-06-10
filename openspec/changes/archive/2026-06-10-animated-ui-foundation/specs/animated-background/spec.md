## ADDED Requirements

### Requirement: AnimatedBackground renderiza un background animado posicionado absolutamente
El componente SHALL renderizar un `<div>` con `position: absolute`, `inset: 0`, y `z-index` configurable, diseñado para ser colocado dentro de un contenedor con `position: relative`. El componente SHALL aceptar un wrapper alternativo o `position: fixed` via prop.

#### Scenario: Uso básico dentro de un hero section
- **WHEN** un consumer renderiza `<div style={{position:'relative'}}><AnimatedBackground /></div>`
- **THEN** el background SHALL cubrir completamente el contenedor padre sin afectar el layout de otros elementos

#### Scenario: Modo fullscreen con position fixed
- **WHEN** el consumer pasa `fixed={true}`
- **THEN** el componente SHALL usar `position: fixed` para cubrir el viewport completo

### Requirement: El componente soporta cuatro variantes de animación
AnimatedBackground SHALL soportar las variantes `aurora`, `mesh`, `noise`, y `beam`, seleccionables via prop `variant`. Cada variante SHALL tener valores visuales distintos y ser visualmente atractiva en su estado default.

#### Scenario: Variante aurora
- **WHEN** se renderiza `<AnimatedBackground variant="aurora" />`
- **THEN** el background SHALL mostrar gradientes de colores vibrantes que se mueven lentamente simulando una aurora boreal

#### Scenario: Variante mesh
- **WHEN** se renderiza `<AnimatedBackground variant="mesh" />`
- **THEN** el background SHALL mostrar blobs de color suaves que se deforman y mueven en un patrón orgánico

#### Scenario: Variante noise
- **WHEN** se renderiza `<AnimatedBackground variant="noise" />`
- **THEN** el background SHALL mostrar un efecto de ruido o grain animado sutil sobre un color base

#### Scenario: Variante beam
- **WHEN** se renderiza `<AnimatedBackground variant="beam" />`
- **THEN** el background SHALL mostrar rayos o haces de luz que cruzan el fondo en movimiento suave

### Requirement: Los parámetros de animación son configurables via props
El componente SHALL exponer props para controlar los aspectos visuales y de animación más comunes: colores, velocidad, intensidad/opacidad.

#### Scenario: Personalizar colores de la aurora
- **WHEN** el consumer pasa `colors={['#ff6b6b', '#4ecdc4', '#45b7d1']}`
- **THEN** la animación SHALL usar esos colores en lugar de los defaults

#### Scenario: Controlar velocidad de animación
- **WHEN** el consumer pasa `speed={20}` (segundos para un ciclo completo)
- **THEN** la animación SHALL ser más lenta que el default

### Requirement: El componente acepta className y style para customización adicional
AnimatedBackground SHALL aceptar las props estándar `className` y `style` de React, aplicándolas al elemento root junto a los estilos internos.

#### Scenario: Agregar border-radius con Tailwind
- **WHEN** el consumer pasa `className="rounded-2xl overflow-hidden"`
- **THEN** el background SHALL tener bordes redondeados

### Requirement: AnimatedBackground respeta prefers-reduced-motion
Cuando el sistema operativo tiene activada la preferencia de movimiento reducido, el componente SHALL mostrar el estado visual sin animación (gradiente estático) en lugar de la animación en movimiento.

#### Scenario: Animación desactivada con prefers-reduced-motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el background SHALL mostrarse estático, sin keyframe animations

#### Scenario: Override de reduced motion
- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la animación SHALL correr independientemente de la preferencia del sistema

### Requirement: El API de CSS custom properties está documentado en el código
Cada CSS custom property usada por el componente SHALL tener un comentario en el source indicando su propósito, valor default, y cómo usarla para override.

#### Scenario: Dev puede customizar sin leer el source
- **WHEN** un developer inspecciona el elemento en DevTools
- **THEN** SHALL ver las CSS vars con nombres descriptivos (e.g., `--aui-aurora-color-1`, `--aui-aurora-speed`) que puede pisar en su propio CSS
