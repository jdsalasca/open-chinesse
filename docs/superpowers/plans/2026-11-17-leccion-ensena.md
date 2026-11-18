# C27 — La lección enseña antes de preguntar

**Goal:** Corregir la primera exposición de una palabra nueva, fijar la acción principal y hacer que el pinyin muestre el tono real de cada sílaba.

**Architecture:**

- `Lesson.tsx`: la tarjeta muestra significado y ejemplo desde el inicio; se elimina el revelado en lección; la acción queda fija y el feedback se autoenfoca.
- `lib/lesson.ts`: la primera comprobación de cada unidad es reconocimiento; tono y hueco llegan después de varias palabras.
- `lib/tone.ts`: separador de sílabas pinyin para colorear y numerar cada tono.
- `_lesson.scss` y `_components.scss`: barra fija, leyenda de tonos y limpieza del revelado.

## Tareas

- [x] Primera exposición con hanzi, pinyin, audio, significado y ejemplo.
- [x] Eliminar «Mostrar significado / No lo recuerdo» de la lección.
- [x] Acción principal fija y siempre visible.
- [x] Auto-scroll al feedback para que «Siguiente» quede a la vista.
- [x] Dificultad progresiva: reconocer → escuchar → hueco → tono.
- [x] Pinyin dividido en sílabas con color y número de tono correctos.
- [x] Tests, QA visual, despliegue y push.
