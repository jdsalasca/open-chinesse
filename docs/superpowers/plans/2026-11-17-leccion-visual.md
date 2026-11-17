# C25 — Estética de la lección

**Goal:** Hacer que la lección se sienta como la pieza principal del producto: más profundidad visual, progreso legible por rondas y feedback con jerarquía, sin añadir pantallas ni tocar FSRS.

**Architecture:**

- `Lesson.tsx`: progreso por rondas, tarjeta con marca de agua, etiquetas de modo con icono, marcas de acierto/error y resumen con anillo.
- `ExampleBlock.tsx`: resalta la palabra objetivo dentro de la frase.
- `_lesson.scss`, `_components.scss`, `_character.scss`, `_motion.scss`: profundidad, color por modo, microinteracciones y `prefers-reduced-motion`.
- `ProgressRing` existente reutilizado en el resumen.

## Tareas

- [x] Progreso segmentado por rondas, con segmento actual y completados.
- [x] Tarjeta con línea de acento, resplandor, marca de agua del hanzi y divisor editorial.
- [x] Ejemplo con la palabra objetivo resaltada.
- [x] Preguntas con etiqueta de modo, icono y tinte por tipo.
- [x] Opciones con marca de check/equis y feedback en banner.
- [x] Resumen con anillo de aciertos, estrellas y palabras pendientes en tarjetas.
- [x] Pulso del audio, hover elevado y movimiento reducido.
- [x] Verificación, QA visual, despliegue y push.
