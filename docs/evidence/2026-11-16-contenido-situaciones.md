# Ronda C1: situaciones y lecturas nuevas (2026-11-16)

## Qué se añadió

**Cuatro situaciones interactivas** (`#/situaciones`), una por nivel:

| Situación           | Nivel | Qué practica                                                |
| ------------------- | ----- | ----------------------------------------------------------- |
| Primer contacto     | HSK 1 | Presentarse, decir el nombre, confirmar que eres estudiante |
| En la cafetería     | HSK 2 | Pedir una bebida, cerrar el pedido, pagar                   |
| En la frutería      | HSK 2 | Comprar fruta, usar clasificadores, entender el precio      |
| Perdido en el metro | HSK 3 | Explicar el problema, preguntar el tiempo, agradecer        |

Cada escena es un chat con burbujas, pinyin, traducción y audio por línea del
interlocutor. Las decisiones tienen tres respuestas: una correcta y dos con
feedback que explica **por qué** no encajan. Fallar no bloquea: la opción se
desactiva y se puede seguir intentando.

## Mecánicas

- **Audio en la conversación**: 23 MP3 nuevos generados con Piper; la voz del
  interlocutor se puede repetir en cualquier momento.
- **Teclas 1–3** para elegir respuesta en escritorio.
- **Auto-scroll** al último mensaje; la conversación crece como un chat real.
- **Progreso**: la escena completada se guarda en `scenarios` (esquema 7) y viaja
  en el payload de sincronización. La lista muestra «Hecha» y permite repetir.
- **Sin castigo**: los errores explican el patrón (clasificador, fórmula, registro)
  en vez de solo marcar en rojo.

## Contenido nuevo en Historias

Dos lecturas más, verificadas por el test de graduación:

- **En el restaurante** (HSK 2): pedir comida y bebida, total y pago.
- **Un día de lluvia** (HSK 3): tiempo, plan en casa, visita y película.

El catálogo pasa de 5 a 7 lecturas y de 33 a 45 líneas, todas con audio.

## Verificación de nivel

El test `scenarios.test.ts` reutiliza el vocabulario del curso y falla si una
escena usa caracteres por encima de su nivel. Encontró y obligó a corregir:

- `primer-contacto` usaba 要, 也 y 知道 (HSK 2) → se reescribió con HSK 1.
- `metro` usaba 大概 y 顺利 (HSK 4) → se sustituyó por «走路十分钟» y «再见».

También exige exactamente una respuesta correcta por decisión y pinyin/traducción
en cada línea.

## Bug de audio encontrado al ampliar historias

El generador leía `stories.ts` con una expresión regular que solo encontraba las
llamadas `say('…')` en una línea. Las llamadas formateadas en varias líneas se
saltaban: había 33 líneas de historia y solo 26 MP3. Ahora el script importa
`STORIES` y genera una pista por cada línea real (45 en total). El mismo mecanismo
se usa para las situaciones.

## Glosa de palabras con puntuación

El segmentador de historias adjunta la puntuación a la palabra («谢谢！»), así que
la glosa no encontraba la entrada del curso y decía «no es una palabra». Ahora se
quita la puntuación final antes de buscar, se deduplican los botones de carácter
y se conserva el texto completo en la cabecera. Verificado con 谢谢: aparece
«gracias», el pinyin, el audio y un solo botón 谢, sin warnings de claves
duplicadas en React.

## Evidencia

```text
npx vitest run    149 passed
npx tsc -b        limpio
pnpm lint         0 errores, 18 advertencias
pnpm build        ✓
audio             23 escenas + 45 líneas de historia, 0 fallos
```

Capturas en `.screens/content/` (ignoradas por git):

- `scenarios-list.png` — catálogo de situaciones.
- `scenario-start.png` — primera línea con audio.
- `scenario-wrong.png` — respuesta incorrecta con explicación.
- `scenario-correct.png` — respuesta correcta y avance.
- `scenario-done.png` — cierre de la escena.
- `scenarios-lista-hecha.png` — «Hecha» persistido.
- `scenario-cafeteria-mobile.png` — 390×844.

## Límites honestos

- Elegir entre tres respuestas es **reconocimiento guiado**, no producción libre.
- Las escenas no evalúan pronunciación ni entonación.
- El feedback está escrito a mano; no sustituye a un hablante nativo.
- La siguiente mejora natural es una nota de uso por palabra (二/两, 几/多少,
  的/得) y, más adelante, respuesta oral.
