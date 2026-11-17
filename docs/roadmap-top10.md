# Top 10 para subir la vara (2026-11-17)

Revisión cruzada: auditoría propia + una consulta a `gpt-6.1-terra` vía
`codex-cli` (solo lectura). La pregunta fue qué añadir para mejorar el
aprendizaje real de mandarín A1–B1, no para sumar pantallas.

## Diagnóstico

La app ya cubre **reconocer, escuchar palabras sueltas, leer con ayuda y
producir escribiendo pinyin/hanzi**. Lo que falta es el ciclo completo:

1. **El error no vuelve de forma deliberada.** Se guarda el último motivo por
   palabra (`misses`), pero no se usa para construir una sesión posterior.
2. **La escucha siempre tiene apoyo visual.** No hay una tarea de escuchar un
   mensaje completo sin texto y comprobar qué se entendió.
3. **No hay producción oral.** Ni sombra, ni grabación, ni comparación con un
   modelo.
4. **El tono no se produce.** El repaso acepta pinyin sin tonos; se entrena la
   percepción en Tonos, pero no la producción tonal.
5. **La gramática se aprende implícita.** No hay contrastes explícitos
   (不/没, 了/过, 的/得, clasificadores) con práctica de producción.
6. **La escritura a mano no existe.** Solo tecleo.

Terra coincide en la prioridad: cerrar **intento → feedback → recuperación
diferida**, ampliar la escucha sin apoyo y abrir la producción oral. Su orden
completo está resumido abajo; lo he ajustado con lo que el código ya permite.

## Top 10

| #   | Mecánica                                                                                                                | Qué cierra                        | Impacto         | Esfuerzo   | Datos que ya hay                     |
| --- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------- | ---------- | ------------------------------------ |
| 1   | **Cuaderno de errores**: sesión con las palabras falladas y una pregunta distinta según el motivo                       | Error → recuperación dirigida     | Alto            | Bajo-medio | `misses`, `log`, audio               |
| 2   | **Producción con tonos**: escribir pinyin con tonos (o `ni3 hao3`) y marcar la sílaba fallada                           | Tono productivo                   | Alto            | Bajo       | `checkPinyin`, audio                 |
| 3   | **Escucha sin texto**: diálogo o lectura, pregunta de comprensión, después transcripción                                | Comprensión auditiva autónoma     | Alto            | Medio      | Audios de historias, China y escenas |
| 4   | **Shadowing guiado**: oír → grabar → comparar con el modelo, sin nota automática                                        | Producción oral e inteligibilidad | Alto            | Medio      | Audio por línea, MediaRecorder       |
| 5   | **Gramática en contraste**: micro-drills de 不/没, 了/过, 的/得, clasificadores, con explicación del error              | Precisión gramatical              | Alto            | Medio      | Ejemplos del curso                   |
| 6   | **Microtareas de transferencia**: situación nueva (“cambia el pedido”, “pide otra hora”) resuelta sin copiar el ejemplo | Uso en contexto nuevo             | Alto            | Medio      | Situaciones y vocabulario            |
| 7   | **Sentence mining**: guardar una frase de una lectura y repasarla como hueco/orden                                      | Une lectura y SRS                 | Medio-alto      | Medio      | Líneas de historias/China            |
| 8   | **Caracteres parecidos + escritura selecta**: pares mínimos y trazos de 50–100 caracteres útiles                        | Discriminación y escritura        | Medio           | Medio-alto | `decomposition.json`, falta trazos   |
| 9   | **Diagnóstico periódico por destreza**: prueba mensual de escucha, lectura y producción en tareas nuevas                | Medir aprendizaje, no actividad   | Alto para medir | Medio      | Banco de preguntas por crear         |
| 10  | **Variación de escucha**: varias voces y velocidades para las mismas frases                                             | Generalización auditiva           | Medio-alto      | Alto       | Requiere nuevos audios/voces         |

Orden recomendado: **1 + 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10**.

## Las tres primeras, en concreto

### 1. Cuaderno de errores

- **Entrada:** tarjeta «Tus fallos» en Practicar con el número de palabras
  falladas. La sesión toma esas palabras y elige el formato según el motivo:
  - `sound` → audio + elegir significado.
  - `meaning` → hanzi + elegir significado, o hueco en contexto.
  - `order` → ordenar la frase.
  - `tone` → audio + elegir pinyin.
- **Feedback:** respuesta correcta, explicación del motivo y segundo intento
  inmediato; la palabra reaparece en otra sesión días después.
- **Datos:** `misses` (último motivo) y `log`; opcional añadir `wordId` a la
  actividad para medir el acierto diferido.
- **Métrica:** porcentaje de acierto en el primer intento de una palabra fallada
  pasados 7 días, frente a palabras no falladas. Sin esa métrica, la sesión es
  solo otra pantalla.

### 2. Producción con tonos

- **Entrada:** se muestra el significado (o el audio) y se escribe el pinyin.
  Se acepta `nǐ hǎo` o `ni3 hao3`; no se acepta `ni hao` si el modo exige tonos.
- **Feedback:** `checkPinyin` ya distingue `ok`, `sin-tonos`, `tonos` y `mal`.
  Si falla el tono, se marca **qué sílaba** y se muestra el pinyin correcto.
- **Datos:** `checkPinyin`; no hace falta contenido nuevo.
- **Métrica:** proporción de pinyin con tonos correctos en repaso y en dictado.

### 3. Escucha sin texto

- **Entrada:** se elige una historia, una lectura de China o una escena; se
  reproduce sin mostrar hanzi, pinyin ni traducción. Una o dos preguntas de
  comprensión (“¿qué quiere?”, “¿adónde va?”). Después se revelan transcripción,
  traducción y explicación.
- **Feedback:** respuesta correcta y cita de la línea; botón para repetir solo el
  segmento fallado.
- **Datos:** audios ya existentes; faltan preguntas por texto (China ya tiene
  una por lectura).
- **Métrica:** acierto en la **primera** escucha sin texto, y acierto en textos
  no usados antes.

## Lo que no conviene construir todavía

Terra y la auditoría coinciden:

- **Chat libre o tutor de IA generalista:** feedback difícil de validar y coste
  alto antes de probar producción guiada.
- **Nota automática de pronunciación como verdad:** puede penalizar respuestas
  comprensibles o ignorar tonos; primero comparación con modelo y evaluación
  humana.
- **Escritura de los 601 caracteres desde el día uno:** caro en datos; empezar
  por una selección útil y después ampliar.
- **Más XP, rachas o contenido masivo:** no demuestran retención ni
  transferencia. Primero medir en tareas nuevas y diferidas.
- **HSK 4 antes de cerrar los ciclos anteriores:** más vocabulario no arregla la
  falta de producción oral, gramática y escucha autónoma.

## Hecho en C12

- **Cuaderno de errores** (`/fallos`): sesión con las palabras falladas, ordenadas
  por fallo reciente y con el formato que pide el motivo.
- **Dictado con tonos**: opción «Exigir tonos» activa por defecto; `ni hao` no
  cuenta como acierto.
- La actividad guarda `wordId` para medir el acierto diferido.

## Plan de tres rondas

1. **D1 — Errores y tonos** — hecho en C12.
2. **D2 — Escucha autónoma:** modo sin texto para historias y China, con dos
   preguntas por texto y transcripción revelable.
3. **D3 — Voz:** shadowing con grabación local, comparación con el modelo y
   checklist de tonos/ritmo; sin puntuación automática.

Después: gramática en contraste, transferencia, sentence mining, caracteres y
diagnóstico.
