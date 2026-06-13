## Context

El repositorio ya publica una librería npm con `package.json` y `CHANGELOG.md`, pero el flujo de release no está formalizado por una herramienta propia en esta change. El objetivo de esta propuesta es convertir `@fethabo/tagman` en la capa responsable de generar el changelog desde el historial de commits y de sincronizar la versión del paquete al momento de taguear una release.

El diseño debe respetar los criterios del proyecto: cero dependencias de runtime, zero-config para consumidores y separación clara entre código de producto y tooling de release.

## Goals / Non-Goals

**Goals:**
- Definir `@fethabo/tagman` como herramienta de release del repositorio.
- Hacer que `CHANGELOG.md` se derive de commits previos, no de edición manual por release.
- Hacer que `package.json` se actualice automáticamente al crear un nuevo tag.
- Mantener el tooling fuera del runtime del paquete publicado.

**Non-Goals:**
- Cambiar la API pública de los componentes.
- Reescribir el pipeline de build o publicación completo.
- Introducir dependencias nuevas en runtime o en el bundle consumible.
- Definir en detalle la implementación interna de `@fethabo/tagman`.

## Decisions

1. **`@fethabo/tagman` será el origen del flujo de release**
   La herramienta propia manejará la generación del changelog y la actualización de versión para evitar procesos manuales divergentes.
   Alternativa considerada: mantener el release flow manual con scripts ad hoc. Se descarta por fragilidad y por el riesgo de que changelog y versión se desalineen.

2. **El changelog se calcula desde commits entre tags**
   La entrada de release debe salir del historial de commits desde el release anterior hasta el nuevo tag. Esto hace trazable el porqué de cada release y evita mantener notas duplicadas o incompletas.
   Alternativa considerada: escribir el changelog a mano o desde un archivo de notas intermedio. Se descarta porque agrega más mantenimiento y un paso más que puede quedar desactualizado.

3. **`package.json` se actualiza al taguear, no durante el desarrollo normal**
   La versión solo debe mutar como parte del flujo de release para que el árbol de trabajo no dependa de cambios manuales previos. Esto mantiene clara la separación entre estado de desarrollo y estado de publicación.
   Alternativa considerada: versionar manualmente en commits de desarrollo. Se descarta porque hace más probable el drift entre el número de versión y el tag real.

4. **La herramienta de release no se convierte en dependencia del paquete publicado**
   `@fethabo/tagman` debe vivir fuera del runtime y del surface consumible de `@fethabo/animated-ui`.
   Alternativa considerada: empaquetarla junto al proyecto o invocarla desde código de producto. Se descarta porque violaría el objetivo de cero dependencias de runtime.

## Risks / Trade-offs

- [La calidad de los commits afecta la calidad del changelog] -> Mitigación: definir y documentar una convención de commits suficientemente consistente para que `tagman` agrupe cambios de forma útil.
- [Existe drift entre el `package.json` actual y el último release publicado] -> Mitigación: hacer una primera release de reconciliación y luego dejar que `tagman` sea la fuente de verdad al taguear.
- [El tooling de release agrega una pieza nueva al proceso] -> Mitigación: mantener `tagman` como CLI simple y separada del runtime para reducir superficie de mantenimiento.
- [La automatización puede ocultar cambios manuales deseados] -> Mitigación: permitir revisión previa del output de release antes de publicar el tag final.

## Migration Plan

1. Adoptar `@fethabo/tagman` como flujo estándar de release.
2. Reconciliar una vez el estado actual de versión y changelog con el primer tag generado por la herramienta.
3. A partir de ese punto, considerar `tagman` la fuente de verdad para nuevas releases.
4. Eliminar o desaconsejar pasos manuales de edición de `CHANGELOG.md` y `package.json` para releases futuras.

## Open Questions

- ¿Qué convención exacta de commits debe asumir `tagman` para agrupar entradas del changelog?
- ¿El tag de release será siempre semver puro o habrá sufijos adicionales para pre-releases?
- ¿La ejecución de `tagman` ocurrirá localmente, en CI o en ambos contextos?
