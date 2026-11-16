# Comprehensive input

**Pregunta:** ¿qué necesita ver un principiante para que una palabra nueva se
quede, y cuánto contexto es suficiente?

## Qué dice la evidencia

### La hipótesis original

Krashen (1985) propone que la lengua se adquiere comprendiendo mensajes un poco
por encima del nivel actual (_i+1_). Es la intuición correcta y la base de casi
todo el diseño comunicativo moderno.

### La corrección

Liu (2015) desmonta tres piezas: "input comprensible" no está operacionalizado,
el input no es suficiente (Schmidt 1983: tres años de exposición natural sin
avance gramatical) y no hay mecanismo de transición. Lichtman (2021) reevalúa y
concluye que la idea sobrevive con otro nombre: **input necesario, no suficiente**.

Swain (1985, 2000) añade la producción: obliga a procesar forma, provoca _noticing_
y permite probar hipótesis. Long (1996) añade la negociación de significado.

### El número que importa

Nation (2006) y la investigación de lectura extensiva sitúan la **cobertura léxica
del 95-98 %** como umbral para comprender un texto sin apoyo. Un texto con 90 % de
cobertura obliga a consultar una palabra cada diez.

Esto tiene una consecuencia dura para una app: una frase de ejemplo con dos
palabras desconocidas ya está por encima del umbral. **El ejemplo debe usar solo
vocabulario ya visto o de la misma unidad.**

## Qué hicimos con esto

| Decisión                                                 | Por qué                                             | Costo asumido                                   |
| -------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Cada palabra nueva trae **una frase** de 4-10 caracteres | El hanzi aislado no da contexto de uso              | 301 frases escritas a mano, revisables          |
| La frase usa vocabulario del nivel o anterior            | Acercarse al 95 % de cobertura                      | Frases menos "naturales" que un texto auténtico |
| La lección es input; el repaso es producción             | Presentar antes de exigir                           | Dos fases, más pantallas                        |
| Las tarjetas maduras piden teclear pinyin                | Producción forzada, sin depender de ASR             | Fricción real para el usuario                   |
| No prometemos conversación                               | Sin interacción en vivo, el input es unidireccional | La fluidez oral queda fuera de la v1            |

## Qué falta

- **Input auténtico graduado**: diálogos y mini-historias con 95-98 % de cobertura
  calculada por software, no a ojo. Es el siguiente salto de calidad.
- **Negociación de significado**: sin tutor ni IA conversacional no existe. Un
  corrector de frases con explicación sería la aproximación más barata.
- **Medición**: no sabemos si nuestros ejemplos alcanzan el umbral. Un script que
  cruce cada frase con el vocabulario acumulado del nivel lo resolvería.

## Referencias

- Krashen, S. (1985). _The Input Hypothesis: Issues and Implications._ Longman.
- Liu, D. (2015). A Critical Review on Krashen's Input Hypothesis. _JEHD_, 4(4).
  DOI: 10.31464/jlere.617587
- Lichtman, K. (2021). Was Krashen right? Forty years later. _Foreign Language
  Annals_, 54(2). DOI: 10.1111/flan.12552
- Swain, M. (2000). The output hypothesis and beyond. En _Sociocultural Theory and
  Second Language Learning_.
- Long, M. (1996). The role of the linguistic environment in second language
  acquisition. En _Handbook of Second Language Acquisition_.
- Nation, I.S.P. (2006). How large a vocabulary is needed for reading and
  listening? _Canadian Modern Language Review_, 63(1).
