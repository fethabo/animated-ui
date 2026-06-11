# mouse-parallax Delta Spec

## ADDED Requirements

### Requirement: MouseParallax desplaza capas según la posición del mouse sin re-renders de React

`MouseParallax` SHALL trackear `mousemove` sobre su root y escribir `--aui-parallax-x`/`--aui-parallax-y` (normalizadas a [-1, 1] respecto del centro del contenedor) directamente sobre el elemento, sin pasar por estado de React. Las capas SHALL desplazarse con CSS puro (`calc()` sobre esas vars), suavizadas con una transition que corre en el compositor.

#### Scenario: Mouse se mueve dentro del contenedor

- **WHEN** el usuario mueve el mouse dentro del componente
- **THEN** las capas SHALL desplazarse proporcionalmente a su `depth` y a la distancia del cursor al centro, sin re-renderizar los children

#### Scenario: Cursor sale del contenedor

- **WHEN** el cursor sale del componente
- **THEN** las capas SHALL volver suavemente a su posición original (vars en 0)

### Requirement: Las capas se declaran con MouseParallax.Layer y profundidad configurable

El paquete SHALL exponer `MouseParallax.Layer`, que acepta `depth` (px de desplazamiento máximo; positivo sigue al mouse, negativo se opone) y renderiza un contenedor que se traslada según las vars del root. `depth` SHALL materializarse como `--aui-parallax-depth` inline en la capa.

#### Scenario: Capas con profundidades opuestas

- **WHEN** el consumer declara una capa con `depth={30}` y otra con `depth={-15}`
- **THEN** al mover el mouse la primera SHALL desplazarse hacia el cursor y la segunda en dirección contraria, con la mitad de amplitud

### Requirement: El parallax es customizable via props y CSS custom properties

El suavizado del movimiento SHALL exponerse como prop (`ease`, en segundos) materializada como `--aui-parallax-ease` (default `0.2s`), pisable desde CSS en cascada.

#### Scenario: Override del suavizado via CSS

- **WHEN** un consumer define `.mi-escena { --aui-parallax-ease: 0.5s; }`
- **THEN** las capas SHALL seguir al mouse con ese tiempo de suavizado

### Requirement: MouseParallax respeta prefers-reduced-motion quedando estático

`MouseParallax` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el handler NO SHALL escribir las vars de posición: las capas SHALL permanecer en su posición original (desplaza contenido real, mismo criterio que TiltCard/MagneticElement).

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y el usuario mueve el mouse sobre el componente
- **THEN** las capas NO SHALL desplazarse

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el parallax SHALL funcionar normalmente

### Requirement: MouseParallax es SSR-safe y extensible

`MouseParallax` y `MouseParallax.Layer` SHALL incluir `'use client'`, NO SHALL acceder a `window`/`document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de sus elementos root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, con las capas en su posición original hasta la hidratación
