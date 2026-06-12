## ADDED Requirements

### Requirement: MagneticElement atrae su contenido hacia el cursor con retorno elástico

`MagneticElement` SHALL trasladar su contenido hacia la posición del cursor mientras este se encuentra dentro de la zona de atracción, usando WAAPI con interpolación que preserva momentum (patrón de `TiltCard` aplicado a `translate`). Al salir el cursor, el contenido SHALL volver a su posición original con easing elástico (overshoot).

#### Scenario: Atracción dentro de la zona

- **WHEN** el cursor se mueve dentro de la zona de atracción
- **THEN** el contenido SHALL desplazarse suavemente hacia el cursor, proporcionalmente a `strength` y a la distancia al centro

#### Scenario: Retorno elástico

- **WHEN** el cursor sale de la zona de atracción
- **THEN** el contenido SHALL regresar a su posición original con un leve rebote elástico

### Requirement: La zona de atracción se define con padding transparente (hit-area)

`MagneticElement` SHALL aceptar la prop `hitArea` (px, default `40`) que amplía el área sensible alrededor del contenido visible mediante padding transparente en el root. NO SHALL usarse un listener de `window` para detectar proximidad del cursor.

#### Scenario: Atracción antes de tocar el contenido

- **WHEN** el cursor entra al hit-area sin estar aún sobre el contenido visible
- **THEN** el contenido ya SHALL comenzar a desplazarse hacia el cursor

#### Scenario: Hit-area colapsado

- **WHEN** el consumer pasa `hitArea={0}`
- **THEN** el wrapper SHALL ocupar solo el tamaño de su contenido y la atracción SHALL activarse al entrar directamente en él

### Requirement: La intensidad de atracción es configurable

`MagneticElement` SHALL aceptar la prop `strength` (0 a 1, default `0.35`) que escala el desplazamiento máximo del contenido hacia el cursor.

#### Scenario: Atracción sutil

- **WHEN** el consumer pasa `strength={0.15}`
- **THEN** el desplazamiento máximo SHALL ser notablemente menor que con el default

#### Scenario: Atracción pronunciada

- **WHEN** el consumer pasa `strength={0.8}`
- **THEN** el contenido SHALL seguir al cursor de forma marcada

### Requirement: MagneticElement expone su estado via render prop opcional

`MagneticElement` SHALL aceptar `children` tanto como `ReactNode` simple como función `(state: MagneticState) => ReactNode`, donde `MagneticState = { offsetX: number, offsetY: number, isActive: boolean }`.

#### Scenario: Children estáticos (caso común)

- **WHEN** el consumer pasa elementos React normales como children
- **THEN** el componente SHALL renderizarlos y aplicar la traslación magnética al wrapper de contenido

#### Scenario: Children como función para efectos derivados

- **WHEN** el consumer pasa una función como children
- **THEN** SHALL recibir `offsetX`, `offsetY` e `isActive` actualizados para construir efectos derivados como sombras, glow o escala

### Requirement: MagneticElement acepta className, style y demás props HTML del div

`MagneticElement` SHALL pasar todas las props no reconocidas al elemento root `<div>`, permitiendo uso de className, style, aria attributes y event handlers.

#### Scenario: Uso como wrapper de un botón

- **WHEN** el consumer envuelve un `<button>` con `className` y `aria-label` propios
- **THEN** el botón SHALL conservar sus estilos y atributos de accesibilidad, sumando el efecto magnético

### Requirement: MagneticElement respeta prefers-reduced-motion y es SSR-safe

`MagneticElement` SHALL incluir `'use client'` y NO SHALL acceder a `window`/`document` durante el render. Con `prefers-reduced-motion: reduce` y `respectReducedMotion` en su default `true`, el componente NO SHALL trasladar el contenido: `offsetX` y `offsetY` SHALL permanecer en 0, mientras `isActive` sigue reportándose para efectos derivados sin movimiento (precedente: `TiltCard`).

#### Scenario: Sin desplazamiento con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el cursor entra a la zona de atracción
- **THEN** el contenido NO SHALL moverse, y el render prop SHALL recibir `isActive: true` con offsets en 0

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la atracción SHALL funcionar normalmente aunque la preferencia esté activa

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, con el contenido visible en su posición original hasta la hidratación
