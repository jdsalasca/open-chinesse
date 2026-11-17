# C21 — ¿Qué pasó en la escena?

**Goal:** Entender una micro-lectura globalmente y justificar la respuesta con una línea del texto.

**Architecture:**

- `src/data/scenes.ts`: 15 preguntas de resumen con evidencia por índice de línea.
- `src/lib/scene-quiz.ts`: tanda diaria de 8 escenas con opciones barajadas.
- `src/screens/Scene.tsx`: lectura/escucha sin traducción, elección de resumen, selección de evidencia y revelado.
- Tarjeta en Practicar y ruta `/escena`.

**Tech Stack:** React + TypeScript, Vitest, SCSS, audio existente de micro-lecturas.

## Tareas

- [x] 15 preguntas vinculadas a micro-lecturas y a una línea de evidencia.
- [x] Tanda de 8 con opciones de resumen barajadas y test de posición.
- [x] Historia sin pinyin/traducción hasta elegir evidencia; audio por línea.
- [x] Elección de resumen + elección de evidencia + feedback y cita.
- [x] Doble puntuación: resumen y evidencia.
- [x] QA, tests, build, deploy y push.
