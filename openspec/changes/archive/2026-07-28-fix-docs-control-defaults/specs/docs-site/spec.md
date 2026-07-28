# docs-site Specification (delta)

## ADDED Requirements

### Requirement: Los defaults y rangos de los controles son fieles a la API de la librería

El descriptor de controles de un demo SHALL ser fiel a la API real del componente, verificado en build contra `src/generated/props.json` (derivado del source de la librería). El build SHALL validar dos invariantes por control:

1. **Default fiel** — el `default` del control SHALL coincidir con el `defaultValue` de la prop en la librería, comparado tras normalizar comillas envolventes, arrays de strings (elemento a elemento), booleanos y números.
2. **Rango alcanzable** — para controles `number`, el `defaultValue` de la librería SHALL caer dentro de `[min, max]`.

Un control MAY declarar `override: string` con el motivo de una divergencia deliberada, lo que lo exime de la invariante 1. `override` NO SHALL eximir de la invariante 2: un demo puede arrancar en otro valor, pero NO SHALL impedir que el usuario alcance el comportamiento por defecto del componente.

Los controles cuyo `defaultValue` la generación de props no logra resolver (defaults en objetos `DEFAULTS`, paletas constantes) NO SHALL contarse como aprobados: el build SHALL reportarlos como no verificables, con su total, para que el agujero de cobertura sea visible.

#### Scenario: Error de unidad en un control

- **WHEN** un demo declara `{ prop: 'duration', min: 200, max: 1200, default: 500 }` para una prop cuyo default en la librería es `0.4` segundos
- **THEN** el build de la docs SHALL fallar identificando el componente, la prop, el rango declarado y el default inalcanzable de la librería

#### Scenario: Divergencia deliberada declarada

- **WHEN** un demo enciende una prop booleana que en la librería viene apagada (p. ej. `glare` en TiltCard) y declara `override` con el motivo
- **THEN** el build SHALL aceptar el control y el demo SHALL seguir renderizándose con el valor elegido por la docs

#### Scenario: Divergencia sin declarar

- **WHEN** el default de un control difiere del de la librería y el control no declara `override`
- **THEN** el build SHALL fallar mostrando ambos valores

#### Scenario: Default no resoluble

- **WHEN** la prop de un control tiene `defaultValue: null` en el `props.json` generado
- **THEN** el build SHALL emitir un warning listando esos controles y su total, sin fallar

## MODIFIED Requirements

### Requirement: Los demos pueden exponer un panel de controles interactivo

Un demo SHALL poder declarar un descriptor de controles (`export const controls`)
con inputs tipados (number, boolean, enum, color, text, multi). Cuando el demo
declara controles, la vista SHALL renderizar un panel que varía las props del
demo en runtime, sin recargar, y SHALL incluir siempre un control para
`respectReducedMotion`. Un demo sin controles declarados SHALL seguir
renderizándose sin panel.

El panel SHALL aplicar el `default` de cada control como prop del demo desde el
mount, sin esperar interacción del usuario. En consecuencia el default declarado
en el control —y no el de la librería— SHALL ser el que gobierna el render
inicial, y SHALL cumplir el requisito de fidelidad de controles.

El estado del panel SHALL reinicializarse a los valores por default del demo
actual al navegar a otra vista de componente: NO SHALL conservar valores del
componente anterior ni exponer `undefined` para props que el componente actual
no declara. El panel SHALL ofrecer un control "Reset" que devuelva todas las
props a sus valores por default.

El panel SHALL ubicarse fuera del frame recortado del demo (no como overlay
dentro de un contenedor `overflow:hidden`), de modo que todos los controles sean
accesibles independientemente de la altura del demo. Los demos que scrollean
contra la ventana (flow / full-bleed) SHALL mantener el panel anclado al
viewport.

El panel SHALL mostrar un snippet de código generado en vivo con las props
seleccionadas, incluyendo **únicamente** las props cuyo valor difiere de su
default (`respectReducedMotion` incluido solo si se lo modificó), y SHALL ofrecer
un botón para copiar ese snippet al portapapeles. Este snippet builder es una
salida separada y NO SHALL reemplazar ni modificar los dos tabs de ejemplo
(Uso del paquete / Standalone), que permanecen estables.

#### Scenario: Variar una variante en runtime

- **WHEN** el usuario abre un demo con un control `enum` para una prop de variante (p. ej. AnimatedBackground `variant`) y elige otra opción
- **THEN** el demo SHALL re-renderizarse con la variante elegida sin recargar la página

#### Scenario: Demo sin controles

- **WHEN** un demo no declara `controls`
- **THEN** la vista SHALL montar el demo directamente, sin panel de controles

#### Scenario: Control de movimiento reducido siempre presente

- **WHEN** se abre el panel de controles de cualquier demo que los declare
- **THEN** SHALL existir un control para `respectReducedMotion` aunque el demo no lo haya declarado explícitamente

#### Scenario: Estado reiniciado al navegar entre componentes

- **WHEN** el usuario ajusta controles en un componente A y luego navega a un componente B que declara controles distintos (o con props de nombre coincidente)
- **THEN** el panel de B SHALL mostrar los valores por default de B, sin heredar valores de A ni exhibir `undefined`, y el demo de B NO SHALL recibir props ajenas

#### Scenario: Reset a valores por default

- **WHEN** el usuario modifica varios controles y acciona "Reset"
- **THEN** todos los controles SHALL volver a sus valores por default y el demo SHALL re-renderizarse acorde

#### Scenario: Panel accesible en demos de poca altura

- **WHEN** un demo de poca altura declara suficientes controles como para exceder el alto del frame
- **THEN** todos los controles SHALL ser visibles y operables (el panel NO SHALL quedar recortado por el frame del demo)

#### Scenario: Snippet builder con solo props modificadas

- **WHEN** el usuario cambia una prop respecto de su default y deja el resto en default
- **THEN** el snippet generado SHALL incluir únicamente la(s) prop(s) modificada(s), y el botón de copiar SHALL colocar ese snippet en el portapapeles con confirmación visual

#### Scenario: El demo arranca con el valor del control

- **WHEN** el usuario abre un demo con controles y no interactúa con el panel
- **THEN** el componente SHALL haberse montado con el `default` de cada control como prop, no con el default de su propia API
