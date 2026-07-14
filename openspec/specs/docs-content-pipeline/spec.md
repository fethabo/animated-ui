# docs-content-pipeline Specification

## Purpose

Definir el pipeline de contenido de la web de documentación: cómo se deriva el índice de componentes desde los `exports` de `package.json` cruzados con un manifest curado, cómo se generan las tablas de props desde los JSDoc de `types.ts`, la verificación de completitud de artefactos por componente, y el highlighting de código resuelto en build time.

## Requirements

### Requirement: El índice de componentes se deriva de los exports de package.json

El registry de la docs SHALL construirse en build time cruzando los subpath `exports` de `package.json` (fuente canónica de lo publicado) con un manifest curado que aporta categoría, slug y referencias a demo/prosa/ejemplo. Los entry points no-componente (e.g. `.`) SHALL excluirse mediante lista explícita.

#### Scenario: Componente publicado sin entrada en el manifest

- **WHEN** `package.json` declara un subpath export sin entrada correspondiente en el manifest
- **THEN** el build de la docs SHALL fallar indicando el componente faltante

#### Scenario: Entrada del manifest sin export

- **WHEN** el manifest referencia un slug que no existe en los `exports` de `package.json`
- **THEN** el build de la docs SHALL fallar indicando la entrada huérfana

### Requirement: Las tablas de props se generan desde los JSDoc de types.ts

Un script de extracción SHALL generar, antes del build y del dev server, un JSON por componente con sus props públicas (nombre, tipo, requerido, default, descripción tomada del JSDoc en inglés) usando análisis estático de `src/**/types.ts`. El JSON generado NO SHALL editarse a mano; correcciones puntuales SHALL expresarse como overrides en el manifest.

#### Scenario: Prop nueva en la librería

- **WHEN** un componente agrega una prop con JSDoc en `types.ts` y se corre el build de la docs
- **THEN** la tabla de props de su vista SHALL incluir la prop nueva sin edición manual del JSON

#### Scenario: Extracción incorrecta de una prop compleja

- **WHEN** el extractor produce tipo o default incorrecto para una prop
- **THEN** el manifest SHALL poder declarar un override para esa prop, y el override SHALL prevalecer sobre lo extraído

### Requirement: Todo componente del registry tiene su contenido completo o el build falla

Para cada componente del registry, el build SHALL verificar la existencia de: prosa en ambos idiomas (`<slug>.es.md` y `<slug>.en.md`), demo (`docs/src/demos/<slug>`), ejemplo standalone (`examples/<slug>.tsx`) y snippet de uso del paquete. Cualquier faltante SHALL romper el build con un mensaje que identifique componente y artefacto.

#### Scenario: Componente nuevo publicado sin página de docs

- **WHEN** se agrega un componente a los `exports` y no se crea su prosa o su demo
- **THEN** el build de la docs SHALL fallar listando exactamente qué artefactos faltan para ese slug

### Requirement: El highlighting de código se resuelve en build time

Los bloques de código (ejemplos y snippets) SHALL convertirse a HTML resaltado durante el build (e.g. Shiki). El bundle del cliente NO SHALL incluir una librería de syntax highlighting.

#### Scenario: Bundle sin highlighter

- **WHEN** se inspecciona el bundle de producción de la docs
- **THEN** NO SHALL contener un tokenizer/highlighter de código en runtime
