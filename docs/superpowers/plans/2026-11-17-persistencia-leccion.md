# C29 — Persistencia de la parte de lección

**Goal:** Que la lección retome la parte donde se quedó el alumno y que el avance sea visible también en la portada.

**Architecture:**

- `src/lib/lesson-progress.ts`: guarda 1–3 por unidad en `localStorage`.
- `Lesson.tsx`: filtra el plan desde la parte guardada, guarda al entrar en una parte nueva y limpia al terminar.
- `Home.tsx`: muestra «Continuar: … · parte X/3».
- `lesson-progress.test.ts`: guarda, separa por unidad y limpia.

## Tareas

- [x] Guardar la parte actual por unidad.
- [x] Retomar la lección en esa parte al recargar o volver.
- [x] Limpiar el progreso al completar la última parte.
- [x] Mostrar la parte en el botón de continuar de la portada.
- [x] Tests, QA visual, despliegue y push.
