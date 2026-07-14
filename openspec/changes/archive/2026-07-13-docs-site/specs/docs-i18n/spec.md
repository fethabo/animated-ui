# docs-i18n

## ADDED Requirements

### Requirement: El idioma vive en la ruta y es seleccionable

La app SHALL soportar español e inglés con el idioma como primer segmento de ruta (`/es/...`, `/en/...`). El header SHALL ofrecer un selector que cambia de idioma conservando la vista actual. La raíz `/` SHALL redirigir al idioma preferido (última selección persistida, o `navigator.language`, con fallback a `en`).

#### Scenario: Cambio de idioma conservando la vista

- **WHEN** el usuario está en `/es/components/dock` y selecciona EN
- **THEN** la app SHALL navegar a `/en/components/dock` y persistir la preferencia

#### Scenario: Primera visita a la raíz

- **WHEN** un usuario sin preferencia guardada y con navegador en español abre `/`
- **THEN** la app SHALL redirigir a `/es/`

### Requirement: Todo el contenido visible existe en ambos idiomas

El chrome de la UI SHALL traducirse mediante diccionarios tipados por idioma. La prosa por componente SHALL existir como `<slug>.es.md` y `<slug>.en.md`. Las descripciones de la tabla de props SHALL mostrarse en inglés desde el JSDoc extraído y en español desde una capa de traducción (`props.es.json`, mapa `componente.prop → descripción`).

#### Scenario: Vista en español

- **WHEN** el usuario abre `/es/components/tilt-card`
- **THEN** título, prosa, labels de UI y descripciones de props SHALL estar en español

#### Scenario: Los ejemplos de código son idioma-neutros

- **WHEN** el usuario cambia de idioma en una vista de componente
- **THEN** los bloques de código SHALL permanecer idénticos (no se traducen)

### Requirement: Las traducciones faltantes rompen el build

El build SHALL validar cobertura de traducción: clave de diccionario ausente en un idioma, prosa faltante en un idioma, o prop pública sin entrada en `props.es.json` SHALL producir un fallo de build que identifique la clave o prop faltante.

#### Scenario: Prop nueva sin traducción al español

- **WHEN** la librería agrega una prop con JSDoc en inglés y no se agrega su entrada en `props.es.json`
- **THEN** el build de la docs SHALL fallar señalando `componente.prop`

#### Scenario: Traducción huérfana

- **WHEN** `props.es.json` contiene una entrada para una prop que ya no existe
- **THEN** el build SHALL reportarla (al menos como warning) para permitir su limpieza
