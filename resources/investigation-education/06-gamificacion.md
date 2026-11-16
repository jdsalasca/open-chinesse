# 06 — Gamificación: qué mecánicas suman y cuáles dañan

**Pregunta:** ¿qué mecánicas de juego debe tener una app de aprendizaje para no
degenerar en "mantener el contador"?

## Hallazgos

### Barasch & Silverman (2023)
Estudio con usuarios reales de una app de idiomas (Universidad de Colorado Boulder,
reseña: https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch):
- La racha se convierte en **el objetivo en sí**, con valor independiente del
  aprendizaje.
- Al romperse, la gente **abandona la actividad o cambia de idioma** en lugar de
  empezar una racha nueva: el registro roto deja de "representarlos".

### ACM Learning @ Scale (2022)
*When Gamification Spoils Your Learning: A Qualitative Case Study of Gamification
Misuse in a Language-Learning App.* DOI: 10.1145/3491140.3528274

Análisis de 9 años de foros + 15 entrevistas. "Gamification misuse": usuarios que se
fijan en puntos, ligas y rachas y se distraen del aprendizaje. Consecuencia: pagan
tiempo en tareas triviales para mantener métricas.

### Estudio mixto 2026 (155 usuarios)
*Gamification and perceived long-term engagement in language learning.*
La racha es la mecánica mejor valorada (M = 3.03/5, 58% la considera la más útil),
pero **40% la asocia con presión o malestar**; los leaderboards son la mayor fuente de
presión (45,16%). Recomendación: mecánicas que apoyan continuidad sin volverse
controladoras ni punitivas.

### Dark patterns (IDC 2026, familias)
*The Evil Bird and the Right to Disconnect: Children's Vulnerability to Exit Dark
Patterns in Gamified Educational Apps.* Documenta "goal drift" (mantener la métrica en
vez de aprender), obligación gamificada (culpa al parar) y fricción de salida
(notificaciones tras desinstalar). 41 de 50 familias reportaron dificultad para parar.

## Implicaciones para Open Chinesse

1. **Racha informativa, sin castigo.** Se muestra "días seguidos", pero romperla no
   borra progreso ni pinta la pantalla de rojo. No hay "streak freeze" de pago.
2. **Cero leaderboards y cero ligas.** No hay comparación social en la v1.
3. **Sin notificaciones ni re-engagement.** Es una app web local; no persigue al usuario.
4. **Métricas honestas al usuario**: palabras dominadas, precisión y pronóstico de
   repasos. Nada de "XP" que no signifique nada.
5. **Salida fácil.** El usuario puede borrar su progreso en un clic desde Estadísticas,
   sin fricción ni confirmaciones oscuras.
6. **El mensaje de la Home no culpa**: si no hay racha, invita a empezar, no a "no
   perder".

## Límites

- Los estudios citados son cualitativos o de percepción, no experimentos controlados
  sobre resultados de aprendizaje.
- La racha puede aumentar la adherencia en algunos perfiles; eliminarla del todo
  también tiene costo. Se elige la versión que no daña, no la que maximiza retención.
- No hay datos propios todavía; en la v2 se puede medir adherencia sin dark patterns.
