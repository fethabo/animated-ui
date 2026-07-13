# component-authoring (delta)

## ADDED Requirements

### Requirement: Los JSDoc de las props públicas se escriben en inglés

Los comentarios JSDoc de los tipos públicos en `src/**/types.ts` (props, tipos exportados, render-prop states) SHALL escribirse en inglés: son la fuente canónica que ve el consumer npm en el autocomplete y de la que se generan las tablas de props de la web de documentación. Cada JSDoc de prop SHALL conservar el default explícito (`Default: \`<valor>\``) y las notas de comportamiento. Las traducciones al español viven en la capa de contenido de `docs/` y NO SHALL escribirse en el código fuente.

#### Scenario: Componente nuevo con JSDoc en español

- **WHEN** un change agrega o modifica props con JSDoc en español en `types.ts`
- **THEN** el change NO SHALL considerarse completo hasta migrar esos JSDoc a inglés

#### Scenario: Prop con default

- **WHEN** una prop opcional tiene valor default
- **THEN** su JSDoc SHALL declararlo en inglés con el formato `Default: \`<valor>\``

### Requirement: Todo componente se documenta en la web de documentación

Todo componente nuevo o con cambios de API pública SHALL tener su página en `docs/` como parte del definition-of-done: entrada en el manifest del registry con categoría, prosa en español e inglés, demo curado, snippet de uso del paquete, y entradas en `props.es.json` para todas sus props públicas. Esta obligación es adicional a (no reemplaza) la documentación en el README.

#### Scenario: Componente nuevo mergeado sin página de docs

- **WHEN** un change agrega un componente a los `exports` sin sus artefactos en `docs/`
- **THEN** el build de la docs SHALL fallar y el change NO SHALL considerarse completo ni archivarse

#### Scenario: Cambio de props sin actualizar traducciones

- **WHEN** un change agrega o renombra props sin actualizar `props.es.json`
- **THEN** el build de la docs SHALL fallar señalando las props sin traducción
