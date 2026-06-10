## Why

Sin una convención definida para el `README.md`, cada vez que se agrega o modifica un componente la documentación queda desactualizada o inconsistente. Establecer este spec como parte del proyecto garantiza que el README sea siempre la fuente de verdad sobre qué componentes existen y cómo usarlos.

## What Changes

- **Nuevo spec `readme-docs`**: define el formato obligatorio del `README.md`, incluyendo una tabla de componentes con descripción y props documentadas
- **Convención de actualización**: cada change que agregue o modifique componentes DEBE incluir una tarea de actualización del README como parte de su checklist
- **Creación del README inicial**: se genera el `README.md` base del proyecto `@fethabo/animated-ui` cubriendo los tres componentes de `animated-ui-foundation`

## Capabilities

### New Capabilities

- `readme-docs`: Define el formato y contenido requerido del `README.md`. Incluye estructura de la tabla de componentes, documentación de props, y la convención de mantenerlo actualizado en cada change.

### Modified Capabilities

## Impact

- **Archivo afectado**: `README.md` en la raíz del proyecto (creado si no existe)
- **Proceso**: todos los changes futuros que modifiquen la API pública de componentes (agregar, renombrar, o eliminar props) deben actualizar la tabla del README como parte de sus tareas
- **Sin impacto en código**: este change es puramente documental
