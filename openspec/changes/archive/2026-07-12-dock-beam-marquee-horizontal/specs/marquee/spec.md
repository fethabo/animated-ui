## ADDED Requirements

### Requirement: Marquee desplaza su contenido en una cinta infinita sin costura

`Marquee` SHALL desplazar a sus `children` en loop continuo y sin costura visible: el contenido SHALL duplicarse internamente (la copia marcada `aria-hidden`) y la pista SHALL animarse con CSS puro (keyframes de `translate`), sin JavaScript por frame en el modo base. Si el contenido es más angosto que el contenedor, el componente SHALL repetirlo las veces necesarias para llenar la pista (medición única, no por frame).

#### Scenario: Loop sin costura

- **WHEN** la cinta completa un ciclo
- **THEN** la transición al siguiente ciclo SHALL ser imperceptible (sin salto ni hueco)

#### Scenario: Contenido angosto

- **WHEN** los children ocupan menos ancho que el contenedor
- **THEN** el contenido SHALL repetirse hasta llenar la pista sin huecos

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el componente
- **THEN** SHALL anunciar el contenido una sola vez (las copias duplicadas son `aria-hidden`)

### Requirement: Marquee expone dirección, velocidad y pausa en hover

`Marquee` SHALL exponer `direction` (`left` default, `right`, `up`, `down` — las verticales para columnas), `speed` (px/s o duración del ciclo) y `pauseOnHover` (default `false`; con `true`, la animación SHALL pausarse mientras el cursor está sobre la cinta y reanudarse al salir, sin salto).

#### Scenario: Dirección inversa

- **WHEN** el consumer pasa `direction="right"`
- **THEN** la cinta SHALL desplazarse hacia la derecha

#### Scenario: Pausa en hover

- **WHEN** `pauseOnHover` está activo y el cursor entra a la cinta
- **THEN** el desplazamiento SHALL pausarse en su posición actual y reanudarse al salir

### Requirement: Marquee soporta un modo opcional acoplado a la velocidad de scroll

`Marquee` SHALL exponer `scrollVelocity` (default `false`). Activado, la velocidad de la cinta y una inclinación (skew) sutil SHALL responder a la velocidad de scroll de la página via el scroll-driver del paquete, escribiendo CSS vars sin re-renders de React por frame. Sin scroll, la cinta SHALL mantener su velocidad base.

#### Scenario: Scroll acelera la cinta

- **WHEN** `scrollVelocity` está activo y el usuario scrollea rápido
- **THEN** la cinta SHALL acelerar e inclinarse sutilmente en la dirección del scroll, volviendo a su estado base al detenerse el scroll

#### Scenario: Modo base sin costo de scroll

- **WHEN** `scrollVelocity` es `false`
- **THEN** el componente NO SHALL suscribirse al scroll-driver

### Requirement: Marquee es customizable via props y CSS custom properties

Los parámetros estéticos (`speed`, `gap` entre repeticiones, máscara de fade en los extremos via `fadeEdges`) SHALL exponerse como props con defaults razonables y materializarse como CSS custom properties con namespace `--aui-marquee-*` en el root, pisables desde CSS en cascada.

#### Scenario: Fade en los extremos

- **WHEN** el consumer pasa `fadeEdges`
- **THEN** los extremos de la cinta SHALL desvanecerse con una máscara de gradiente

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-cinta { --aui-marquee-gap: 48px; }`
- **THEN** la separación entre repeticiones SHALL usar el valor de la cascada

### Requirement: Marquee respeta prefers-reduced-motion

`Marquee` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, la cinta SHALL renderizarse estática mostrando el contenido sin desplazamiento (una sola pasada visible, sin duplicados desbordantes que confundan).

#### Scenario: Estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el contenido SHALL verse estático, sin desplazamiento

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la cinta SHALL desplazarse aunque la preferencia esté activa

### Requirement: Marquee es SSR-safe y extensible

`Marquee` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render (la medición para repeticiones ocurre en efecto). SHALL aceptar `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores con el contenido presente en el markup
