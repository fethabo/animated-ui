## Context

Este change es puramente documental. No hay código que diseñar — solo definir el formato del `README.md` y la convención de mantenimiento.

## Goals / Non-Goals

**Goals:**
- Definir el formato canónico del README: estructura, tabla de componentes, documentación de props
- Establecer la convención de que cada change que afecte la API pública de un componente DEBE actualizar el README como tarea explícita

**Non-Goals:**
- Documentación técnica interna (eso pertenece a los specs y design docs de cada change)
- Sitio de documentación web (roadmap v1.0)
- Generación automática desde código fuente (puede considerarse post-v1)

## Decisions

### D1: Una sección por componente, no una mega-tabla

**Decision:** El README tendrá una tabla resumen de componentes al inicio, seguida de una sección `##` por componente con su tabla de props completa.

**Por qué:** Una sola tabla con todas las props de todos los componentes es ilegible. La sección por componente permite navegar directamente al componente de interés y mantener el contexto al leer las props.

### D2: Formato de props: tabla Markdown con columnas fijas

**Decision:** Cada prop se documenta con las columnas `Prop | Tipo | Default | Descripción`. Se usa `—` como valor de Default cuando la prop no tiene default (required).

**Por qué:** Formato familiar para devs React (similar a cómo documenta MUI, Radix, etc.). Legible en GitHub sin renderizador especial.

### D3: La convención de actualización vive en el spec, no en un script

**Decision:** La obligación de actualizar el README es un requisito en el spec `readme-docs`, no un script de CI o linter. Cada change que toque la API pública debe incluir la tarea de actualización manualmente.

**Por qué:** Automatizar la generación de docs desde TypeScript (via `typedoc` o similar) es trabajo de post-v1. Por ahora, la convención documentada es suficiente y más fácil de mantener que configurar tooling adicional.

## Open Questions

- Post-v1: ¿Vale la pena generar la tabla de props automáticamente desde los `.d.ts` o TSDoc comments? Reduciría drift entre código y docs.
