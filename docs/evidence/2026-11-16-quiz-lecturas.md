# Quiz rotatorio, respuesta obligatoria y lecturas graduadas (2026-11-16)

## Qué se corrigió de la auditoría

1. **El quiz rota cada día.** `makeQuiz(unit, variant)` recibe el día como semilla: la
   misma unidad no repite las seis preguntas de ayer. Sigue siendo determinista dentro
   del día (repetir en la misma sesión no cambia las opciones).
2. **El repaso exige intento antes de revelar.** Ya no hay «Mostrar respuesta»: hay que
   escribir el pinyin (o usar «No lo sé», que registra el fallo como motivo «no
   conocía»). La nota sigue siendo del usuario, pero la señal es más honesta.
3. **Test de graduación de las lecturas.** `stories.test.ts` calcula el nivel mínimo real
   de cada historia (carácter a carácter, contra el vocabulario del curso) y falla si la
   etiqueta promete menos de lo que necesita.

El test encontró tres etiquetas falsas y se corrigieron:

| Historia   | Antes | Realidad                               |
| ---------- | ----- | -------------------------------------- |
| 我的一天   | HSK 1 | HSK 2 (起床, 早上)                     |
| 周末去公园 | HSK 2 | HSK 3 (公园, 花, 树, 面条)             |
| 在超市     | HSK 1 | HSK 2 → reescrita a HSK 2 (苹果, 好吃) |
| 问路       | HSK 2 | HSK 3 (车站, 一直)                     |

Además se cambiaron `面包` (HSK 3) por `米饭` y se regeneró el audio de las líneas
tocadas.

## Evidencia

```bash
npx vitest run   # 134 passed (21 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
pnpm build       # OK; 4 audios de historia regenerados
```

## Deuda que sigue abierta

- La rotación del quiz es **diaria**, no por intento dentro del mismo día.
- El repaso permite autocalificar sin comparar contra la respuesta correcta.
- Sigue sin haber prueba diferida de aprendizaje (7/30 días).
- Una sola voz TTS.

## Cómo se comprobaría que enseña

Prueba inicial con 20 palabras reservadas + prueba a los 7 días, sin pistas ni las
mismas opciones; medir significado, pinyin y tonos por separado. Ese es el siguiente
entregable de medición, no XP ni rachas.
