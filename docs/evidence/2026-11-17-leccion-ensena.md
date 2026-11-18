# Ronda C27: la lección enseña antes de preguntar (2026-11-17)

## Problema

Al entrar en una lección nueva, la primera tarjeta mostraba 北京 con su pinyin y
preguntaba «¿Qué significa? Intenta recordarlo antes de mirar». Para una palabra
que el alumno nunca ha visto, eso no es recuperación: es adivinar. Además, el
botón principal quedaba al borde inferior y el pinyin de palabras sin espacios
coloreaba toda la palabra con el tono de la primera sílaba.

## Cambios

### Primera exposición directa

La tarjeta de la lección muestra desde el primer momento:

- hanzi grande;
- pinyin con color y número de tono por sílaba;
- audio de la palabra;
- significado;
- ejemplo con audio, pinyin y traducción;
- piezas del carácter y una leyenda de tonos en la primera tarjeta.

Ya no hay «Mostrar significado» ni «No lo recuerdo» en la lección. El alumno
lee, escucha y entiende antes de que se le pida recuperar. La recuperación sigue
existiendo, pero después: en las comprobaciones por parejas y en el repaso.

### Dificultad progresiva

La primera comprobación de una unidad es **reconocer el significado**. Después
aparecen escucha, hueco y tono en este orden aproximado:

1. ronda 1: reconocer;
2. ronda 2: escuchar;
3. ronda 3: escuchar + completar;
4. ronda 4: tono + reconocer;
5. ronda 5: escuchar + completar;
6. cierre: ordenar dos frases.

Así el tono no es la primera tarea sobre una palabra recién vista.

### Acción siempre visible

- La barra de acción de la lección pasa de `sticky` a `fixed` en la parte
  inferior del viewport, centrada y con fondo degradado.
- La lección reserva espacio inferior para que el contenido no quede tapado.
- El feedback del quiz se autoenfoca con `scrollIntoView({ block: 'nearest' })`
  para que el veredicto y el botón «Siguiente» queden a la vista en móvil.

### Pinyin por sílabas

`pinyinTokens` ahora separa palabras sin espacios usando un conjunto de sílabas
pinyin y programación dinámica. Ejemplos:

- `Běijīng` → `Běi` (3) + `jīng` (1);
- `Zhōngguó` → `Zhōng` (1) + `guó` (2);
- `bàba` → `bà` (4) + `ba` (5);
- `xièxie` → `xiè` (4) + `xie` (5);
- `duìbuqǐ` → `duì` (4) + `bu` (5) + `qǐ` (3).

El color y el número de tono de cada sílaba son ahora correctos. La comprobación
de pinyin (`checkPinyin`) usa la misma secuencia, así que escribir `bei3 jing1`
para 北京 cuenta como correcto y `bei3 jing2` como tono equivocado.

## Verificación

```text
npx prettier --check src        limpio
npx tsc -b                      limpio
npx vitest run                  267 passed (267)
ESLint externo (teachers)       0 errores
Stylelint (teachers)            limpio
pnpm build                      ✓
```

Tests nuevos o ajustados:

- `pinyinTokens` separa `Běijīng`, `Zhōngguó`, `bàba` y `xièxie`.
- `checkPinyin` acepta/niega los tonos de una palabra sin espacios.
- El plan de lección empieza con dos preguntas de reconocimiento.

### QA visual

- `/#/lesson/h1-08`: 中国 muestra «China» y «中国很大。» desde el inicio, sin
  revelado; barra fija con «Siguiente palabra».
- 北京 (palabra 2) muestra «Pekín», el ejemplo «北京是中国的首都。» y el pinyin
  `Běi³ jīng¹` con colores distintos.
- La primera comprobación es «¿Qué significa?», no una pregunta de tono.
- 390×844: 0 px de desbordamiento, barra fija y feedback con «Siguiente»
  visible tras responder.
- La leyenda de tonos aparece solo en la primera tarjeta.

Capturas en `.screens/audit/`: `c27-learn.png`, `c27-pinyin.png`,
`c27-first-check.png`, `c27-mobile.png`, `c27-mobile-feedback.png`.

## Base didáctica

- **Sweller et al. (2020)**: antes de recuperar, el alumno necesita una carga
  inicial manejable. Mostrar significado y ejemplo reduce la adivinación.
- **Roediger y Karpicke (2006)**: la recuperación sigue siendo central, pero
  después de una primera exposición clara, no antes.
- **Terra (C23/C24)**: ya había señalado que pedir producción de algo no
  enseñado era un clic sin decisión real; C27 lo corrige.

## Límites

- El separador de sílabas es heurístico: palabras ambiguas sin apóstrofo pueden
  dividirse de otra forma; los datos del curso usan apóstrofos cuando hacen
  falta.
- Nombres propios sin marcas de tono se dejan como un solo token.
- No hay métricas de retención que demuestren que este orden aprende más; la
  mejora es de diseño y de precisión del pinyin.
- La grabación con micrófono físico y la retención a días siguen pendientes.
