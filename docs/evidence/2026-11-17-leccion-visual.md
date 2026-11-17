# Ronda C25: estética de la lección (2026-11-17)

## Problema

La lección ya tenía un ciclo didáctico activo, pero visualmente seguía siendo
una tarjeta blanca correcta y plana. El usuario pidió que el núcleo, la parte
más importante del producto, fuera también la más bonita.

## Cambios visuales

### Progreso por rondas

- La barra genérica de la lección se sustituye por **segmentos**, uno por ronda
  de dos palabras.
- El segmento completado usa degradado menta-teal; el actual, menta-ámbar con
  un halo suave; los pendientes quedan en gris.
- En las dos frases finales todos los segmentos aparecen completados.
- La tarjeta sigue mostrando «Ronda X de Y».

### Tarjeta de presentación

- Línea superior de acento menta-teal-ámbar.
- Fondo con un resplandor radial muy suave en la esquina superior derecha.
- **Marca de agua** del hanzi actual, enorme y casi transparente, recortada por
  la tarjeta.
- Dos columnas en escritorio con divisor editorial; una columna en móvil.
- Chips de origen con elevación al pasar el cursor.

### Ejemplo en contexto

- La palabra objetivo se resalta con un subrayado menta dentro de la frase.
- El audio y la traducción se mantienen; el resaltado también aparece en el
  feedback del quiz y en el repaso.

### Preguntas

- Cada modo tiene una **etiqueta con icono y tinte propio**:
  - significado: libro, menta;
  - escucha: altavoz, azul;
  - tono: destellos, violeta;
  - hueco: conversación, ámbar;
  - ordenar: flecha, teal.
- La tarjeta del quiz tiene una línea superior de acento y un resplandor
  radial.
- Las opciones elevan 1 px al pasar el cursor y muestran un check o una equis
  cuando se responde; el estado no depende solo del color.

### Feedback

- El veredicto vive en un **banner** con icono y fondo menta o rosa.
- El contraste elegido/respuesta se mantiene debajo, con el pinyin en su tamaño
  y color normales.
- El ejemplo completo conserva el resaltado de la palabra.

### Resumen

- Anillo de aciertos reutilizando `ProgressRing`, con el número dentro y «de
  12» debajo.
- Título «Lección completada», estrellas y XP.
- Las palabras pendientes aparecen como tarjetas con hanzi, significado y audio.

### Movimiento

- El botón de audio pulsa con un halo menta mientras suena.
- Las opciones se elevan al pasar el cursor.
- Todo se desactiva con `prefers-reduced-motion`.

## Verificación

```text
npx prettier --check src        limpio
npx tsc -b                      limpio
npx vitest run                  258 passed (258)
ESLint externo (teachers)       0 errores
Stylelint (teachers)            limpio
pnpm build                      ✓
```

### QA visual

- `/#/lesson/h1-05`: tarjeta con marca de agua, línea de acento, dos columnas y
  progreso segmentado.
- Al revelar: «papá», ejemplo «我爸爸是医生。» y «爸爸» resaltado.
- Pregunta de tono: etiqueta violeta con icono, cuatro pinyin y opciones
  coloreadas.
- Respuesta incorrecta: banner rosa con equis, opción elegida con equis,
  opción correcta con check, contraste y ejemplo.
- Resumen: anillo 1 de 12, «Lección completada», estrellas y palabras
  pendientes.
- 390×844: 0 px de desbordamiento, tarjeta apilada, etiqueta de modo y acciones
  visibles.
- La barra de acción de la tarjeta sigue siendo sticky.

Capturas en `.screens/audit/`: `c25-learn.png`, `c25-revealed.png`,
`c25-tone.png`, `c25-feedback.png`, `c25-summary.png`, `c25-mobile.png`,
`c25-mobile-quiz.png`, `c25-mobile-feedback.png`.

## Límites

- Es una ronda visual: no cambia el plan didáctico ni el número de respuestas.
- La marca de agua es decorativa y no debe competir con el texto; su opacidad
  es del 3,5 %.
- Las mejoras de reencuentro de fallos y resumen por capacidades que propuso
  Terra siguen pendientes para C26.
- No hay tests de regresión visual automáticos; la verificación es manual con
  capturas.
