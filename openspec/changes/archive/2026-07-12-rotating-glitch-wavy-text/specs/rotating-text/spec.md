## ADDED Requirements

### Requirement: RotatingText rota cíclicamente entre palabras con transición animada

`RotatingText` SHALL renderizar un texto base opcional y una palabra rotante que cicla por una lista (`words`) con una transición animada entre cada una. SHALL exponer `transition` con presets `fade`, `slide-up` y `flip` (default `slide-up`), `interval` (ms que cada palabra permanece visible) y `loop` (default `true`; con `false` se detiene en la última palabra). El avance SHALL implementarse con timers (sin RAF) y la transición con CSS inyectado.

#### Scenario: Rotación en loop

- **WHEN** el consumer pasa `words={['webs', 'apps', 'magia']}` con `loop` default
- **THEN** las palabras SHALL mostrarse cíclicamente en orden, con la transición elegida entre cada una

#### Scenario: Detención en la última

- **WHEN** el consumer pasa `loop={false}`
- **THEN** la rotación SHALL detenerse al llegar a la última palabra de la lista

#### Scenario: Preset de transición

- **WHEN** el consumer pasa `transition="flip"`
- **THEN** el cambio de palabra SHALL animarse con el volteo 3D del preset

### Requirement: RotatingText mantiene el layout estable entre palabras

El contenedor de la palabra rotante SHALL transicionar su ancho suavemente al cambiar entre palabras de largos distintos, evitando saltos bruscos del contenido circundante. La medición del ancho SHALL ocurrir solo al cambiar de palabra (no por frame).

#### Scenario: Palabras de largos distintos

- **WHEN** la rotación pasa de una palabra corta a una larga
- **THEN** el ancho SHALL ajustarse con una transición suave, sin salto instantáneo del texto circundante

### Requirement: RotatingText es accesible sin spamear lectores de pantalla

El root SHALL exponer un `aria-label` estático que incluya el texto base y la lista completa de palabras; la palabra animada visible SHALL ser `aria-hidden`. El componente NO SHALL usar `aria-live` para anunciar cada rotación.

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el componente
- **THEN** SHALL anunciar el contenido una sola vez (texto base + palabras), sin interrupciones por cada ciclo

### Requirement: RotatingText es customizable via props y CSS custom properties

Los parámetros estéticos y de timing (`interval`, duración de la transición, color de la palabra rotante) SHALL exponerse como props con defaults razonables y materializarse como CSS custom properties con namespace `--aui-rotating-*` en el root, pisables desde CSS en cascada.

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mi-hero { --aui-rotating-color: #0ea5e9; }`
- **THEN** la palabra rotante SHALL renderizarse con ese color

### Requirement: RotatingText respeta prefers-reduced-motion

`RotatingText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el componente SHALL mostrar la primera palabra de la lista de forma estática, sin rotación.

#### Scenario: Palabra fija con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** SHALL mostrarse la primera palabra sin ciclos ni transiciones

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la rotación SHALL operar aunque la preferencia esté activa

### Requirement: RotatingText es SSR-safe y extensible

`RotatingText` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render (el markup SSR contiene la primera palabra). SHALL aceptar `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el markup SHALL contener la primera palabra
