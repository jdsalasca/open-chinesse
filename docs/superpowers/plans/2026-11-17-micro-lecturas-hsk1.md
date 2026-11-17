# C17 — Micro-lecturas HSK 1 por unidad

**Goal:** Quince textos de 3–4 líneas, uno por unidad de HSK 1, con audio por
línea y una pregunta de comprensión. Alimentan Historias, Comprensión auditiva
y Repite en voz alta sin pantallas nuevas.

**Architecture:** `src/data/micro.ts` con las 15 historias y `unitId`; se
anteponen a `STORIES`. Los generadores de escucha y shadowing ya leen
`STORIES`, así que heredan el contenido. Validación por tests: HSK 1, una por
unidad, pregunta única y al menos dos palabras de la unidad.

**Tech Stack:** React + TypeScript, Vitest, Piper para audio, SCSS existente.

## Decisiones

- 15 textos, `kind: 'micro-lectura'`, `level: 1`, `minutes: 1`.
- Vocabulario HSK 1 completo (el test existente ya lo exige); cada texto ancla
  al menos dos palabras de su unidad.
- Una pregunta por texto con tres opciones y explicación.
- Sin pantalla nueva: Historias muestra las tarjetas; Escucha y Repite las
  recogen automáticamente.
- Audio con Piper; el generador ya recorre `STORIES`.

## Tareas

### 1. Contenido (TDD)

- Test: 15 historias, una por unidad HSK 1, ids únicos, 3–4 líneas, pregunta
  con una sola respuesta, explicación no vacía y ≥2 palabras de la unidad.
- Test existente de graduación: todas las líneas usan solo caracteres HSK 1.
- Implementar `micro.ts` y combinarlas en `STORIES`.

### 2. Integración

- Añadir `unitId` y `kind: 'micro-lectura'` al tipo `Story`.
- Actualizar contadores/copias de Escucha y Repite a valores dinámicos.
- Verificar que Escucha pasa de 6 a 21 audios y Repite de 10 a 25 textos.

### 3. Audio y QA

- Generar los MP3 nuevos con `scripts/build-audio.mjs`.
- QA: Historias (22), micro-lectura HSK 1, audio por línea, Escucha con
  pregunta y Repite con texto HSK 1; móvil sin desbordamiento.
- `prettier`, `tsc -b`, `vitest`, ESLint externo, Stylelint, `pnpm build`.
- Evidencia, plan/roadmap, commit, deploy, QA en producción y push.
