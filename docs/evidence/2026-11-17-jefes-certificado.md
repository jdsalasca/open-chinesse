# Ronda C13: jefes de nivel y certificado (2026-11-17)

## Jefes de nivel

- Ruta `/jefes` con los tres niveles HSK.
- El jefe se desbloquea cuando **todas las unidades del nivel tienen al menos una
  estrella**; antes de eso la tarjeta queda bloqueada y explica cuántas faltan.
- Examen de **15 preguntas mezcladas** generadas con el banco de la sesión mixta
  (significado, escucha, contexto y tonos), sin pistas.
- **80% para aprobar** (12 de 15). No bloquea contenido: se puede repetir.
- Cada respuesta se registra como actividad `boss` con su `wordId`.

## Certificado

- Al aprobar se guarda un certificado en el aprendiz: nivel, aciertos y fecha.
- Se conserva el **mejor resultado**; repetir con menos no lo empeora.
- El certificado se puede volver a ver en `/certificado/<nivel>` y **imprimir o
  guardar como PDF** con estilos de impresión.
- El documento dice explícitamente que es de práctica y no un certificado oficial
  HSK.

## Persistencia

- `certificates` entra en el estado persistido, la exportación y la
  sincronización; el esquema sube a **10** y los datos antiguos reciben `{}`.
- El jefe lee las estrellas y los certificados ya existentes; no cambia FSRS ni
  el progreso de las tarjetas.

## Evidencia

```text
npx vitest run                       203 passed (203)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Lista con HSK 1 disponible y HSK 2/3 bloqueados; los botones de los niveles
  bloqueados quedan deshabilitados.
- Examen HSK 1: 15 preguntas; completado con 15/15.
- Certificado con «Aprendiz», «HSK 1 · Fundamentos», «15 de 15 aciertos» y
  botón de impresión.
- Guardado en `localStorage`: `certificates["1"] = { score: 15, total: 15, at }`.
- Lista tras aprobar: «Aprobado · 15/15», «Repetir jefe» y «Ver certificado».
- `/certificado/1` y versión móvil 390×844 sin desbordamiento.

Capturas en `.screens/audit/`: `c13-boss-list.png`, `c13-boss-certificate.png`,
`c13-boss-passed.png`, `c13-certificate-page.png`, `c13-certificate-mobile.png`.

## Producción

- Desplegado `2f4d464` en `https://open-chinesse.eridu.top`.
- `/jefes`: HSK 1 disponible; HSK 2 y 3 bloqueados con el botón deshabilitado.
- Examen HSK 1: 15 preguntas, completado con 15/15; certificado emitido y
  guardado en `certificates["1"]`.
- `/certificado/1`: certificado visible con el nombre, nivel, aciertos y botón
  de impresión.
- Sin errores de consola distintos del 401 esperado sin sesión.

## Límites

- El examen usa los cuatro formatos de la sesión mixta; no incluye producción
  escrita ni oral.
- Las 15 preguntas son aleatorias y no están calibradas por dificultad.
- El certificado no es oficial y no se comparte por enlace.
