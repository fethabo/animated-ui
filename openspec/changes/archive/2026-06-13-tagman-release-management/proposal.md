## Why

Hoy el release flow queda repartido entre el repositorio y procesos manuales, lo que hace más frágil mantener coherentes el changelog y la versión publicada del paquete. Centralizar ese flujo en `@fethabo/tagman` reduce errores operativos y hace explícito cómo se genera cada release.

## What Changes

- Define un flujo de release propio basado en `@fethabo/tagman` para manejar changelog y versionado.
- Establece que el changelog se genera a partir de los commits previos del repositorio.
- Establece que el `package.json` se actualiza por la herramienta al momento de taguear una nueva versión.
- Formaliza el comportamiento esperado para releases futuras sin depender de pasos manuales dispersos.

## Capabilities

### New Capabilities
- `release-management`: especifica cómo `@fethabo/tagman` construye el changelog desde el historial de commits y actualiza la versión del paquete durante el tag de release.

### Modified Capabilities
- None.

## Impact

Afecta el proceso de release del repositorio, la generación de `CHANGELOG.md`, el versionado de `package.json` y la documentación del flujo de publicación asociada a `@fethabo/tagman`.
