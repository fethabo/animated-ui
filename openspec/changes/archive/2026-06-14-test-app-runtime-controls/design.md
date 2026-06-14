## Context

El `test-app` es un proyecto Vite mínimo (React + `@fethabo/animated-ui` por `file:..`) cuyo único propósito es la verificación visual obligatoria del paquete buildeado. Hoy [test-app/src/main.jsx](../../../test-app/src/main.jsx) es un archivo único con presets hardcodeados por componente. El issue #3 pide poder variar las props en runtime; además queremos que esto sea un estándar permanente, no un esfuerzo puntual.

Restricciones:
- El `test-app` consume el paquete **buildeado** — los controles solo pueden tocar props públicas, no internals.
- Coherencia con el espíritu del paquete: sin dependencias nuevas; controles con inputs HTML nativos.
- El harness debe escalar: 15 componentes hoy, N mañana. Agregar un componente al harness debe ser declarativo y de bajo costo.

## Goals / Non-Goals

**Goals:**
- Un panel de controles por componente que bindee props en vivo (sin recargar) usando un descriptor declarativo.
- Cubrir las props relevantes de los 15 componentes actuales, con defaults = preset actual.
- Hacer trivial registrar un componente nuevo: declarar su lista de controles.
- Volver el panel parte del definition-of-done (vía delta a `component-authoring`).

**Non-Goals:**
- No es una galería pública ni reemplaza al README o a `/examples`; es una herramienta interna de QA.
- No persiste estado entre recargas, no genera URLs compartibles, no exporta código.
- No introduce librería de UI ni de state management.
- No modifica `src/` ni la API pública de la librería.

## Decisions

### Decisión 1: Descriptor declarativo de controles, no JSX manual por panel

Cada componente declara un array de **descriptores de control**; un componente `ControlPanel` genérico los renderiza y mantiene el estado, devolviendo el objeto de props vivo que se spread-ea al componente demo. Alternativa descartada: escribir el `<input>` y el `useState` a mano por cada prop — repetitivo, inconsistente y difícil de mantener para 15+ componentes. El descriptor centraliza el patrón y hace que "agregar un componente al harness" sea declarar datos, no escribir UI.

Forma del descriptor (un control):
```js
{ prop: 'speed', type: 'number', label: 'Velocidad', min: 1, max: 12, step: 0.5, default: 6 }
{ prop: 'variant', type: 'enum', options: ['aurora', 'beam', 'mesh', 'noise'], default: 'aurora' }
{ prop: 'color', type: 'color', default: '#22d3ee' }
{ prop: 'glare', type: 'boolean', default: true }
{ prop: 'text', type: 'text', default: 'Acceso concedido' }
{ prop: 'behaviors', type: 'multi', options: ['hover', 'idle', 'reveal'], default: ['hover', 'idle', 'reveal'] }
```

### Decisión 2: Conjunto cerrado de tipos de control primitivos

El harness soporta exactamente: `number` (slider + lectura del valor), `color` (`<input type=color>`, con variante texto para rgba cuando haga falta), `enum` (select de una opción), `boolean` (checkbox/toggle), `text` (input de texto), y `multi` (set de checkboxes para props array como `behaviors` y `colors`). Esto cubre todas las props de los componentes actuales. Props que no caben naturalmente (e.g. render props, `children` complejos, `src` de imagen) **no** se controlan: el panel solo expone props configurables escalares/array; el contenido demo queda fijo en el panel. Alternativa descartada: un editor JSON libre por prop — potente pero hostil para QA visual rápido.

### Decisión 3: Estado por panel, aislado; binding por spread

Cada `ControlPanel` mantiene su propio estado (un objeto `{ [prop]: value }` inicializado desde los `default` del descriptor) y expone los valores vía render prop: `<ControlPanel controls={...}>{(props) => <Componente {...props} />}</ControlPanel>`. Así el binding es directo (cambiar un control re-renderiza solo ese demo) y no hay estado global. El `respectReducedMotion` se incluye como control booleano estándar inyectado en todos los paneles.

### Decisión 4: Layout — panel acoplado a cada sección, colapsable

El panel se renderiza junto a su componente dentro de la `Section` (no un panel global tipo Storybook), para mantener el archivo simple y la relación componente↔controles obvia. Es colapsable para no tapar el efecto. Alternativa descartada: un único panel global con selector de componente — más complejo y peor para comparar varios componentes scrolleando.

### Decisión 5: Estructura de archivos del harness

```
test-app/src/
  main.jsx              # arma las Sections, una por componente
  harness/
    ControlPanel.jsx    # panel genérico + render de cada tipo de control
    controls.js         # (opcional) helpers/normalización de descriptores
  demos/
    <Componente>.jsx    # demo + descriptor de controles de ese componente
```
Cada `demos/<Componente>.jsx` exporta el descriptor y el render del demo, de modo que registrar un componente nuevo = agregar un archivo en `demos/` e incluirlo en `main.jsx`. Alternativa descartada: mantener todo en `main.jsx` — no escala y mezcla 15 demos en un archivo.

## Risks / Trade-offs

- **El descriptor puede desincronizarse de las props reales del componente** (prop renombrada en la lib, control que apunta a prop inexistente) → el delta a `component-authoring` exige actualizar el panel en el mismo change que toca la API; la verificación visual lo detecta de inmediato.
- **Props no escalares quedan sin control** (render props, `children`) → aceptado explícitamente; el panel cubre props configurables, el contenido demo queda fijo. Se documenta en la spec.
- **Crecimiento del bundle del test-app** → irrelevante: es una herramienta interna, no se publica.
- **`color` nativo no soporta alpha** → para props que aceptan rgba (e.g. `SpotlightCard.color`) se usa un control `text` o se documenta el límite; el set de tipos lo contempla.

## Open Questions

- Ninguna que bloquee la implementación. La estética del panel (estilos inline mínimos) se resuelve durante el apply.
