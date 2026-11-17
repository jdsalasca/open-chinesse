# C24 — Lección activa

**Goal:** Convertir la lección de un recorrido pasivo de tarjetas en un ciclo corto de enseñar → recuperar, con variedad de tareas y una barra de acción siempre visible.

**Architecture:**

- `src/lib/lesson.ts`: genera el plan de pasos (2 palabras nuevas + 2 comprobaciones + 2 frases finales).
- `src/lib/quiz.ts`: añade `answer`, `prompt` y `translation`; modos `tone` y `gap`.
- `src/screens/Lesson.tsx`: recorre el plan, muestra la tarjeta en dos columnas, renderiza los cinco tipos de pregunta y resume las palabras falladas.
- `_lesson.scss`, `_components.scss`: barra sticky, tarjeta en dos columnas, hueco de frase y lista de repaso.
- FSRS y el registro de la lección se mantienen; solo cambia el total de respuestas (12).

## Tareas

- [x] Plan de lección determinista con rondas de 2 palabras.
- [x] Cinco modos: significado, escucha, tono, frase con hueco y ordenar.
- [x] Feedback específico por modo, con contraste y ejemplo.
- [x] Barra de acción sticky y tarjeta en dos columnas.
- [x] Resumen con palabras que merecen otra mirada y audio.
- [x] Tests del plan, del quiz y de la respuesta correcta.
- [x] Verificación, QA visual, despliegue y push.
