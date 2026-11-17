# C20 — Detective de confusables y Cambia la intención

**Goal:** Dos mecánicas nuevas que entrenan discriminación visual y transferencia de significado, sin gamificación vacía.

**Architecture:**

- `src/data/transformations.ts`: 20 pares base → intención → transformación con distractores explicados.
- `src/screens/Transformation.tsx`: ronda de 10 transformaciones con feedback del cambio mínimo.
- `src/lib/detective.ts`: pares de confundibles del curso con significado, opciones y explicación.
- `src/screens/Detective.tsx`: ronda de 10 pares con feedback y enlace a la ficha.
- Tarjetas en Practicar, rutas `/intencion` y `/detective`, actividad registrada.

**Tech Stack:** React + TypeScript, Vitest, SCSS.

## Tareas

- [x] Tests de datos y generadores.
- [x] 20 transformaciones revisadas con una sola respuesta correcta.
- [x] Ronda de transformación: frase base, intención, opciones y «qué cambió».
- [x] Generador de confundibles solo con caracteres del curso y significados distintos.
- [x] Ronda de detective: dos caracteres, significado, feedback y ficha.
- [x] Rutas, tarjetas, estilos y actividad.
- [x] QA de escritorio/móvil, tests, build, deploy y push.
