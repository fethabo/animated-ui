# magnetic-element Specification

## Purpose
Componente `MagneticElement`: wrapper que atrae su contenido hacia el cursor dentro de una zona de atracción configurable (hit-area por padding), con retorno elástico (WAAPI con momentum), render prop de estado (`MagneticState`) y respeto de `prefers-reduced-motion`.

## Requirements

### Requirement: MagneticElement atrae su contenido hacia el cursor con retorno elástico
El componente SHALL trasladar su contenido hacia la posición del cursor mientras este se encuentra dentro de la zona de atracción, usando WAAPI con interpolación que preserva momentum (patrón de TiltCard aplicado a `translate`). Al salir el cursor, el contenido SHALL volver a su posición original con easing elástico (overshoot).

#### Scenario: Atracción dentro de la zona
- **WHEN** el cursor se mueve dentro de la zona de atracción
- **THEN** el contenido SHALL desplazarse suavemente hacia el cursor, proporcionalmente a la distancia al centro

#### Scenario: Retorno elástico
- **WHEN** el cursor sale de la zona de atracción
- **THEN** el contenido SHALL regresar a su posición original con un leve rebote elástico

### Requirement: La zona de atracción se define con padding transparente (hit-area)
El componente SHALL aceptar la prop `hitArea` (px, default `40`) que agranda el área sensible alrededor del contenido mediante padding transparente en el root. NO SHALL usarse un listener global de `window` para detectar proximidad.

#### Scenario: Atracción antes de tocar el contenido
- **WHEN** el cursor entra al hit-area sin estar aún sobre el contenido visible
- **THEN** el contenido ya SHALL comenzar a desplazarse hacia el cursor

#### Scenario: Hit-area colapsado
- **WHEN** el consumer pasa `hitArea={0}`
- **THEN** el wrapper SHALL ocupar solo el tamaño de su contenido y la atracción SHALL activarse al entrar en él

### Requirement: La intensidad de atracción es configurable
El componente SHALL aceptar la prop `strength` (0 a 1, default `0.35`) que escala cuánto se desplaza el contenido hacia el cursor.

#### Scenario: Atracción sutil
- **WHEN** el consumer pasa `strength={0.15}`
- **THEN** el desplazamiento máximo SHALL ser notablemente menor que el default

#### Scenario: Atracción fuerte
- **WHEN** el consumer pasa `strength={0.8}`
- **THEN** el contenido SHALL seguir al cursor de forma pronunciada

### Requirement: MagneticElement expone su estado via render prop
El componente SHALL aceptar `children` tanto como `ReactNode` simple como función `(state: MagneticState) => ReactNode`, donde `MagneticState = { offsetX: number, offsetY: number, isActive: boolean }`.

#### Scenario: Children estáticos (caso común)
- **WHEN** el consumer pasa elementos React normales como children
- **THEN** el componente SHALL renderizarlos y aplicar la traslación magnética al contenedor del contenido

#### Scenario: Children como función para efectos derivados
- **WHEN** el consumer pasa una función como children
- **THEN** SHALL recibir `offsetX`/`offsetY`/`isActive` actualizados para construir efectos derivados (sombras, glow, escala)

### Requirement: MagneticElement acepta className, style y demás props HTML del div
El componente SHALL pasar todas las props no reconocidas al elemento root `<div>`, permitiendo uso normal de className, style, aria attributes, etc.

#### Scenario: Uso como wrapper de un botón
- **WHEN** el consumer envuelve un `<button>` con su propio className
- **THEN** el botón SHALL conservar sus estilos y comportamiento, sumando el efecto magnético

### Requirement: MagneticElement respeta prefers-reduced-motion
Con la preferencia activa y `respectReducedMotion` en su default `true`, el componente NO SHALL trasladar el contenido: `offsetX` y `offsetY` SHALL permanecer en 0, mientras `isActive` sigue reportándose para que el consumer pueda aplicar efectos alternativos sin movimiento (precedente: TiltCard).

#### Scenario: Sin desplazamiento con reduced motion
- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el cursor entra a la zona de atracción
- **THEN** el contenido NO SHALL moverse, y el render prop SHALL recibir `isActive: true` con offsets en 0

#### Scenario: Opt-out explícito
- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la atracción SHALL funcionar normalmente aunque la preferencia esté activa
