# C16 — Gramática en contraste: 不 / 没

**Goal:** Que el alumno distinga 不 y 没 con una explicación breve, 7 ítems de
práctica, 5 ítems reservados para una prueba diferida a 7 días y un registro
visible de su resultado.

**Architecture:** Contenido en `src/data/grammar.ts`; lógica pura de
programación en `src/lib/grammar.ts`; progreso por tema en el store (v11,
campo nuevo compatible); pantalla `/gramatica` y `/gramatica/:topicId` con
sesión de práctica y prueba diferida.

**Tech Stack:** React + TypeScript, Zustand persist, SCSS, Vitest.

## Constantes

- Práctica: 7 ítems. Prueba diferida: 5 ítems distintos.
- Repaso de práctica a los 3 días; prueba diferida a los 7 días.
- La prueba se guarda solo la primera vez (mide el primer intento).
- Sin audio nuevo ni puntuación de pronunciación.

## Tareas

### 1. Contenido y lógica (TDD)

- Test: 1 tema, nivel 1, 7 + 5 ítems, ids únicos, una sola respuesta correcta,
  explicación y transcripción en cada ítem, prueba disjunta de práctica.
- Test: `afterPractice` fija `dueAt` +3d y `checkAt` +7d; `afterCheck` no
  sobrescribe; `grammarStage` recorre new → scheduled → practice-due →
  check-ready → checked.
- Implementar `src/data/grammar.ts` y `src/lib/grammar.ts`.

### 2. Progreso (TDD)

- Test de store: guardar práctica, limpiar fallo, guardar prueba una vez,
  exportar/hidratar incluye `grammar`.
- Implementar `grammar` en `LearnerPayload`/`LearnerState`, migración v11,
  normalización, `partialize`, `exportPayload` y acciones.

### 3. Ruta y navegación

- Test de router: `#/gramatica` y `#/gramatica/bu-mei`.
- Añadir ruta, `App` (foco de sesión) y tarjeta en Practicar.

### 4. Pantalla

- Lista con estado del tema: sin empezar, repaso disponible, prueba lista,
  resultado.
- Introducción con reglas y contrastes.
- Sesión de práctica con feedback específico y resumen.
- Repaso de fallos y prueba diferida de 5 ítems.
- SCSS `_grammar.scss`, a11y y móvil.

### 5. Cierre

- `prettier`, `tsc -b`, `vitest`, ESLint externo, Stylelint, `pnpm build`.
- QA en navegador (escritorio y 390×844), capturas en `.screens/audit/`.
- Evidencia en `docs/evidence/`, plan/roadmap, commit, deploy, QA en
  producción y push a `develop` y `main`.
