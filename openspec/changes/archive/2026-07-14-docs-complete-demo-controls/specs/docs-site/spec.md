# docs-site (delta)

## ADDED Requirements

### Requirement: Todo demo expone controles completos para sus props controlables

Cada demo de componente SHALL declarar controles que cubran todas sus props
públicas controlables — escalares (number), booleanas, enumeradas y de color —
usando el `props.json` generado como checklist de cobertura. Las props no
controlables SHALL excluirse según una lista de exclusión explícita y versionada
(contenido/children, refs/handles, `className`/`style`, props de función,
`seed`, `target`, `src`/`alt`). El build SHALL fallar si un demo no declara
controles o si le falta un control para una prop controlable no excluida.

#### Scenario: Demo sin cobertura completa

- **WHEN** un componente expone una prop pública controlable (p. ej. una prop de color) y su demo no declara un control para ella
- **THEN** el build de la docs SHALL fallar identificando el componente y la prop sin control

#### Scenario: Prop excluida no exige control

- **WHEN** una prop es de contenido, función, ref, `className`/`style`, `seed`, `target` o `src`/`alt`
- **THEN** el build NO SHALL exigir un control para ella

### Requirement: Los demos con props de color exponen controles de color

Todo demo cuyo componente tenga props de color SHALL exponerlas como controles:
una prop de color simple como control `color` (selección libre), y una prop de
paleta (`colors[]`) como control `multi` de swatches que permita variar la
paleta en runtime.

#### Scenario: Color simple

- **WHEN** el usuario abre el panel de un demo con una prop de color simple
- **THEN** SHALL ver un control de color que, al cambiarlo, actualiza el demo en vivo

#### Scenario: Paleta

- **WHEN** el componente acepta una paleta `colors[]`
- **THEN** el panel SHALL ofrecer un control de swatches para variar qué colores integran la paleta, reflejándose en el demo

### Requirement: El panel de controles es alcanzable en demos de layout flow

El panel de controles SHALL permanecer alcanzable en los demos con
`demoLayout: 'flow'` (scroll-driven / sticky, de alto grande) mientras se
scrollea el demo (posicionamiento fijo al viewport), sin quedar fuera de vista.

#### Scenario: Demo alto scroll-driven

- **WHEN** el usuario scrollea un demo `flow` con controles
- **THEN** el toggle del panel SHALL seguir visible y operable
