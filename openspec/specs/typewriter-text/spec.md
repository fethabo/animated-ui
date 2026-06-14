# typewriter-text Specification

## Purpose
TBD - created by archiving change text-reveal-stacked-cards-lava. Update Purpose after archive.
## Requirements
### Requirement: TypewriterText revela texto carácter por carácter

`TypewriterText` SHALL aceptar la prop `text` (string, requerida) y revelar su contenido carácter por carácter, agregando un carácter por vez hasta mostrar el texto completo. La animación SHALL usar un loop de `requestAnimationFrame` con progresión basada en timestamps (no en cantidad de frames), de modo que la velocidad percibida sea idéntica en displays de 60 Hz y 144 Hz. El componente SHALL mutar el contenido visible directamente por ref, sin re-renders de React por carácter (mismo patrón que `ScrambleText`).

#### Scenario: Escritura al montar

- **WHEN** el componente se monta y `respectReducedMotion` no inhibe la animación
- **THEN** los caracteres SHALL aparecer de a uno desde una cadena vacía hasta el texto completo, a la velocidad configurada

#### Scenario: Cambio de la prop text

- **WHEN** la prop `text` cambia a un nuevo valor
- **THEN** el componente SHALL reiniciar la escritura desde vacío hacia el nuevo texto

### Requirement: La velocidad de escritura es configurable

`TypewriterText` SHALL aceptar la prop `speed` (caracteres por segundo, default razonable) que controla el ritmo de aparición de los caracteres. SHALL aceptar además `startDelay` (ms antes de comenzar a escribir, default `0`).

#### Scenario: Ajustar caracteres por segundo

- **WHEN** el consumer pasa `speed={30}`
- **THEN** el componente SHALL revelar aproximadamente 30 caracteres por segundo

#### Scenario: Retraso de inicio

- **WHEN** el consumer pasa `startDelay={500}`
- **THEN** la escritura SHALL comenzar 500 ms después del montaje

### Requirement: TypewriterText soporta un cursor parpadeante opcional

`TypewriterText` SHALL aceptar la prop `cursor` (`boolean | string`, default `true`). Cuando es activo, SHALL renderizar un cursor al final del texto que parpadea mediante una animación CSS inyectada (sin JS por frame). Cuando `cursor` es un string, ese string SHALL usarse como glifo del cursor (e.g. `"_"`, `"▋"`); cuando es `true` SHALL usarse un glifo default. El cursor SHALL ser `aria-hidden`.

#### Scenario: Cursor default visible durante y después de escribir

- **WHEN** `cursor` es `true`
- **THEN** un cursor parpadeante SHALL mostrarse al final del texto mientras escribe y al terminar

#### Scenario: Glifo de cursor personalizado

- **WHEN** el consumer pasa `cursor="_"`
- **THEN** el cursor SHALL renderizarse con el carácter `_`

#### Scenario: Cursor desactivado

- **WHEN** el consumer pasa `cursor={false}`
- **THEN** NO SHALL renderizarse ningún cursor

### Requirement: TypewriterText soporta modo loop multi-string

`TypewriterText` SHALL aceptar `text` también como `string[]`. Cuando recibe un arreglo y `loop` es `true`, SHALL escribir el primer string, esperar `pauseDuration` ms, borrarlo carácter por carácter, y avanzar al siguiente string, ciclando indefinidamente. SHALL aceptar `deleteSpeed` (caracteres borrados por segundo) y `pauseDuration` (ms de pausa con el string completo). Con `loop` en `false` y un arreglo, SHALL escribir solo el primer string.

#### Scenario: Ciclo entre múltiples strings

- **WHEN** el consumer pasa `text={['Diseño', 'Código', 'Arte']}` y `loop={true}`
- **THEN** el componente SHALL escribir cada string, pausar, borrarlo, y pasar al siguiente, repitiendo desde el primero tras el último

#### Scenario: Velocidad de borrado independiente

- **WHEN** el consumer pasa `deleteSpeed={50}`
- **THEN** el borrado SHALL ocurrir a aproximadamente 50 caracteres por segundo, independiente de `speed`

### Requirement: TypewriterText es accesible durante la animación

El elemento root SHALL exponer un `aria-label` con el texto final (o, en modo multi-string, el conjunto de strings de forma legible) y los caracteres intermedios visibles SHALL estar ocultos a lectores de pantalla, de modo que la tecnología asistiva anuncie el contenido completo y no la animación carácter por carácter.

#### Scenario: Lector de pantalla anuncia el texto completo

- **WHEN** un lector de pantalla inspecciona el componente mientras escribe
- **THEN** SHALL anunciar el texto final completo, no los estados parciales

### Requirement: TypewriterText respeta prefers-reduced-motion

`TypewriterText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, SHALL mostrar el texto final completo de inmediato (en modo multi-string, el primer string), sin animación de escritura ni parpadeo del cursor.

#### Scenario: Texto completo inmediato con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** el texto final SHALL mostrarse completo de inmediato y el cursor (si lo hay) NO SHALL parpadear

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la escritura SHALL animarse aunque la preferencia esté activa

### Requirement: TypewriterText es SSR-safe, customizable y extensible

`TypewriterText` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. La velocidad de parpadeo del cursor SHALL materializarse como CSS custom property `--aui-typewriter-cursor-speed` en el root, pisable desde CSS. El componente SHALL renderizar un `<span>` y aceptar `className`, `style` y el spread de props HTML válidas de `<span>`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, emitiendo el texto (estático) sin acceder al DOM

#### Scenario: Override de la velocidad del cursor via CSS

- **WHEN** el consumer define `.mi-typewriter { --aui-typewriter-cursor-speed: 0.5s; }`
- **THEN** el cursor SHALL parpadear a esa velocidad

