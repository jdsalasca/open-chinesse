# SRS: por qué FSRS y no SM-2

## Decisión

`ts-fsrs` 6.0 con FSRS-6, retención objetivo 0.90, cuatro calificaciones e
intervalo visible antes de elegir.

## Evidencia

| Fuente                       | Hallazgo                                                            |
| ---------------------------- | ------------------------------------------------------------------- |
| Benchmark SRS (350M repasos) | FSRS-6 supera a Anki SM-2 en el 99,6 % de los usuarios              |
| FSRS v4 vs media             | log loss 0.3726 vs 0.3945                                           |
| Settles & Meeder (2016)      | Un modelo entrenable mejora retención diaria ~12 % frente a Leitner |
| Rowland (2014)               | El repaso espaciado multiplica el efecto de la recuperación         |

La comparación con SM-2 tiene una trampa conocida: SM-2 no predice probabilidad de
recuerdo, así que el benchmark le añade fórmulas para poder medirlo. Sirve para
ordenar, no para afirmar una mejora exacta.

## Qué implementamos

- `preview()` calcula las cuatro fechas antes de mostrar los botones.
- Pasos de aprendizaje (1 min, 10 min) re-encolados en la misma sesión.
- Tarjetas corruptas se reinician en vez de romper la sesión
  (`isUsableCard`).
- Los pesos son los de fábrica; optimizar por usuario requiere ≥1000 repasos.

## Límites

- El benchmark mide calibración predictiva, no aprendizaje por minuto.
- No hay datos propios todavía: la primera métrica honesta será la precisión a 30
  días de nuestros usuarios.

## Referencias

- open-spaced-repetition/srs-benchmark (GitHub).
- Settles, B. & Meeder, B. (2016). _A Trainable Spaced Repetition Model for
  Language Learning._ ACL. DOI: 10.18653/v1/P16-1174
- Rowland, C. (2014). The Effect of Testing Versus Restudy on Retention.
  _Psychological Bulletin_, 140(6).
