# Ronda C14: comprensión auditiva (2026-11-17)

## Mecánica

- Ruta `/escucha` con seis audios cortos:
  - Historias: «En el restaurante», «Mi día» y «Preguntar el camino».
  - Cultura: «Una noche en familia», «Una taza de té» y «Una mañana en Pekín».
- Cada audio tiene **una pregunta de comprensión** con tres opciones.
- El texto **no se muestra** durante la escucha: ni hanzi, ni pinyin, ni
  traducción. Solo el reproductor y la pregunta.
- Tras responder se muestra la corrección con la línea del texto que lo justifica
  y un botón **«Ver la transcripción»**.
- La transcripción revela hanzi, pinyin, traducción y, en las lecturas de China,
  la explicación por línea.
- El reproductor permite pausar, seguir y detener; al responder se detiene para
  leer con calma.

## Contenido

- Se añadieron preguntas a tres historias que no las tenían:
  - Mi día: qué hace por la tarde.
  - En el restaurante: cuánto cuesta el total.
  - Preguntar el camino: dónde está la estación.
- Las tres lecturas de China ya traían su pregunta desde C10.
- El generador `lib/listening.ts` combina ambas fuentes y valida que cada
  ejercicio tenga líneas y una sola respuesta correcta.

## Evidencia

```text
npx vitest run                       205 passed (205)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Lista con seis audios, niveles y número de frases.
- «En el restaurante»: sin transcripción antes de responder; el audio muestra
  «Frase 1 de 6»; al elegir «Veinte yuanes» aparece la corrección con la línea
  del texto; «Ver la transcripción» muestra las seis líneas.
- Móvil 390×844 sin desbordamiento.
- Practicar: doce tarjetas, incluida «Comprensión auditiva».

Capturas en `.screens/audit/`: `c14-listening-list.png`,
`c14-listening-reader.png`, `c14-listening-mobile.png`.

## Producción

- Desplegado `ec34517` en `https://open-chinesse.eridu.top`.
- `/escucha`: seis audios; «En el restaurante» abre sin transcripción, reproduce
  «Frase 1 de 6», acepta «Veinte yuanes» y revela las seis líneas.
- Practicar: doce tarjetas, incluida «Comprensión auditiva».
- Sin errores de consola distintos del 401 esperado sin sesión.

## Límites

- Una sola pregunta por audio; no mide comprensión detallada de cada línea.
- Las preguntas de historia son tres; las otras cuatro no tienen aún.
- El audio es TTS y no varía de voz ni de velocidad.
