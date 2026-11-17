# Ronda C17: micro-lecturas HSK 1 por unidad (2026-11-17)

## Contenido

- **Quince micro-lecturas**, una por unidad de HSK 1, de 3–4 líneas.
- Cada texto:
  - Usa solo caracteres del vocabulario HSK 1 (lo exige el test de graduación
    existente).
  - Ancla al menos dos palabras de su unidad.
  - Tiene una pregunta de comprensión con tres opciones y explicación.
  - Lleva pinyin y traducción en cada línea.
- **55 audios nuevos** con Piper, uno por línea.
- Títulos con unidad y tema: «你好！», «他是我朋友», «一、二、三», «下雨了»,
  «多少钱？»…

## Integración

Sin pantallas nuevas; el contenido se hereda en tres modos:

| Modo                 | Antes | Después |
| -------------------- | ----: | ------: |
| Historias            |     7 |  **22** |
| Comprensión auditiva |     6 |  **21** |
| Repite en voz alta   |    10 |  **25** |

- `STORIES` antepone las micro-lecturas, así que Escucha y Repite las recogen
  automáticamente.
- Escucha y Repite ordenan por nivel; dentro de HSK 1 respetan el orden de las
  unidades.
- Los contadores de Practicar y las notas de Escucha/Repite son dinámicos.

## Validación

- `micro.test.ts`:
  - 15 textos y una por unidad, en orden.
  - 3–4 líneas, `kind: 'micro-lectura'`, nivel 1.
  - Una sola respuesta correcta y explicación no vacía.
  - Al menos dos palabras de la unidad presentes.
- El test de graduación de historias comprueba que **todas** las líneas usan
  solo caracteres del vocabulario HSK 1.
- Los tests de Escucha y Repite exigen al menos 15 textos de nivel 1.

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     221 passed (221)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
node scripts/build-audio.mjs      55 nuevos, 0 fallos
```

## QA en navegador

- Historias: 22 tarjetas, 15 con «micro-lectura · HSK 1 · 1 min».
- «你好！»: 3 líneas con audio, pinyin y traducción; «Escuchar la historia»
  reproduce y resalta la línea activa.
- Escucha: 21 audios; «你好！» sin transcripción antes de responder, audio
  «Frase 1 de 3», pregunta «¿Qué dicen al despedirse?», acierto de 再见 y
  transcripción de 3 líneas.
- Repite: 25 textos; «你好！» abre en 1/3 con modelo y «Grabar mi voz».
- Practicar: 14 tarjetas; Escucha muestra «21 audios» y Repite «25 textos».
- Móvil 390×844 sin desbordamiento en lista y lector.

Capturas en `.screens/audit/`: `c17-micro-story.png`,
`c17-micro-listening.png`, `c17-micro-mobile.png`.

## Producción

- Desplegado `a02d005` en `https://open-chinesse.eridu.top`.
- Historias: 22 tarjetas, 15 micro-lecturas; «你好！» con 3 líneas y audio que
  reproduce y resalta la línea activa.
- Escucha: 21 audios en orden de unidad; «你好！» sin transcripción antes de
  responder, acierto de 再见 y transcripción de 3 líneas.
- Repite: 25 textos; «你好！» abre en 1/3 con modelo y «Grabar mi voz».
- Practicar: 14 tarjetas; «21 audios» y «25 textos».
- Móvil 390×844 sin desbordamiento y sin errores de consola distintos del 401
  esperado sin sesión.

## Límites

- El vocabulario es HSK 1, pero **no es estrictamente acumulativo por unidad**:
  un texto de la unidad 4 puede usar palabras de la 12. Se prioriza que el
  texto suene natural y ancle su unidad.
- Las preguntas son de comprensión literal; no miden inferencia.
- Una sola voz TTS y una velocidad.
- No hay pantalla nueva de «micro-lecturas»: viven en Historias.
- Los textos son deliberadamente simples; no sustituyen lectura extensiva.
