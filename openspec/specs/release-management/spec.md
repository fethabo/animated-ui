# release-management Specification

## Purpose
TBD - created by archiving change tagman-release-management. Update Purpose after archive.
## Requirements
### Requirement: @fethabo/tagman genera el changelog a partir del historial de commits
El sistema SHALL usar `@fethabo/tagman` como herramienta de release para construir `CHANGELOG.md` en función de los commits previos del repositorio. La generación SHALL basarse en el tramo de commits desde el release anterior hasta el nuevo tag, sin requerir edición manual del changelog para cada release.

#### Scenario: Release con commits acumulados
- **WHEN** `@fethabo/tagman` ejecuta un nuevo release sobre un conjunto de commits posteriores al tag anterior
- **THEN** el changelog SHALL incluir una entrada derivada de esos commits previos

#### Scenario: Sin edición manual del changelog
- **WHEN** se prepara un release nuevo
- **THEN** el contenido de `CHANGELOG.md` SHALL ser generado por la herramienta y no por una edición manual del archivo

### Requirement: @fethabo/tagman actualiza la versión del paquete al taguear
El sistema SHALL delegar en `@fethabo/tagman` la actualización de la versión declarada en `package.json` cuando se crea un nuevo tag de release. La versión del paquete SHALL quedar alineada con el tag publicado por la herramienta.

#### Scenario: Nuevo tag de release
- **WHEN** `@fethabo/tagman` crea un nuevo tag de versión
- **THEN** `package.json` SHALL quedar actualizado con esa nueva versión

#### Scenario: La versión se mantiene coherente con el tag
- **WHEN** el release se publica con una versión determinada
- **THEN** la versión escrita en `package.json` SHALL coincidir con la versión del tag generado

### Requirement: El flujo de release no introduce dependencias de runtime
`@fethabo/tagman` SHALL operar como una herramienta de release del repositorio y NO SHALL agregarse como dependencia de runtime del paquete publicado.

#### Scenario: Instalación del paquete consumible
- **WHEN** un consumidor instala `@fethabo/animated-ui`
- **THEN** la instalación SHALL no arrastrar `@fethabo/tagman` como dependencia transitive de runtime

#### Scenario: Uso solo durante release
- **WHEN** se ejecuta el proceso de publicación
- **THEN** `@fethabo/tagman` SHALL intervenir solo en el flujo de release y no en la ejecución normal del paquete
