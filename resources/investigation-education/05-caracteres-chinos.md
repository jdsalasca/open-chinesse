# 05 — Caracteres chinos: escribir a mano vs. teclear

**Pregunta:** ¿la v1 debe enseñar a escribir trazos, o basta con reconocer y teclear?

## Hallazgos

### Guan, Liu, Chan, Ye & Perfetti (2011)
*Writing Strengthens Orthography and Alphabetic-Coding Strengthens Phonology in
Learning to Read Chinese.* Journal of Educational Psychology, 103(3), 509–522.

Dos experimentos con adultos aprendices de chino. Escritura a mano mejora
**reconocimiento de palabra** y **vínculo forma→significado**; teclear pinyin mejora
**representación fonológica** y el vínculo **forma→sonido**. Conclusión: efectos
disociados por componente; lo óptimo es **integrar ambos**.

### Zhang (2021)
*Typing to Replace Handwriting: Effectiveness of the Typing-Primary Approach for L2
Chinese Beginners.* TCLT, 12(2).

108 principiantes, 1.440 registros de evaluación, diseño cuasi-experimental. El grupo
que teclea pinyin **iguala** en lectura y precisión de hanzi tecleado, y **supera** en
longitud de ensayo, reconocimiento de palabras a nivel de oración y retención acumulada
de hanzi. El mecanismo propuesto: el tecleo con pinyin procesa el carácter como bloque
fonológico-visual completo.

### Estudio 2026 (n=28, birmanos, 40 h de instrucción)
*Orthography-sound vs. orthography-meaning mapping in Chinese character learning:
Evidence on typing and handwriting.* Foreign Language Annals (2026).
DOI: 10.1111/flan.70053

Tecleo gana en **reconocimiento de caracteres y dictado**; escritura a mano gana en
**reconocimiento de significado**. Recomendación de los autores: tecleo temprano para
forma-sonido, escritura dirigida después para forma-significado.

### Liu & Li (2022, capítulo)
*Impact of typing vs handwriting on CFL students' character learning.* Routledge.
19+15 aprendices: el grupo que teclea lee igual de bien y produce más caracteres
correctos. La mayoría prefiere teclear o combinar.

## Síntesis

No hay un "ganador" único: **teclear acelera el arranque y fortalece sonido; escribir
fortalece forma y significado**. Para una app web sin profesor, la secuencia
defendible es reconocimiento + producción fonológica primero, escritura después.

## Implicaciones para Open Chinesse

1. **v1 sin lienzo de trazos.** Se implementa reconocimiento (hanzi → significado) y
   producción fonológica (significado → pinyin tecleado), que es la combinación con
   mejor evidencia para un MVP.
2. **Orden de trazos queda como R5**, con `hanzi-writer` como candidato. El costo no
   es el componente: es el pipeline de datos (JSON por carácter) y la curaduría.
3. **No se afirma que escribir a mano sea innecesario.** El README y la UI deben decir
   que la escritura es una fase posterior, no una omisión accidental.
4. **Si el usuario teclea hanzi**, jamás con IME: se pide pinyin, no composición.

## Límites

- Muestras pequeñas (n=28, n=34, n=40 en varios estudios) y contextos de aula.
- Los resultados con aprendices birmanos o árabes no se transfieren sin más a
  hispanohablantes adultos.
- Ningún estudio mide apps autodidactas; la instrucción presencial tiene componentes
  sociales que aquí no existen.
