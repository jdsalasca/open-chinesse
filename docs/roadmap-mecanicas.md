# Mecánicas de aprendizaje — mapa y prioridades

Revisión de lo que ya existe y de lo que falta para que la app enseñe mejor, no
solo para que tenga más pantallas.

## Lo que ya hay

| Mecánica                            | Dónde             | Qué entrena                            |
| ----------------------------------- | ----------------- | -------------------------------------- |
| Tarjetas de lección                 | `Lesson`          | Primera exposición con audio y ejemplo |
| Quiz reconocer / escuchar / ordenar | `Lesson`          | Recuperación y sintaxis                |
| Repaso FSRS con 4 notas             | `Review`          | Recuerdo espaciado                     |
| Pinyin escrito sin tonos            | `Review`          | Producción fonética                    |
| Tonos                               | `Tones`           | Discriminación auditiva                |
| Huecos en contexto                  | `Cloze`           | Producción escrita                     |
| Prueba de retención                 | `Check`           | Recuerdo sin pistas                    |
| Lecturas con glosa                  | `Stories`         | Lectura extensiva                      |
| Situaciones con decisiones          | `Scenarios`       | Uso pragmático                         |
| Ficha de carácter                   | `CharacterDrawer` | Radicales y componentes                |
| Misiones y racha                    | Home              | Hábito                                 |

## Brechas, en orden de impacto

| #   | Mecánica                                                                     | Por qué                                                           | Coste | Depende de              |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----- | ----------------------- |
| 1   | **Dictado**: oír palabra o frase y escribir hanzi/pinyin                     | Cierra el ciclo oído → escritura; hoy solo se reconoce            | Medio | Audio existente         |
| 2   | **Cuentos para dormir** (HSK 1–2, voz lenta, traducción y explicación)       | Lectura extensiva placentera y sin presión                        | Alto  | Contenido + audio lento |
| 3   | **Historia de China en chino** (HSK 3, glosas y audio)                       | Cultura + lectura larga; da sentido al vocabulario                | Alto  | Contenido + audio       |
| 4   | **Sesión inmersiva mixta** (10 min: repaso → escucha → lectura → producción) | Hoy las prácticas están aisladas; mezclar mejora transferencia    | Medio | Ya existe casi todo     |
| 5   | **Actividad del día** (reto real: pide un café, preséntate)                  | Lleva la app al mundo; cierra con una escena o frase              | Bajo  | Situaciones             |
| 6   | **Shadowing** (repetir en voz alta tras el audio)                            | Pronunciación y ritmo; sin micrófono al principio                 | Medio | Audio + pausas          |
| 7   | **Comprensión auditiva con pregunta**                                        | Escuchar sin texto y comprobar; hoy el audio se apoya en el texto | Medio | Historias/situaciones   |
| 8   | **Glosa universal al pasar el cursor** en ejemplos y escenarios              | Unifica la ayuda; hoy solo existe en Historias                    | Bajo  | Segmentador actual      |
| 9   | **Segundo ejemplo por palabra**                                              | Más contexto y menos memorización de una sola frase               | Alto  | Contenido validado      |
| 10  | **Modo oscuro y nocturno** para lecturas                                     | Coherente con cuentos para dormir                                 | Bajo  | Tokens SCSS             |

## Plan propuesto

1. **Ronda D1 — Dictado**: pantalla `/dictado`, audio de palabras ya estudiadas,
   respuesta en pinyin o hanzi, 10 por tanda y repaso de fallos. Sin tocar FSRS.
2. **Ronda D2 — Cuentos para dormir**: tres cuentos HSK 1–2 escritos solo con
   vocabulario del curso, audio lento, modo noche, explicación línea a línea y
   reproducción continua con pausas.
3. **Ronda D3 — Historia de China**: tres lecturas HSK 3 (mitos, inventos, vida
   cotidiana), glosa al pasar el cursor, audio y una pregunta de comprensión.
4. **Ronda D4 — Sesión inmersiva y reto diario**: mezcla guiada de repaso,
   escucha, lectura y producción; reto del día enlazado a una situación.

## Anti-metas

- No sumar XP por pasar tiempo ni por abrir pantallas.
- No sustituir el repaso FSRS por juegos.
- No publicar contenido histórico o literario sin validar nivel, pinyin y
  traducción con los tests existentes.
- No añadir voz sintética nueva sin medir duración y naturalidad: el audio de las
  historias ya se regeneró porque estaba truncado.
