# Ronda C24: lección activa (2026-11-17)

## Problema

La lección del núcleo era un recorrido de 10 tarjetas y, al final, 6 preguntas.
Ese formato premia mirar, no recuperar: el alumno puede avanzar sin comprobar
nada hasta el final. Además, en pantallas bajas la acción principal quedaba
pegada al borde inferior y podía quedar fuera de la vista.

## Cambios

### Ciclo enseñar → comprobar

`makeLessonPlan(unit)` divide las palabras en rondas de dos:

1. Se presentan las dos palabras.
2. Se comprueban las dos, en orden inverso para que la recuperación no sea
   inmediata.
3. Se repite con la siguiente pareja.
4. Al final, dos frases para ordenar.

Cada palabra se presenta una vez y se recupera al menos una vez. El plan es
determinista por unidad y variante diaria.

### Cinco modos de práctica

- **¿Qué significa?**: hanzi → significado.
- **Escucha y elige**: audio → significado.
- **Escucha y elige el pinyin**: audio → pinyin con tonos.
- **Completa la frase**: frase del ejemplo con hueco → palabra.
- **Ordena la frase**: piezas → oración completa.

Los distractores de completar salen primero de la misma unidad. Si una palabra
no tiene frase aprovechable o no admite cuatro variantes de tono, la pregunta
cae a un modo de significado; nunca se inventa una respuesta.

### Feedback

- El veredicto cambia según el modo: significado, pinyin o palabra que faltaba.
- El contraste «Elegiste / Respuesta» conserva el pinyin con su color y su
  tamaño, sin convertirlo a mayúsculas.
- El ejemplo completo y su audio siguen apareciendo después de cada respuesta.
- En tono se añade la pista: «El tono cambia el significado: escucha la marca».

### Tarjeta y acción

- La tarjeta de presentación usa dos columnas en escritorio: palabra y tono a la
  izquierda; significado y ejemplo a la derecha.
- En móvil se apila en una columna.
- La barra de acción es `position: sticky` y reserva espacio para el borde
  inferior; la acción principal queda visible sin depender del scroll.
- El encabezado muestra la ronda («Ronda 1 de 5») y el objetivo de la unidad.

### Resumen

- Cuenta las respuestas correctas sobre el total real (12 en una unidad de 10).
- Lista las palabras falladas con hanzi, significado y audio bajo «Merece otra
  mirada».
- Mantiene XP, estrellas y el enlace al repaso.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     258 passed (258)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA visual

- `/#/lesson/h1-05`: tarjeta en dos columnas, objetivo, ronda y acción visible.
- Pregunta de tono: audio, cuatro pinyin y opciones coloreadas por tono.
- Respuesta incorrecta: «Era māma: mamá», contraste y ejemplo «妈妈做饭。».
- Pregunta de hueco: «我＿＿是医生。», traducción y opciones de la unidad.
- Resumen: 3 de 12, lista de palabras falladas y acciones.
- 1366×768: la barra de acción queda visible (top 538, bottom 675).
- 390×844: 0 px de desbordamiento, tarjeta apilada y acciones visibles.
- Feedback largo en 390: la página scrollea hasta el máximo (546 px).

Capturas en `.screens/audit/`: `c24-learn.png`, `c24-revealed.png`,
`c24-tone.png`, `c24-gap.png`, `c24-feedback.png`, `c24-summary.png`,
`c24-short.png`, `c24-mobile.png`, `c24-mobile-feedback.png`.

### Producción

Despliegue con `./deploy.sh`: backend OK y verificación pública `/` 200,
`/api/me` 401, `/api/health` 200.

- `/#/lesson/h1-05`: «Ronda 1 de 5 · Primer contacto», objetivo «Quién vive en
  casa», tarjeta en dos columnas y barra de acción sticky.
- Primera comprobación: «Escucha y elige el pinyin», cuatro opciones de tono.
- Respuesta incorrecta: «Era māma: mamá», contraste con el pinyin en su tamaño
  y color normales, ejemplo «妈妈做饭。».
- Segunda comprobación: «Completa la frase», hueco visible de 56 px,
  traducción y opciones de la unidad.
- 390×844 en producción: 0 px de desbordamiento, tarjeta apilada y barra
  sticky con el botón a 710 px de 844.

Captura de producción: `.screens/audit/c24-prod-mobile.png`.

## Base didáctica

- **Roediger y Karpicke (2006)**: recuperar produce mejor retención que releer.
  Cada palabra se recupera después de presentarla, no solo al final.
- **Cepeda et al. (2006)**: espaciar las recuperaciones mejora la memoria a
  largo plazo. Las comprobaciones se separan de la presentación y vuelven en la
  frase final.
- **Rohrer y Taylor (2007)**: intercalar tipos de problema obliga a elegir la
  estrategia. Los cinco modos alternan significado, sonido, tono y forma.
- **Sweller et al. (2020)**: la carga cognitiva se controla con rondas cortas,
  una tarea por pantalla y feedback inmediato.
- Terra ya advirtió en C23 que son hipótesis de diseño, no resultados medidos
  en este producto.

## Límites

- No hay métricas de retención para comparar este formato con el anterior.
- La lección pasa de 6 a 12 respuestas registradas; es más larga, pero cada
  paso es más corto y activo.
- Las preguntas de tono solo se generan cuando la palabra admite cuatro
  variantes; las de hueco, cuando la frase contiene la palabra una sola vez.
- No se tocó FSRS ni el algoritmo de repaso.
- El resumen enlaza a `/review`, que muestra lo que toca repasar, no
  necesariamente las 10 palabras de la unidad.

## Revisión de Terra (post-C24)

Terra leyó el plan, la pantalla y los estilos. Su diagnóstico: C24 mejora la
experiencia y elimina el paseo pasivo, pero **todavía no demuestra aprendizaje
duradero**; sigue apoyado en reconocimiento con opciones y la primera
comprobación llega muy cerca de la presentación.

Prioridades que propone para la próxima ronda:

1. **Reencuentro de fallos**: después de un error, volver a preguntar esa
   palabra más tarde, con otra consigna (por ejemplo, de hanzi a audio), y
   mostrar en el resumen «recuperada después» o «necesita otra mirada».
2. **Resumen por capacidades**: separar primer intento, recuperadas después y
   pendientes, en lugar de un único «X de 12».
3. **Primera exposición directa**: mostrar significado y ejemplo desde el
   inicio en palabras nuevas y reservar «intenta recordar» para el reencuentro;
   «Mostrar significado» y «No lo recuerdo» hacen lo mismo.

Su cambio firma sería **«Vuelve a intentarlo»** dentro del flujo actual: el
error tiene una consecuencia útil en la misma lección, sin pantalla nueva.

Qué simplificar, según Terra:

- Reducir el feedback de acierto (veredicto + contraste + ejemplo es mucho para
  un acierto).
- Hacer opcional el origen de caracteres durante el primer contacto.
- Dar menos protagonismo a estrellas y XP que al primer intento y a las
  dificultades recuperadas.
- Comprobar también los botones del feedback y de ordenar en ventanas bajas,
  no solo la barra de la tarjeta.

Métricas simples que propone: primer intento por modo, recuperación tras error,
retención diferida al volver, finalización/abandono y transferencia en un reto
contextual. Sin comparación controlada no prueban causalidad.

Referencias que cita: Roediger y Karpicke (2006) para recuperación, Kang (2016)
para espaciamiento y Butler (2010) para transferencia.

Decisión para C24: se implementa el ciclo activo y la barra sticky; el
reencuentro de fallos y el resumen por capacidades quedan como C25, porque
cambian el estado de la lección y merecen su propia ronda con tests.
