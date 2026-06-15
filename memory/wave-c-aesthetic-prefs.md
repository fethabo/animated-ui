---
name: wave-c-aesthetic-prefs
description: Preferencias estéticas del usuario para los efectos de canvas generativo (Wave C)
metadata:
  type: feedback
---

Al revisar visualmente los componentes de canvas generativo, el usuario priorizó **configurabilidad y fidelidad física** por sobre defaults rígidos:

- **CircuitBackground**: prefiere trazos **continuos y largos** (no fragmentados/interrumpidos); la cantidad de trazos debe escalar con `density`.
- **TeslaCoil**: la interacción con el cursor debe **notarse claramente** — como en una bobina real, los rayos hacia la mano/cursor son más fuertes (gruesos/brillantes) que los ambientales.
- **AttentionCue**: prefiere **mostrar solo la luz** (destello con glow que aparece y desaparece), no "luz sobre línea sólida"; todo configurable (punta, curvatura, grosor).
- **GuidingBranches**: NO lo quería como "guía" hacia un target, sino como **interacción del puntero pausado con su entorno**: expansión 360° desde el puntero hasta una frontera configurable, con trazo intercambiable (ramas/rayos/circuitos ortogonales). Decisión tomada: `target` queda **opcional** (default ambient 360°).

**Why:** el usuario evalúa estos efectos por su sensación visual/realismo y quiere poder ajustarlos, no aceptar un único look.

**How to apply:** al sumar/ajustar efectos de canvas (Tier 4/5), exponer props de estilo abundantes con CSS vars `--aui-*`, ofrecer modos "solo luz/glow", y preferir comportamientos ambientales/físicos. Ver [[wave-c-canvas-primitives]] si existe.
