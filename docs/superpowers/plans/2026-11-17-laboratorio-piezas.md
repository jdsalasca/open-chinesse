# C22 — Laboratorio de piezas

**Goal:** Convertir la composición del carácter en una mecánica activa: clasificar cada pieza como significado o sonido.

**Architecture:**

- `src/lib/piece-quiz.ts`: rondas de 8 caracteres con piezas clasificables, roles y explicación.
- `src/screens/PieceLab.tsx`: clasificador táctil, comprobación, feedback y enlace a la ficha.
- Tarjeta en Practicar, ruta `/piezas` y enlace desde la ficha cuando hay roles.

**Tech Stack:** React + TypeScript, Vitest, SCSS.

## Tareas

- [x] Generador de rondas con al menos dos piezas por carácter, filtrado al curso.
- [x] Clasificador accesible: botones significado/sonido con `aria-pressed`.
- [x] Comprobar deshabilitado hasta clasificar todo; feedback por pieza y explicación.
- [x] Resumen, otra tanda y actividad `pieces`.
- [x] Enlace desde la ficha y tarjeta en Practicar.
- [x] QA, tests, build, deploy y push.
