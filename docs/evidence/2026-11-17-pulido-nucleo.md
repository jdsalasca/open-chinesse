# Ronda C23: pulido didáctico y visual del núcleo (2026-11-17)

## Juicio externo

Terra priorizó:

1. **Feedback con contraste** en quiz y mixta: no solo decir «Correcto» o «Era»,
   sino poner elección y respuesta juntas con una razón.
2. **Recuperación antes de revelar** en flashcards, conservando acceso inmediato
   a la respuesta.
3. **Ejemplo resuelto y desvanecimiento** en 不/没.

La ronda implementa las tres, más un sistema de movimiento y estilo sobrio.

## Cambios didácticos

### Lección: recuperación antes de revelar

- La flashcard muestra hanzi, pinyin y audio, pero **oculta significado,
  ejemplo y enlaces**.
- Pregunta: «¿Qué significa? Intenta recordarlo antes de mirar».
- Acciones:
  - **Mostrar significado**.
  - **No lo recuerdo**.
  - Intro opcional con Enter.
- Tras revelar aparecen significado, ejemplo con audio y enlaces a caracteres.
- No hay espera obligatoria: si es la primera vez, se puede mostrar y seguir.
- El paso se resetea en cada palabra; al terminar, pasa a la práctica.

### Feedback con contraste

- El quiz de lección muestra:
  - Veredicto: «Correcto: 不 significa no».
  - **Elegiste** (si falló) y **Respuesta** en tarjetas separadas.
  - **Frase de ejemplo** con audio y traducción.
  - Selector de motivo del fallo, como antes.
- El estado incorrecto es rosa y el correcto verde; no depende solo del color.

### Ejemplo resuelto en gramática

- Antes de practicar 不/没, se muestra:
  - 他昨天没去北京。
  - Pinyin, traducción y la pista: **没** porque la acción no ocurrió ayer.
- Después empieza la práctica de 7 frases y la prueba diferida sigue igual.

## Estilo y movimiento

- Entrada de contenido de **180 ms** con `ease-out`.
- Fade breve de feedback, recall de flashcard y ejemplo resuelto.
- Hover de botón con elevación de 1 px; press con escala.
- Halo mint muy suave en el fondo del contenido.
- **`prefers-reduced-motion`**: sin animaciones, sin desplazamientos y sin hover
  con transformación.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     254 passed (254)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- Lección: antes de revelar no hay significado; aparecen «Mostrar significado»
  y «No lo recuerdo»; al revelar, «hola» y el ejemplo «你好，我叫安娜。».
- Quiz tras dos frases ordenadas: elegir «cerveza» para 不 muestra
  «Elegiste cerveza / Respuesta no», la frase «我不是老师。» y el selector de
  motivo.
- Gramática: ejemplo resuelto «他昨天没去北京。» con pista de 没.
- Móvil 390: 0 px de desbordamiento en lección, gramática e inicio.
- Movimiento reducido cubierto por CSS, no solo por opinión.

Capturas en `.screens/audit/`: `c23-lesson-before.png`,
`c23-lesson-after.png`, `c23-lesson-feedback.png`, `c23-grammar-worked.png`.

### Producción

Despliegue con `./deploy.sh`: backend OK y verificación pública `/` 200,
`/api/me` 401, `/api/health` 200.

- `/#/lesson/h1-01`: antes de revelar no hay significado y aparecen «Mostrar
  significado» y «No lo recuerdo»; tras revelar, «hola» y el ejemplo
  «你好，我叫安娜。».
- Quiz de la misma lección: elegir «cerveza» para 不 muestra
  «Elegiste cerveza / Respuesta no», el ejemplo «我不是老师。» con audio y el
  selector de motivo.
- `/#/gramatica/bu-mei`: ejemplo resuelto «他昨天没去北京。» con pinyin,
  traducción y pista de 没, antes de las 4 reglas y los 3 contrastes.
- Móvil 390 en producción: 0 px de desbordamiento en lección, gramática e
  inicio.

Capturas de producción en `.screens/audit/`: `c23-prod-feedback.png`,
`c23-prod-grammar.png`, `c23-prod-mobile.png`.

## Base de investigación

- **Roediger y Karpicke (2006)**: la práctica de recuperación mejora la
  retención frente a la relectura. Aplicado al revelado opcional de la
  flashcard.
- **Renkl y Atkinson (2003)**: los ejemplos resueltos y su desvanecimiento
  reducen carga inicial y transfieren el trabajo al estudiante. Aplicado al
  ejemplo de 不/没 antes de la práctica.
- **Sweller et al. (2020)**: gestionar la carga cognitiva evita dividir la
  atención. Aplicado al feedback con una sola comparación y al ejemplo con la
  pista temporal señalada.
- Terra advierte que son hipótesis de diseño informadas, no resultados medidos
  en este producto.

## Límites

- La recuperación antes de revelar puede frustrar en palabras completamente
  nuevas; por eso el botón de mostrar es inmediato y no penaliza.
- El contraste de feedback está en la lección; mixta mantiene su explicación
  propia y no se uniformó.
- El ejemplo resuelto es solo de 不/没; no hay motor de ejemplos por tema.
- No se añadieron métricas de retención específicas para estas variantes.
- El movimiento es deliberadamente sobrio; no hay animaciones por modo.
