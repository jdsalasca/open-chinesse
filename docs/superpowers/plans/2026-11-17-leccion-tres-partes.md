# C28 — Lección en tres partes e historias con velocidad

**Goal:** Convertir cada lección en tres tramos con repaso intermedio y dar al lector de historias control de velocidad y progreso.

**Architecture:**

- `lib/lesson.ts`: tres partes (3 + 3 + resto), tarjeta de repaso y preguntas de repaso.
- `Lesson.tsx`: fase `review`, cabecera por parte y repaso sin significados a la vista.
- `components/SpeedControl.tsx`: 0.75×, 1× y 1.25×.
- `lib/story-audio.ts`: `playbackRate` aplicado a cada línea y al cambio en caliente.
- `Stories.tsx` y `Bedtime.tsx`: control de velocidad y barra de avance.

## Tareas

- [x] Tres partes por lección con cabecera y progreso de 3 segmentos.
- [x] Tarjeta «Parte X completada» con las palabras y «Empezar el repaso».
- [x] Repaso después de cada parte; el de la última cierra con dos frases.
- [x] Repaso sin significados visibles.
- [x] Control de velocidad en Historias y Cuentos para dormir.
- [x] Barra de avance y velocidad aplicada a la línea actual y a las siguientes.
- [x] Tests, QA visual, despliegue y push.
