# split-reveal Specification

## Purpose
TBD - created by archiving change text-reveal-stacked-cards-lava. Update Purpose after archive.
## Requirements
### Requirement: SplitReveal parte el texto en unidades y revela cada una con stagger

`SplitReveal` SHALL aceptar la prop `text` (string, requerida) y la prop `split` (`'char' | 'word' | 'line'`, default `'word'`). SHALL partir el texto en unidades según `split` y revelar cada unidad con un delay incremental (stagger) respecto de la anterior. El revelado de cada unidad SHALL ser una CSS transition pura (sin JS por frame): el JavaScript solo togglea el estado revelado.

#### Scenario: Revelado por palabra

- **WHEN** el consumer pasa `text="Hola mundo animado"` y `split="word"`
- **THEN** cada palabra SHALL revelarse en secuencia con un delay incremental entre ellas

#### Scenario: Revelado por línea

- **WHEN** el consumer pasa `split="line"`
- **THEN** el texto SHALL partirse en líneas y cada línea SHALL revelarse en secuencia

#### Scenario: Revelado por carácter

- **WHEN** el consumer pasa `split="char"`
- **THEN** cada carácter SHALL revelarse en secuencia

### Requirement: SplitReveal ofrece presets de animación de entrada

`SplitReveal` SHALL aceptar la prop `preset` (`'fade' | 'slide-up' | 'blur'`, default `'slide-up'`) que determina la animación con que entra cada unidad: `fade` (opacidad), `slide-up` (opacidad + desplazamiento vertical) y `blur` (opacidad + desenfoque que se resuelve). Cada preset SHALL implementarse con CSS transitions sobre propiedades compositables cuando sea posible.

#### Scenario: Preset blur-in

- **WHEN** el consumer pasa `preset="blur"`
- **THEN** cada unidad SHALL entrar desde un estado desenfocado y transparente hasta nítida y opaca

#### Scenario: Preset slide-up por default

- **WHEN** el consumer no pasa `preset`
- **THEN** cada unidad SHALL entrar desde abajo con desplazamiento vertical y fade

### Requirement: SplitReveal dispara al montar o al entrar al viewport

`SplitReveal` SHALL aceptar la prop `trigger` (`'mount' | 'in-view'`, default `'in-view'`). Con `'in-view'` el revelado SHALL dispararse cuando el componente entra al viewport, reutilizando el hook `useInView` (IntersectionObserver). Con `'mount'` SHALL dispararse al montar. SHALL aceptar `threshold` (fracción visible que dispara, default razonable) y `once` (default `true`: no re-oculta al salir del viewport).

#### Scenario: Disparo al entrar al viewport

- **WHEN** `trigger` es `'in-view'` y el componente entra al viewport
- **THEN** el revelado con stagger SHALL comenzar en ese momento

#### Scenario: Re-revelado al re-entrar

- **WHEN** `once` es `false` y el componente sale y vuelve a entrar al viewport
- **THEN** el contenido SHALL re-ocultarse al salir y re-revelarse al re-entrar

### Requirement: SplitReveal es customizable via props y CSS custom properties

`SplitReveal` SHALL exponer `stagger` (segundos de delay incremental entre unidades), `duration` (segundos de la transición de cada unidad) y `distance` (desplazamiento inicial en px para `slide-up`), materializándolos como `--aui-split-stagger`, `--aui-split-duration` y `--aui-split-distance` en el root, pisables desde CSS en cascada. La curva de easing SHALL exponerse como `--aui-split-easing` configurable solo via CSS.

#### Scenario: Override del stagger via CSS

- **WHEN** el consumer define `.mi-split { --aui-split-stagger: 0.05s; }`
- **THEN** el delay incremental entre unidades SHALL ser de 0.05 s

#### Scenario: Ajustar la duración via prop

- **WHEN** el consumer pasa `duration={0.8}`
- **THEN** cada unidad SHALL tardar 0.8 s en revelarse

### Requirement: SplitReveal es accesible pese a partir el texto

Partir el texto en spans rompe la lectura natural, por lo que el elemento root SHALL exponer un `aria-label` con el texto completo original y las unidades partidas SHALL estar marcadas como `aria-hidden`. El espaciado entre palabras y los saltos de línea SHALL preservarse visualmente.

#### Scenario: Lector de pantalla lee el texto completo

- **WHEN** un lector de pantalla inspecciona el componente
- **THEN** SHALL anunciar el texto completo original, no los fragmentos individuales

#### Scenario: Espaciado preservado

- **WHEN** el texto se parte en palabras o caracteres
- **THEN** los espacios entre palabras SHALL preservarse visualmente al renderizar

### Requirement: SplitReveal respeta prefers-reduced-motion

`SplitReveal` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, SHALL mostrar el texto completo de inmediato, sin stagger ni animación de entrada.

#### Scenario: Texto completo inmediato con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** todo el texto SHALL mostrarse revelado de inmediato

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el revelado con stagger SHALL animarse aunque la preferencia esté activa

### Requirement: SplitReveal es SSR-safe y extensible

`SplitReveal` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. El contenido SHALL estar presente en el DOM desde el primer paint (oculto pero presente, para SEO y crawlers), igual que `ScrollReveal`. El componente SHALL renderizar un elemento de texto y aceptar `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor con contenido presente

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el texto SHALL estar presente en el markup estático

#### Scenario: Browser sin IntersectionObserver

- **WHEN** el browser no dispone de IntersectionObserver y `trigger` es `'in-view'`
- **THEN** el contenido SHALL mostrarse revelado (nunca queda oculto)

