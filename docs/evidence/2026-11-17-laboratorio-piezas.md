# Ronda C22: laboratorio de piezas (2026-11-17)

## Mecánica

- Ruta `/piezas` con **8 caracteres por tanda**.
- Cada carácter se elige entre los que tienen **al menos dos piezas clasificables** del curso.
- Para cada pieza se muestra:
  - El hanzi de la pieza.
  - Su glosa (p. ej. 钅 metal, 中 zhōng).
  - Dos botones: **Significado** o **Sonido**.
- «Comprobar las piezas» permanece deshabilitado hasta clasificar todas.
- Al comprobar:
  - Cada fila se pinta correcta/incorrecta y dice qué era.
  - Se explica el reparto completo y el gancho de memoria.
  - Enlace a la ficha del carácter.
- Resumen final, otra tanda y actividad `pieces`.

## Ejemplo

- 钟: 钅 (metal) → significado; 中 (zhōng) → sonido.
- 你: 亻 (persona) → significado; 尔 (ěr) → sonido.
- 好: 女 (mujer) y 子 (hijo) → ambos significado.

## Integración

- Tarjeta **«Laboratorio de piezas»** en Practicar (18 tarjetas).
- Enlace **«Practica estas piezas en el laboratorio»** en la composición de
  cada ficha con roles.
- Los botones son accesibles: `aria-pressed`, grupo con etiqueta y feedback
  `role="status"`.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     253 passed (253)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- 钟: piezas 钅/中; comprobar deshabilitado al inicio; asignar significado y
  sonido; feedback «Todas bien. 钅 → significado; 中 → sonido…»; enlace a ficha.
- Ocho rondas con todo «significado»: resumen 1/8, lo que confirma que no todo
  es significado.
- Ficha de 你: enlace al laboratorio.
- Practicar: 18 tarjetas.
- Móvil 390: 0 px de desbordamiento.

Capturas en `.screens/audit/`: `c22-pieces.png`, `c22-pieces-checked.png`,
`c22-pieces-summary.png`.

## Producción

- Desplegado `7ef293f` en `https://open-chinesse.eridu.top`.
- 钟: piezas 钅/中, comprobar deshabilitado al inicio, asignación correcta y
  feedback «Todas bien. 钅 → significado; 中 → sonido…».
- Enlace «Practica estas piezas en el laboratorio» en la ficha de 你.
- Practicar: 18 tarjetas, incluida «Laboratorio de piezas».
- Móvil 390: 0 px de desbordamiento y sin errores de consola distintos del 401
  esperado sin sesión.

## Límites

- Solo entran caracteres con al menos dos piezas etiquetadas; los pictogramas
  puros quedan fuera de esta mecánica.
- En caracteres ideográficos todas las piezas son «significado»; no hay una
  pieza de sonido.
- La clasificación es de dos botones, no arrastrar y soltar.
- El feedback se basa en la clasificación de la fuente; algunas etimologías son
  simplificadas.
- La actividad se registra, pero no entra en el FSRS ni en las misiones.
