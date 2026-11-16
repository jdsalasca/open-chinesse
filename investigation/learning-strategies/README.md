# Estrategias de aprendizaje en humanos

**Pregunta:** ¿qué hacen los aprendices eficaces que una app puede provocar sin
convertirse en un curso de metacognición?

## Lo que la evidencia sostiene

| Estrategia                | Evidencia                              | Efecto típico                                                                       |
| ------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| Práctica distribuida      | Cepeda et al. (2006), 317 experimentos | Retención superior a la práctica masiva; el espaciado óptimo crece con el intervalo |
| Práctica intercalada      | Rohrer & Taylor (2007)                 | Mejor discriminación entre categorías, peor sensación subjetiva                     |
| Recuperación con feedback | Rowland (2014)                         | g = 0.50; con feedback g = 0.73                                                     |
| Autoexplicación           | Chi et al. (1994)                      | Más profundo que releer, sobre todo tras un error                                   |
| Calibración metacognitiva | Dunning-Kruger; Karpicke (2009)        | Los aprendices predicen mal su recuerdo; la fluidez engaña                          |
| Dificultad deseable       | Bjork (2011)                           | Condiciones que frenan la sesión mejoran la retención                               |
| Motivación autónoma       | Deci & Ryan (SDT)                      | La presión externa reduce la persistencia; la autonomía la sostiene                 |

## Qué implica para el producto

1. **El espaciado ya está** (FSRS). No hace falta tocarlo.
2. **Intercalar por unidad** (ya implementado en la cola) es la forma barata de
   interleaving: mezcla temas sin pedirle al usuario que lo entienda.
3. **La autoexplicación es lo que falta.** Tras un fallo, pedir "¿por qué te
   confundiste?" o mostrar la regla que diferencia dos palabras convierte el error
   en aprendizaje. Es el hueco más grande frente a HelloChinese.
4. **Calibrar la confianza**: antes de revelar, un botón "seguro / dudo" permite
   comparar confianza con acierto. Barato de implementar y muy informativo.
5. **No castigar el error**: la presión externa compite con la motivación autónoma.

## Plan de implementación (R6)

| Pieza                                  | Coste | Evidencia que la respalda     |
| -------------------------------------- | ----- | ----------------------------- |
| Micro-explicación tras error (por qué) | Medio | Chi 1994; feedback de Rowland |
| Botón de confianza antes de revelar    | Bajo  | Karpicke 2009                 |
| Ejercicio de ordenar frases            | Medio | Generación; Swain 2000        |
| Ejercicio de escucha sin texto         | Bajo  | HVPT; Wang 1999               |
| Informe semanal de calibración         | Bajo  | Metacognición                 |

## Cómo se medirá

- Precisión a 30 días antes/después de introducir autoexplicación.
- Diferencia entre confianza declarada y acierto (calibración).
- Abandono de la sesión cuando el error se explica frente a cuando no.

## Límites

- Casi toda la evidencia viene de laboratorio con textos y listas; transferirla a
  una app de idiomas exige medir en producción.
- La autoexplicación en chino para principiantes puede ser imposible sin andamiaje:
  se haría con opciones, no con texto libre.
