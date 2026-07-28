# shiny-text Specification

## Purpose
Componente `ShinyText`: texto con un brillo que lo barre en loop, implementado exclusivamente con CSS (gradiente animado con `background-clip: text`), customizable via props y CSS custom properties, accesible, SSR-safe y respetuoso de `prefers-reduced-motion`.

## Requirements

### Requirement: ShinyText renderiza texto con un brillo que lo barre en loop usando solo CSS

`ShinyText` SHALL renderizar sus `children` (texto) en un `<span>` cuyo efecto de brillo se implementa exclusivamente con CSS: `background-clip: text` (con prefijo `-webkit-`), color de texto transparente y un gradiente animado via `@keyframes` de `background-position` inyectados con `injectStyles`. El componente NO SHALL ejecutar JavaScript por frame de animación.

#### Scenario: Brillo en loop autónomo

- **WHEN** `ShinyText` se monta con sus defaults
- **THEN** una franja de brillo barre el texto en loop continuo, animada por CSS keyframes sin ningún callback de RAF ni listener activo

#### Scenario: El texto sigue siendo texto real

- **WHEN** un usuario selecciona, copia o lee el contenido con un lector de pantalla
- **THEN** el texto se comporta como un nodo de texto normal (el efecto vive solo en el background)

#### Scenario: Browser sin soporte de background-clip text

- **WHEN** el browser no soporta `-webkit-background-clip: text`
- **THEN** el CSS inyectado SHALL restaurar el color base del texto via `@supports`, sin dejar el texto invisible

### Requirement: El gradiente de ShinyText es customizable via props y CSS custom properties

`ShinyText` SHALL exponer el color base, el color del brillo, la velocidad del loop y el ángulo del barrido como props con defaults razonables, materializadas como `--aui-shiny-color`, `--aui-shiny-highlight`, `--aui-shiny-speed` y `--aui-shiny-angle` seteadas inline en el elemento root.

#### Scenario: Texto con gradiente custom (caso GradientText)

- **WHEN** el consumer pasa colores custom de base y brillo
- **THEN** el texto renderiza con ese gradiente, cubriendo el caso de uso de texto con gradiente animado sin componente adicional

#### Scenario: Override via CSS en cascada

- **WHEN** un consumer define `.mi-clase { --aui-shiny-speed: 5s; }` sobre el componente
- **THEN** el valor de la cascada SHALL prevalecer sobre el default de la prop

### Requirement: ShinyText respeta prefers-reduced-motion desactivando el loop

`ShinyText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el barrido en loop SHALL desactivarse, dejando el texto con su gradiente estático en la posición inicial.

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y `respectReducedMotion` no fue desactivado
- **THEN** el texto renderiza con el gradiente estático, sin animación de barrido

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el barrido anima normalmente

### Requirement: ShinyText es SSR-safe y extensible

`ShinyText` SHALL incluir `'use client'`, NO SHALL acceder a `window`/`document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de `<span>` aplicadas al elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en Next.js App Router o Astro
- **THEN** el render SHALL completarse sin errores, produciendo el texto estático hasta la hidratación

#### Scenario: Integración con clases del consumer

- **WHEN** el consumer pasa `className` y `style`
- **THEN** ambos SHALL aplicarse al root sin pisar los estilos funcionales del efecto


## ADDED Requirements

### Requirement: ShinyText es consumible en modo clase

El efecto SHALL ser consumible aplicando `class="aui-shiny"` a cualquier elemento de texto, cumpliendo el contrato de la capability `css-class-mode`, con todos sus parámetros (`color`, `highlight`, `speed`, `angle`) disponibles como CSS vars. El loop SHALL activarse por la clase (sin atributo seteado por JS) y desactivarse bajo `prefers-reduced-motion: reduce` salvo opt-out `data-aui-motion`. El componente SHALL conservar su API pública y su semántica de `respectReducedMotion`.

#### Scenario: Clase sobre un heading ajeno

- **WHEN** el consumer aplica `class="aui-shiny"` y `style="--aui-shiny-speed: 5s"` a un `<h1>` con el CSS disponible
- **THEN** el barrido de brillo SHALL ejecutarse en loop de 5s sin JS de la librería

#### Scenario: Reduced motion en modo clase

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y el elemento no tiene `data-aui-motion`
- **THEN** el texto SHALL mostrarse con el gradiente estático, sin animación
