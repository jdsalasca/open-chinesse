# Ronda C12: fallos y tonos (2026-11-17)

## Cuaderno de errores

- Nueva ruta `/fallos` y tarjeta en Practicar con el número de palabras
  falladas.
- La sesión toma los fallos del aprendiz, los ordena por el más reciente y elige
  el formato según el motivo guardado:
  - `sound` → escuchar y elegir el significado.
  - `meaning` → hanzi y elegir el significado.
  - `order` → completar la frase (o significado si el ejemplo no admite hueco).
  - `tone` → audio y elegir el pinyin.
  - `unknown` → significado.
- Se añadió el motivo **«Confundí el tono»** al selector de fallos.
- Reutiliza la pantalla de sesión mixta; el resumen explica que el repaso normal
  sigue viendo esas palabras.
- La actividad guarda `wordId`, no solo el tipo y el acierto. Es la base para
  medir el acierto diferido a 7/30 días sin cambiar el esquema.

## Dictado con tonos

- Casilla **«Exigir tonos»** activa por defecto en cada pregunta.
- En modo estricto, `ni hao` no cuenta: el feedback muestra que faltan los tonos
  y la forma válida (`nǐ hǎo` o `ni3 hao3`).
- Se puede desactivar para seguir aceptando pinyin sin tonos.
- El hanzi exacto sigue siendo válido en ambos modos.

## Evidencia

```text
npx vitest run                       199 passed (199)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Fallos con cuatro motivos: la sesión muestra escucha, significado, tonos y la
  cuarta palabra; el resumen dice «Tus fallos · 0 de 4».
- Practicar: diez tarjetas; «Tus fallos · 4 palabras».
- Dictado estricto: `ni hao` falla y explica «Faltan los tonos»; tras desactivar
  la casilla, el mismo texto se acepta como correcto.
- Móvil 390×844: sin desbordamiento y cuatro opciones legibles.

Capturas en `.screens/audit/`: `c12-fallos-mobile.png`,
`c12-dictation-strict.png`.

## Producción

- Desplegado `a5bcf46` en `https://open-chinesse.eridu.top`.
- `/fallos` con dos fallos: primera pregunta de escucha, cuatro opciones y
  contador 1/2.
- Practicar: diez tarjetas y «Tus fallos · 2 palabras».
- `/dictado`: «Exigir tonos» activo; `ni hao` falla con el aviso de tonos.
- Sin errores de consola distintos del 401 esperado sin sesión.

## Límites

- Solo se guarda el último motivo por palabra; no hay historial de intentos.
- La métrica de acierto diferido queda preparada con `wordId`, pero aún no se
  muestra en Progreso.
- `order` cae en contexto o significado cuando el ejemplo no tiene un hueco
  válido; no se reutiliza el ejercicio de ordenar.
