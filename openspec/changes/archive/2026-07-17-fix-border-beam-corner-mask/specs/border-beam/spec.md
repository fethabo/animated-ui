## MODIFIED Requirements

### Requirement: BorderBeam hace recorrer un cometa de luz por el perímetro del borde

`BorderBeam` SHALL envolver a sus `children` y dibujar un cometa de luz (cabeza brillante con estela en degradé) que recorre el perímetro del borde del contenedor en loop continuo, siguiendo el `border-radius` del contenedor. El recorrido SHALL implementarse con CSS puro (`offset-path: border-box` + `offset-distance` animado), sin JavaScript por frame. El cometa SHALL quedar visualmente confinado al anillo del borde (la banda de espesor `borderWidth` entre `border-box` y `padding-box`, enmascarada con `mask-clip`/`mask-composite`): ninguna parte del cometa —incluida la estela— SHALL dibujarse fuera del contenedor ni cruzar las esquinas redondeadas en línea recta. En browsers sin soporte de `offset-path: border-box` o del enmascarado compuesto requerido, el cometa SHALL ocultarse sin afectar al contenedor ni a los `children` (degradación via `@supports`).

#### Scenario: Cometa en loop

- **WHEN** el componente está montado
- **THEN** el cometa SHALL recorrer el perímetro completo del borde en loop, incluyendo esquinas redondeadas

#### Scenario: Estela confinada al anillo en esquinas redondeadas

- **WHEN** el contenedor tiene `border-radius` y el cometa atraviesa una esquina
- **THEN** la estela SHALL verse recortada al anillo del borde, sin sobresalir del contenedor ni atravesar la esquina en línea recta

#### Scenario: Browser sin offset-path

- **WHEN** el browser no soporta `offset-path: border-box`
- **THEN** el contenedor y sus children SHALL renderizarse normalmente, sin cometa y sin errores

#### Scenario: Browser sin enmascarado compuesto

- **WHEN** el browser no soporta el enmascarado compuesto requerido para confinar el cometa al anillo
- **THEN** el cometa SHALL ocultarse por completo (nunca mostrarse sin máscara), y el contenedor y sus children SHALL renderizarse normalmente
