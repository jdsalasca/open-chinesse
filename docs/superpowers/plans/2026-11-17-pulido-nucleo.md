# C23 — Pulido didáctico y visual del núcleo

**Goal:** Mejorar el momento entre la respuesta y el siguiente ejercicio, añadir recuperación antes de revelar y un ejemplo resuelto, y unificar el movimiento sin distraer.

**Architecture:**

- `Lesson`: flashcard con significado oculto, revelado opcional y feedback con contraste + ejemplo.
- `Grammar`: ejemplo resuelto antes de la práctica de 不/没.
- `_motion.scss`, `_components.scss`, `_lesson.scss`, `_grammar.scss`, `_base.scss`: movimiento sobrio, fade de feedback, hover discreto y fondo con halo mint.
- `prefers-reduced-motion` respetado.

**Investigación:** recuperación (Roediger y Karpicke, 2006), ejemplos resueltos y desvanecimiento (Renkl y Atkinson, 2003), carga cognitiva (Sweller et al., 2020).

## Tareas

- [x] Recuperación antes de revelar en la lección, con «Mostrar significado» y «No lo recuerdo».
- [x] Feedback de quiz con contraste elegido/respuesta y frase de ejemplo.
- [x] Ejemplo resuelto de 不/没 antes de practicar.
- [x] Movimiento 180 ms, fade de feedback, hover de botón y halo de fondo.
- [x] `prefers-reduced-motion` sin desplazamientos ni animaciones.
- [x] Tests, build, QA, deploy y push.
