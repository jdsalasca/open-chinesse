# Escritura de caracteres

## Evidencia

| Estudio                 | Hallazgo                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| Guan et al. (2011)      | Escribir fortalece forma→significado; teclear fortalece forma→sonido |
| Zhang (2021, n=108)     | Teclear pinyin iguala lectura y supera retención acumulada           |
| FLAN (2026, n=28, 40 h) | Tecleo gana en reconocimiento y dictado; escritura en significado    |
| Liu & Li (2022)         | El tecleo produce más caracteres correctos                           |

## Decisión

v1 **sin lienzo de trazos**. Se implementa reconocimiento (hanzi → significado) y
producción fonológica (significado → pinyin tecleado).

## Por qué no es una omisión accidental

La escritura a mano aporta un beneficio específico (forma→significado) que el
tecleo no cubre. Pero construir esa fase exige:

- datos de trazos por carácter (`hanzi-writer-data`, ~10 MB),
- corrección de orden de trazos,
- y una UX de lienzo que en web móvil compite con el teclado.

El coste es real y el beneficio, en un principiante, llega **después** de leer y
reconocer. Se pospone con fecha, no se descarta.

## Plan para R5

1. `hanzi-writer` como componente aislado, solo para los 60 caracteres más
   frecuentes del curso.
2. Práctica de escritura **después** de que la palabra esté en estado Review.
3. Medir: ¿mejora la precisión de reconocimiento a 30 días frente al grupo que solo
   teclea? Si no hay diferencia medible, no se generaliza.

## Referencias

- Guan, C. et al. (2011). _Journal of Educational Psychology_, 103(3).
- Zhang (2021). _TCLT_, 12(2).
- _Orthography-sound vs. orthography-meaning mapping…_ (2026). FLAN.
  DOI: 10.1111/flan.70053
