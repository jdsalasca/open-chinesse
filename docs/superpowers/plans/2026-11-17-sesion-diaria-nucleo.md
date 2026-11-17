# C19 — Sesión diaria y familia del radical

**Goal:** Cerrar la sesión diaria con un ritual de producción real y profundizar la ficha con la familia del radical.

**Architecture:**

- `src/lib/daily.ts`: carácter, frase y palabras del día deterministas por unidad y fecha.
- `src/store/daily-session.ts`: tres pasos (`review`, `lesson`, `close`), con salto de repaso y unidad de foco.
- `src/screens/DailyClose.tsx`: carácter del día con mini-quiz, frase del día con audio y producción con modelo.
- Home: CTA «Empezar la sesión de hoy» y paso «Cierre».
- Ficha: `radicalFamily` y tarjeta «Familia del radical».

**Tech Stack:** React + TypeScript, Vitest, SCSS.

## Tareas

- [x] Tests de datos diarios y de la máquina de pasos.
- [x] Reemplazar Tonos por Cierre en la sesión: recuperar → aprender → producir.
- [x] Cierre con carácter, mini-quiz, frase escuchada, producción y autoevaluación.
- [x] CTA de sesión y barra con pasos reales (sin repaso si no hay tarjetas).
- [x] Familia del radical filtrada al curso.
- [x] Feedback de opción incorrecta en rosa, no en verde.
- [x] QA de escritorio y móvil; tests, build, deploy y push.
