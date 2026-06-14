## ADDED Requirements

### Requirement: Todo componente shippea un panel de controles en el test-app

Cada componente SHALL incluir, en el harness del `test-app`, un panel de controles que exponga sus props configurables (escalares y de tipo array) como controles en vivo, siguiendo la capability `test-app-harness`. El panel SHALL permitir variar esas props en runtime sin recargar, e incluir el control estándar de `respectReducedMotion`. Las props no controlables (render props, `children` complejos, fuentes de imagen) MAY quedar fijas en el demo. Un change que agregue o modifique las props de un componente NO SHALL considerarse completo ni archivarse sin actualizar su panel de controles en el mismo change.

#### Scenario: Componente nuevo sin panel de controles

- **WHEN** un change agrega un componente al paquete sin su panel de controles en el `test-app`
- **THEN** el change NO SHALL considerarse completo ni archivarse

#### Scenario: Cambio de API sin actualizar el panel

- **WHEN** un change agrega, renombra o elimina una prop configurable de un componente existente
- **THEN** el panel de controles de ese componente SHALL actualizarse en el mismo change para reflejar la nueva superficie de props
