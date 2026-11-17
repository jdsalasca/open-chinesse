# Ronda C19: sesión diaria y familia del radical (2026-11-17)

## La sesión diaria

La sesión deja de ser tres enlaces y pasa a ser un recorrido:

1. **Recuperar**: repaso de las tarjetas que tocan. Si no hay ninguna, el paso
   se omite y la sesión empieza en la lección.
2. **Aprender**: la siguiente unidad.
3. **Producir**: el cierre diario.

- Home tiene un CTA único: **«Empezar la sesión de hoy»**.
- La barra de sesión muestra solo los pasos reales: Repaso, Lección y Cierre.
- Tonos sigue en Practicar, pero deja de ser un paso obligatorio de la sesión.

## El cierre diario (`/cierre`)

Tres dinámicas cortas, sin nota automática:

### 1. El carácter de hoy

- Elige un carácter de la unidad con historia rica (pictograma, nota curada o
  sentido propio).
- Muestra hanzi, lectura, significado, historia y gancho de memoria.
- **Mini-quiz** generado con la ficha: pieza fonética o radical.
- Enlace a la ficha completa.

### 2. La frase de hoy

- Reproduce el audio de una frase de ejemplo de la unidad.
- El alumno elige entre tres palabras cuál oye.
- Feedback inmediato y, después, la frase completa con hanzi, pinyin y
  traducción.

### 3. Tu frase

- Dos palabras de la unidad con audio y significado.
- El alumno escribe o dice una frase propia.
- Puede revelar una **frase modelo** y autoevaluarse: «Me salió» o «Quiero
  repasar».
- No hay corrección automática; el cierre se registra como actividad.

## Ficha: familia del radical

- Nueva tarjeta **«Familia del radical»** con hasta 16 caracteres del curso que
  comparten el radical.
- Ejemplo en 你: 亻 (persona) → 人, 什, 他, 们, 休, 会, 住…
- Se suma a la familia fonética y a los confundibles.

## Feedback

- La opción incorrecta pasa de verde a **rosa**, alineada con el feedback de
  error. Antes una respuesta mala podía parecer buena.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     242 passed (242)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- Home: «Recupera, aprende, produce», pasos Repaso/Lección/Cierre y CTA único.
- Empezar sesión: entra al repaso y la barra muestra los tres pasos.
- Cierre directo: carácter 好, historia mujer + hijo, quiz de radical con
  feedback, frase con audio y opciones, frase completa «我是学生。», modelo
  «你好，我叫安娜。» y autoevaluación.
- Familia del radical en 你: 16 caracteres del curso, incluido 他.
- Opción incorrecta en rosa, correcta en verde/azul.
- Móvil 390: 0 px de desbordamiento en Home y Cierre.

Capturas en `.screens/audit/`: `c19-session-home.png`, `c19-close.png`,
`c19-radical-family.png`, `c19-close-mobile.png`.

## Producción

- Desplegado `c9e3eb7` en `https://open-chinesse.eridu.top`.
- Home: «Recupera, aprende, produce», pasos Repaso/Lección/Cierre y CTA único.
- Cierre: carácter 好 con historia mujer + hijo y quiz de radical; frase con
  audio y opciones; producción con dos palabras, modelo y autoevaluación.
- Ficha de 你: familia del radical 亻 con 16 caracteres del curso.
- Opción incorrecta en rosa.
- Móvil 390: 0 px de desbordamiento; sin errores de consola distintos del 401
  esperado sin sesión.

## Límites

- El carácter y la frase del día se repiten mientras se esté en la misma
  unidad; cambian al avanzar.
- El carácter se elige con una heurística de calidad (pictograma > nota con
  piezas > nota > sentido), no por dificultad del alumno.
- La frase modelo es un ejemplo del curso, no una corrección de la frase escrita.
- La autoevaluación es subjetiva y no altera el FSRS.
- La familia del radical se limita a 16 caracteres y al vocabulario del curso.
- No hay notificación cuando la sesión está disponible.
