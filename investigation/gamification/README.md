# Gamificación

**Pregunta:** ¿qué mecánicas aumentan la práctica sin secuestrar el objetivo?

## Evidencia

| Fuente                      | Hallazgo                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Barasch & Silverman (2023)  | La racha se vuelve el objetivo; al romperse, se abandona o se cambia de idioma      |
| ACM L@S (2022)              | _Gamification misuse_: usuarios optimizando métricas, no aprendiendo                |
| Estudio mixto (2026, n=155) | Racha: 58 % la ve útil, 40 % la asocia con presión; leaderboards, 45 % con malestar |
| IDC (2026, 50 familias)     | "Goal drift": mantener la métrica en vez de aprender                                |

## Principios

1. **Recompensa el esfuerzo, no la asistencia.** XP por repaso y por lección, no por
   abrir la app.
2. **Nada que se pueda perder.** Sin vidas, sin corazones, sin "se rompió tu racha".
3. **Sin comparación social.** Cero leaderboards y cero ligas.
4. **El progreso se puede exportar.** El usuario puede irse con sus datos.

## Mecánicas implementadas

| Mecánica             | Regla                                                     | Por qué                                  |
| -------------------- | --------------------------------------------------------- | ---------------------------------------- |
| XP                   | Otra vez 2 · Difícil 5 · Bien 10 · Fácil 12 · Lección +20 | Premia acertar, no el tiempo en pantalla |
| Meta diaria          | 30 XP, anillo de progreso                                 | Objetivo corto y alcanzable              |
| Nivel                | Curva suave (`nivel = floor(sqrt(XP/120)) + 1`)           | Progreso visible sin techo artificial    |
| Estrellas por unidad | 3 si ≥90 % en la práctica, 2 si ≥70 %, 1 si se completa   | Feedback de calidad, no de velocidad     |
| Logros               | 6 hitos de dominio                                        | Reconocimiento sin comparación           |
| Confeti              | Al completar unidad y al subir de nivel                   | Celebración puntual, no bucle            |

## Mecánicas descartadas

| Descartada        | Motivo                                         |
| ----------------- | ---------------------------------------------- |
| Corazones / vidas | Convierte el error en castigo y empuja a pagar |
| Leaderboards      | Fuente principal de presión reportada          |
| Racha con pérdida | Abandono tras la ruptura                       |
| Notificaciones    | Re-engagement, no aprendizaje                  |
| Moneda / tienda   | Complejidad sin beneficio pedagógico           |

## Riesgo asumido

Sin presión externa, la adherencia será menor que la de un diseño agresivo. Se
elige no dañar y medir retención honesta (precisión a 30 días), no DAU.

## Cómo se mide

- Semana 1: ¿el usuario vuelve al día siguiente sin notificación?
- Semana 4: precisión a 30 días por encima del 85 %.
- Si la meta diaria genera ansiedad (quejas), se vuelve opcional en ajustes.
