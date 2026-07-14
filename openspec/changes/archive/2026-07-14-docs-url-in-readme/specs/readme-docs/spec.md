# readme-docs (delta)

## ADDED Requirements

### Requirement: El README y la metadata del paquete enlazan la documentación online

El `README.md` SHALL enlazar la URL de la documentación online publicada
(`https://animated-ui-docs.fethabo.cloud`), aclarando que allí se puede ver la
documentación completa y los ejemplos de la última versión. El campo `homepage`
de `package.json` SHALL apuntar a esa misma URL de documentación online.

#### Scenario: Usuario que llega desde npm encuentra la doc online

- **WHEN** un usuario abre el README o la página del paquete en npm
- **THEN** SHALL encontrar un link a `https://animated-ui-docs.fethabo.cloud` descrito como la documentación completa y los ejemplos de la última versión

#### Scenario: El campo homepage lleva a la documentación

- **WHEN** un usuario pulsa el link "homepage" en la página de npm del paquete
- **THEN** el navegador SHALL abrir `https://animated-ui-docs.fethabo.cloud`
