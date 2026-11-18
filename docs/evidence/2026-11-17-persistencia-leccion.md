# Ronda C29: persistencia de la parte de lección (2026-11-17)

## Problema

Las tres partes de la lección vivían en la misma ruta. Si el alumno salía
después de la parte 1, al volver empezaba otra vez desde el principio. Eso
rompía la sensación de tres lecciones cortas.

## Cambios

### Guardado por unidad

`src/lib/lesson-progress.ts` guarda en `localStorage` la parte 1–3 de cada
unidad:

- `loadLessonPart(unitId)` devuelve 1 si no hay nada o si el valor no es válido.
- `saveLessonPart` solo guarda partes 2 y 3; la parte 1 es el estado inicial.
- `clearLessonPart` borra la entrada al terminar la lección.
- Todo va envuelto en `try/catch`: sin almacenamiento, la lección sigue
  funcionando y simplemente no recuerda la parte.

### Lección

- Al montar, el plan se filtra desde la parte guardada: si vuelves en la parte
  2, empiezas en la palabra 4, no en la 1.
- Al entrar en una parte nueva se guarda esa parte.
- Al llegar al resumen se limpia la entrada.
- Los segmentos de progreso marcan las partes anteriores como completadas.
- El contador de palabras sigue siendo global (`4 / 10`, `7 / 10`).

### Portada

El botón de la siguiente lección ahora distingue:

- «Siguiente: Primeras palabras» si no hay parte guardada;
- «Continuar: Primeras palabras · parte 2/3» si el alumno se quedó a medias.

## Verificación

```text
npx prettier --check src        limpio
npx tsc -b                      limpio
npx vitest run                  272 passed (272)
ESLint externo (teachers)       0 errores
Stylelint (teachers)            limpio
pnpm build                      ✓
```

### QA en navegador

- Completar la parte 1 de `h1-08` guarda `2` en
  `open-chinesse:lesson-part:h1-08`.
- Recargar abre «Parte 2 de 3 · Primer contacto», palabra 商店, contador
  `4 / 10`, segmentos `is-done / is-current / pendiente`.
- Forzar la parte 3 abre «Parte 3 de 3», palabra 上, contador `7 / 10` y dos
  segmentos completados.
- Terminar la parte 3 muestra el resumen «Lección completada» y deja la clave
  de `localStorage` en `null`.
- Portada con la parte 2 guardada: «Continuar: Primeras palabras · parte 2/3».

Capturas en `.screens/audit/`: `c29-resume.png`, `c29-finish.png`,
`c29-home-resume.png`.

## Límites

- Se retoma al **inicio de la parte guardada**, no en el paso exacto. Si sales
  a mitad de la parte 2, vuelves a empezar la parte 2, no la lección completa.
- La parte se guarda por unidad en este navegador; no se sincroniza con la
  cuenta.
- Las métricas y la analítica siguen fuera de esta ronda, a propósito.
- La comunidad no se implementa aquí: primero el núcleo debe sentirse sólido.
