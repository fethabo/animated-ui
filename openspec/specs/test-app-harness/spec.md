# test-app-harness Specification

## Purpose

Definir el harness de verificación visual del `test-app`: una infraestructura declarativa para inspeccionar y manipular cada componente del paquete `@fethabo/animated-ui` en runtime. El harness provee un componente de panel de controles genérico que, a partir de un descriptor declarativo (un array de controles), renderiza los inputs correspondientes, mantiene su estado, y expone los valores actuales al demo del componente vía render prop (`(props) => <Componente {...props} />`), logrando binding en vivo prop↔control sin recargar la página.

El harness soporta un conjunto cerrado de tipos de control (`number`, `color`, `enum`, `boolean`, `text`, `multi`), incluye siempre el control estándar de `respectReducedMotion`, y deriva un preset inicial representativo de los `default` de cada descriptor. Registrar un componente es puramente declarativo: basta con declarar su descriptor de controles y su demo en un módulo propio y referenciarlo, reutilizando el panel genérico sin modificarlo. Las props no controlables (render props, `children` complejos, fuentes de imagen) pueden quedar fijas en el demo.

## Requirements

### Requirement: El test-app provee un panel de controles declarativo

El `test-app` SHALL incluir un componente de panel de controles genérico que, a partir de un descriptor declarativo (un array de controles), renderice los inputs correspondientes y mantenga su estado. El panel SHALL exponer los valores actuales al demo del componente vía render prop, de modo que el demo se construya como `(props) => <Componente {...props} />`.

#### Scenario: Render de controles desde un descriptor

- **WHEN** se le pasa al panel un descriptor con N controles
- **THEN** SHALL renderizar un input por control, inicializado con el `default` de cada uno

#### Scenario: Binding en vivo prop↔control

- **WHEN** el usuario modifica el valor de un control
- **THEN** el componente demo SHALL re-renderizarse con la prop correspondiente actualizada, sin recargar la página

### Requirement: El harness soporta un conjunto cerrado de tipos de control

El panel SHALL soportar los tipos de control: `number` (slider con lectura del valor numérico), `color` (selector de color), `enum` (selección de una opción de una lista), `boolean` (toggle on/off), `text` (entrada de texto), y `multi` (selección de cero o más opciones para props de tipo array). Cada tipo SHALL mapear su valor a la prop declarada en el descriptor.

#### Scenario: Control de enumeración

- **WHEN** un control de tipo `enum` con opciones `['aurora', 'beam', 'mesh', 'noise']` se renderiza y el usuario elige `'beam'`
- **THEN** la prop asociada SHALL pasar a valer `'beam'` en el componente demo

#### Scenario: Control multi para prop de tipo array

- **WHEN** un control de tipo `multi` con opciones `['hover', 'idle', 'reveal']` tiene `'hover'` e `'idle'` seleccionados
- **THEN** la prop asociada SHALL valer el array `['hover', 'idle']`

#### Scenario: Control numérico con rango

- **WHEN** un control de tipo `number` declara `min`, `max` y `step`
- **THEN** el slider SHALL restringir el valor a ese rango y mostrar el valor actual

### Requirement: Cada panel incluye el control de respectReducedMotion

Todo panel del harness SHALL incluir un control booleano para `respectReducedMotion`, de modo que el comportamiento de movimiento reducido pueda verificarse desde la UI sin cambiar la configuración del sistema operativo.

#### Scenario: Toggle de movimiento reducido

- **WHEN** el usuario activa el control `respectReducedMotion` en un panel
- **THEN** el componente demo SHALL recibir `respectReducedMotion={true}` y mostrar su estado sin animaciones autónomas

### Requirement: Los defaults del panel reproducen un preset representativo

Los `default` declarados en el descriptor de cada componente SHALL producir un estado inicial visualmente representativo del componente (equivalente al preset previo del `test-app`), de modo que el demo se vea correcto antes de tocar cualquier control.

#### Scenario: Estado inicial sin interacción

- **WHEN** el `test-app` carga un componente sin que el usuario toque sus controles
- **THEN** el componente SHALL renderizarse con un preset representativo derivado de los `default` del descriptor

### Requirement: Registrar un componente en el harness es declarativo

Agregar un componente al harness SHALL consistir en declarar su descriptor de controles y su demo en un módulo propio, sin modificar el componente de panel genérico. Las props no controlables (render props, `children` complejos, fuentes de imagen) MAY quedar fijas en el demo y NO necesitan exponerse como control.

#### Scenario: Alta de un componente nuevo

- **WHEN** se incorpora un componente nuevo al `test-app`
- **THEN** SHALL bastar con agregar su descriptor + demo y referenciarlo, reutilizando el panel genérico existente sin modificarlo

#### Scenario: Componente con render prop

- **WHEN** un componente expone estado vía render prop (e.g. `TiltCard`, `MagneticElement`)
- **THEN** sus props escalares/array SHALL controlarse por el panel y el contenido del render prop MAY permanecer fijo en el demo
