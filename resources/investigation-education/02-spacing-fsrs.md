# 02 — Espaciado y algoritmos de programación (FSRS)

**Pregunta:** ¿cuándo debe volver a aparecer cada palabra?

## Hallazgos

### Benchmark abierto de SRS (`open-spaced-repetition/srs-benchmark`)
Repositorio: https://github.com/open-spaced-repetition/fsrs-benchmark
Datos: 10.000 colecciones de Anki, ~727M repasos; ~350M usados en evaluación tras
filtros. Métricas: log loss, RMSE por bins y AUC sobre la probabilidad de recordar.

Resultados publicados (sin repasos del mismo día):

| Algoritmo | LogLoss ↓ | AUC ↑ |
|---|---|---|
| RWKV (red, 2.7M params) | 0.2773 | 0.8329 |
| GRU | 0.3328 | 0.7324 |
| FSRS-7 | 0.3401 | 0.7167 |
| FSRS-6 (recencia) | ~0.337 | ~0.722 |
| FSRS v4 | 0.3726 | 0.6853 |
| AVG (línea base) | 0.3945 | 0.4997 |
| ACT-R | 0.4033 | 0.5225 |

Comparación directa reportada por el proyecto: **FSRS-6 supera a Anki SM-2 en el
99,6% de los usuarios** (con la advertencia del propio equipo: SM-2 no fue diseñado
para predecir probabilidad de recuerdo, así que la comparación no es "justa", solo
es la única posible con datos históricos).

### Crítica metodológica (2025)
Hilo técnico en r/Anki: *"Serious flaw in benchmarking approach undermines performance
claims"* (oct. 2025). Argumento: replicar historiales no mide el objetivo real
(retención por unidad de tiempo), porque el historial observado depende del
programador que se está evaluando. El equipo de FSRS reconoce que el benchmark mide
**calibración predictiva**, no eficiencia de aprendizaje.

### Settles & Meeder (2016) — Duolingo
*A Trainable Spaced Repetition Model for Language Learning.* ACL 2016, 1848–1858.
DOI: 10.18653/v1/P16-1174

Half-life regression (HLR) sobre 13M trazas de estudiantes: reduce el error de
predicción de recuerdo >45% frente a Leitner y Pimsleur, y en un A/B test operativo
mejora la retención diaria ~12%. Es el antecedente industrial directo: una app de
idiomas puede programar repasos con un modelo entrenable en vez de cajas fijas.

## Implicaciones para Open Chinesse

1. **FSRS-6 vía `ts-fsrs` 6.0** con parámetros por defecto y retención objetivo 0.90.
   No escribimos el algoritmo: la biblioteca es la implementación de referencia.
2. **Cuatro calificaciones** (Otra vez / Difícil / Bien / Fácil) y **previsualización
   de intervalos** en cada botón. El usuario ve la consecuencia antes de decidir.
3. **Pasos de aprendizaje cortos** para tarjetas nuevas: si "Bien" deja la tarjeta a
   10 minutos, se re-encola en la misma sesión.
4. **No inventar SM-2.** La ganancia de FSRS sobre cajas Leitner/SM-2 es el consenso
   del campo; nuestro trabajo es la integración y la UX, no la matemática.
5. **Optimización por usuario** queda fuera mientras no haya >= 1000 repasos: los
   pesos por defecto ya son razonables y el benchmark muestra que optimizar con pocos
   datos puede empeorar la calibración.

## Límites

- Los benchmarks son de mazos de Anki, mayormente vocabulario y exámenes; no miden
  producción oral ni tonos.
- "Retención objetivo 90%" implica una carga de repaso que puede no ser sostenible
  para todos; se deja configurable en el store (v2: control en UI).
- La crítica de 2025 sigue abierta: FSRS no está optimizado para *maximizar
  aprendizaje por minuto*, sino para *predecir recuerdo*.
