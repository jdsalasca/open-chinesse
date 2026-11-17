# Top 10 para subir la vara (2026-11-17)

Revisión cruzada: auditoría propia + una consulta a `gpt-6.1-terra` vía
`codex-cli` (solo lectura). La pregunta fue qué añadir para mejorar el
aprendizaje real de mandarín A1–B1, no para sumar pantallas.

## Diagnóstico

La app ya cubre **reconocer, escuchar palabras sueltas, leer con ayuda y
producir escribiendo pinyin/hanzi**. Al empezar estas rondas faltaba el ciclo
completo:

1. **El error no vuelve de forma deliberada.** Se guarda el último motivo por
   palabra (`misses`), pero no se usa para construir una sesión posterior.
   _Cubierto en C12._
2. **La escucha siempre tiene apoyo visual.** No hay una tarea de escuchar un
   mensaje completo sin texto y comprobar qué se entendió. _Cubierto en C14._
3. **No hay producción oral.** Ni sombra, ni grabación, ni comparación con un
   modelo. _Cubierto en C15._
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

Orden recomendado: **5 (C16) → HSK 1 aplicado (C17) → 9 → 6 → 10 → 8**;
sentence mining (7) después de la transferencia.

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

## Hecho en C13

- **Jefes de nivel** (`/jefes`): examen de 15 preguntas al cerrar cada nivel, con
  el 80% para aprobar.
- **Certificado de práctica** con nombre, nivel, aciertos y fecha; se guarda el
  mejor resultado y se puede volver a ver o imprimir.
- El jefe se desbloquea con una estrella en todas las unidades del nivel.

## Hecho en C14

- **Comprensión auditiva** (`/escucha`): seis audios sin texto, una pregunta y
  transcripción revelable.

## Hecho en C15

- **Repite en voz alta** (`/repite`): diez textos con audio por frase, grabación
  local y comparación con el modelo. Sin nota automática.

## Hecho en C16

- **Gramática en contraste** (`/gramatica`): 不 y 没 con reglas, contrastes,
  siete frases de práctica y cinco reservadas para una prueba diferida a los 7
  días. Se guarda el primer resultado.

## Hecho en C17

- **Micro-lecturas HSK 1** (`/historias`): quince textos, uno por unidad, con
  audio por línea y pregunta. Alimentan Escucha (21 audios) y Repite (25
  textos).

## Hecho en C18

- **Ficha de carácter**: historia y gancho para los 618 caracteres del curso,
  piezas con rol, sentido propio, uso en palabra, confundibles y fuente
  histórica plegada.
- **Inmersión**: 18 recursos en chino y 4 vídeos sobre la historia de los
  caracteres, verificados con `yt-dlp`.

## Hecho en C19

- **Sesión diaria**: recuperar → aprender → producir. CTA único, pasos reales y
  cierre con carácter del día, mini-quiz, frase escuchada y frase propia.
- **Ficha**: familia del radical con caracteres del curso.

## Hecho en C20

- **Cambia la intención** (`/intencion`): veinte transformaciones con una sola
  respuesta correcta, opciones barajadas y feedback del cambio mínimo.
- **Detective de confusables** (`/detective`): diez pares del curso, significado,
  explicación y enlace a la ficha.

## Hecho en C21

- **¿Qué pasó en la escena?** (`/escena`): ocho micro-lecturas por tanda,
  elección de resumen y de la línea que lo justifica, con doble puntuación.

## Hecho en C22

- **Laboratorio de piezas** (`/piezas`): clasifica cada componente como
  significado o sonido, con feedback y enlace a la ficha.

## Hecho en C23

- **Pulido del núcleo**: recuperación antes de revelar en la lección, feedback
  con contraste y ejemplo, ejemplo resuelto de 不/没 y movimiento sobrio con
  `prefers-reduced-motion`.

## Hecho en C24

- **Lección activa**: rondas de dos palabras + dos comprobaciones, cinco modos
  (significado, escucha, tono, hueco y ordenar), barra de acción sticky y
  resumen con las palabras que merecen otra mirada.

## Hecho en C25

- **Estética de la lección**: progreso segmentado por rondas, tarjeta con marca
  de agua y divisor editorial, palabra resaltada en el ejemplo, etiquetas de
  modo con icono y color, opciones con check/equis, feedback en banner y
  resumen con anillo de aciertos.

## Siguiente ronda propuesta (C26)

- **Reencuentro de fallos**: volver a preguntar una palabra fallada más tarde,
  con otra consigna, y distinguirla en el resumen.
- **Resumen por capacidades**: primer intento, recuperadas después y
  pendientes.
- **Primera exposición directa**: mostrar significado y ejemplo desde el inicio
  y reservar «intenta recordar» para el reencuentro.

## Plan de tres rondas

1. **D1 — Errores y tonos** — hecho en C12.
2. **D2 — Escucha autónoma** — hecho en C14.
3. **D3 — Voz** — hecho en C15: shadowing con grabación local y comparación con
   el modelo; sin puntuación automática.

## Horizonte tras C17

1. **Gramática en contraste** — 不/没 hecho en C16. Seguir con 了/过, 的/得 y
   clasificadores.
2. **HSK 1 aplicado** — hecho en C17: quince micro-lecturas, una por unidad,
   con audio y pregunta.
3. **Diagnóstico por destreza** — cinco ítems de escucha, lectura y gramática,
   con perfil y recomendación.
4. **Transferencia situacional** — resolver situaciones nuevas sin copiar el
   ejemplo.
5. **Escucha con variación** — piloto con segunda voz o velocidad.
6. **Caracteres confundibles + escritura selectiva** — confundibles e historia
   hechos en C18; falta la escritura y el orden de trazos.

Sentence mining pasa después de la transferencia: guardar frases no demuestra
saber usarlas.
