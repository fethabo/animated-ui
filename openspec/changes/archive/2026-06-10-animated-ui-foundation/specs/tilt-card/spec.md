## ADDED Requirements

### Requirement: TiltCard aplica efecto 3D tilt usando WAAPI
El componente SHALL detectar la posición del mouse relativa al centro del elemento y aplicar una rotación 3D suave usando Web Animations API (`element.animate()`), interpolando entre el estado actual y el target angle para preservar momentum.

#### Scenario: Tilt en respuesta al mouse
- **WHEN** el usuario mueve el mouse sobre el componente
- **THEN** el elemento SHALL inclinarse en 3D en la dirección del mouse con una animación suave

#### Scenario: Reset al salir
- **WHEN** el usuario mueve el mouse fuera del componente
- **THEN** el elemento SHALL volver suavemente a la posición neutral (0°, 0°)

#### Scenario: Interpolación preserva momentum
- **WHEN** el usuario mueve el mouse rápidamente en una dirección y luego cambia de dirección
- **THEN** la animación SHALL continuar brevemente en la dirección original antes de redirigirse, simulando inercia

### Requirement: El ángulo máximo de tilt es configurable
El componente SHALL aceptar una prop `maxAngle` (en grados) que define el ángulo máximo de rotación en cualquier eje. El default SHALL ser 15°.

#### Scenario: Tilt sutil
- **WHEN** el consumer pasa `maxAngle={8}`
- **THEN** el efecto SHALL ser más sutil que el default

#### Scenario: Tilt pronunciado
- **WHEN** el consumer pasa `maxAngle={25}`
- **THEN** el efecto SHALL ser más dramático

### Requirement: TiltCard expone su estado de animación via render prop
El componente SHALL aceptar `children` tanto como `ReactNode` simple como función `(state: TiltState) => ReactNode`, donde `TiltState = { tiltX: number, tiltY: number, isHovering: boolean }`.

#### Scenario: Children estáticos (caso común)
- **WHEN** el consumer pasa elementos React normales como children
- **THEN** el componente SHALL renderizarlos dentro del card y aplicar el tilt al container

#### Scenario: Children como función para efectos adicionales
- **WHEN** el consumer pasa `{({ tiltX, tiltY }) => <div style={{backgroundPosition: `${tiltX}px ${tiltY}px`}}>...</div>}`
- **THEN** el consumer SHALL poder usar los valores de tilt para crear efectos parallax o de color

### Requirement: El efecto de perspectiva es configurable via CSS custom property
La profundidad de perspectiva 3D SHALL ser controlable via la CSS custom property `--aui-tilt-perspective` (en píxeles) además de la prop `perspective`.

#### Scenario: Perspectiva más profunda
- **WHEN** el consumer aplica `--aui-tilt-perspective: 2000px` en su CSS
- **THEN** el efecto 3D SHALL parecer más sutil (perspectiva lejana)

### Requirement: TiltCard acepta className, style y demás props HTML del div
El componente SHALL pasar todas las props no reconocidas al elemento root `<div>`, permitiendo uso normal de className (Tailwind, CSS modules), style, aria attributes, etc.

#### Scenario: Estilizar con Tailwind
- **WHEN** el consumer pasa `className="rounded-xl shadow-2xl bg-white p-6"`
- **THEN** el card SHALL tener esos estilos aplicados junto al efecto de tilt

### Requirement: TiltCard respeta prefers-reduced-motion
Cuando la preferencia está activa, el componente SHALL no aplicar ninguna rotación 3D. Los event listeners SHALL seguir activos para que el render prop reciba `isHovering`, pero `tiltX` y `tiltY` SHALL retornar siempre 0.

#### Scenario: Sin tilt con reduced motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el card SHALL no rotar en ninguna dirección al mover el mouse

#### Scenario: Estado hover sigue disponible con reduced motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el usuario hace hover
- **THEN** el render prop SHALL recibir `isHovering: true` para que el consumer pueda aplicar efectos alternativos sin movimiento

### Requirement: Un efecto de brillo (glare/shine) opcional sigue la inclinación
El componente SHALL soportar un prop `glare={true}` que agrega un overlay de brillo especular que se mueve inversamente al tilt, simulando una fuente de luz fija.

#### Scenario: Glare activado
- **WHEN** el consumer pasa `glare={true}` y mueve el mouse
- **THEN** SHALL aparecer un reflejo de luz en el card que se desplaza en la dirección opuesta al tilt

#### Scenario: Glare desactivado por default
- **WHEN** el componente se renderiza sin la prop `glare`
- **THEN** NO SHALL aparecer ningún overlay de brillo adicional
