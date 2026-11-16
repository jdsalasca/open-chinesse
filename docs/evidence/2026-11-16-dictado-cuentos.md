# Ronda C9: dictado y cuentos para dormir (2026-11-16)

## Dictado

- Nueva ruta `/dictado` y tarjeta en Practicar.
- Toma hasta diez palabras ya estudiadas (historial de repaso), las baraja con
  semilla y reproduce su MP3.
- Respuesta en hanzi o pinyin; el corrector acepta pinyin con tonos, sin tonos o
  el carácter exacto. Reutiliza `checkCloze`/`isClozeCorrect`.
- Feedback inmediato con la forma correcta, el pinyin y el significado; resumen
  con puntuación y «Otra tanda».
- Cada respuesta registra `dictation` en la actividad, así que aparece en el
  resumen semanal; no altera FSRS.
- Estado vacío si todavía no hay palabras estudiadas.

## Cuentos para dormir

- Ruta `/dormir` con tres cuentos nuevos:
  - 小猫和我 (HSK 1)
  - 妈妈的茶 (HSK 2)
  - 一个很好的晚上 (HSK 2)
- 24 líneas con hanzi, pinyin, traducción y una explicación gramatical o de
  vocabulario por línea.
- Panel nocturno con letra grande, línea activa resaltada, controles de pausa,
  seguir y detener, y desplazamiento automático.
- Audio propio generado con Piper a `length_scale 1.25` (voz más lenta). El
  generador acepta `lengthScale` por trabajo y el script incluye los cuentos.
- El reproductor de historias se extrajo a `src/lib/story-audio.ts` y ahora lo
  comparten Historias y Cuentos.

## Validación de contenido

- Test nuevo: cada cuento usa solo caracteres de palabras HSK de su nivel o
  inferior, y toda línea trae pinyin, traducción y explicación.
- Duraciones de audio: 1,49 s (`sleep-gatito-01`), 2,23 s (`sleep-te-01`),
  1,64 s (`sleep-noche-01`), claramente por encima de la locución normal.

## Evidencia

```text
npx vitest run                       185 passed (185)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Practicar: siete tarjetas, incluidas Dictado y Cuentos; sin desbordamiento en
  móvil.
- Dictado con una palabra estudiada: input enfocado, «ni hao» se acepta como
  correcto, muestra «你好 · nǐ hǎo · hola», resumen «1 de 1»; «Otra tanda»
  reinicia vacío y enfocado; «xiexie» falla y muestra la respuesta correcta.
- Estado vacío: «Aún no hay palabras para dictar».
- Cuentos: lista con tres tarjetas y niveles; lector oscuro con ocho líneas y
  ocho explicaciones; «Escuchar despacio» activa «Línea 1 de 8», ilumina la
  línea activa y avanza; móvil sin desbordamiento.

Capturas en `.screens/audit/`: `c9-practice.png`, `c9-practice-mobile.png`,
`c9-dictation-mobile.png`, `c9-bedtime-list.png`, `c9-bedtime-reader.png`,
`c9-bedtime-playing.png`, `c9-bedtime-mobile.png`.

## Producción

- Desplegado `c62a16b` en `https://open-chinesse.eridu.top`.
- `/dormir`: tres tarjetas; «小猫和我» con ocho líneas, ocho explicaciones y
  audio de 1,49 s; reproducción con línea activa y voz lenta.
- `/historias/direcciones`: escucha continua y glosa al pasar siguen funcionando
  tras extraer el reproductor.
- `/dictado`: «ni hao» se acepta como 你好; sin errores de consola distintos del
  401 esperado sin sesión.

## Pendiente

- Historia de China en chino (HSK 3).
- Sesión inmersiva mixta y reto del día.
- Shadowing y comprensión auditiva con pregunta.
