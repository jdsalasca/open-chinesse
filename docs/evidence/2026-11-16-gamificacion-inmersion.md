# Gamificación sonora e inmersión sin peso (2026-11-16)

## Sonido

Efectos cortos **sintetizados con Web Audio**: sin MP3 de interfaz, sin peso en el
servidor.

- Acierto: dos notas ascendentes. Fallo: dos notas graves. Lección perfecta:
  arpegio de cuatro notas.
- Suena al responder en la práctica, al comprobar una frase y al terminar con tres
  estrellas.
- Interruptor en el pie («Sonido: encendido/apagado») con preferencia guardada y
  `aria-pressed`. Si el navegador no tiene `AudioContext`, no pasa nada.

## Color

Las tarjetas de recursos rotan entre los tonos de la paleta (menta, cielo, lila),
el mismo lenguaje pastel del resto de la app. Nada de colores fuera de los tokens.

## Inmersión: contenido real, enlaces verificados

`#/inmersion` deja de ser «próximamente» y pasa a ser una lista curada de **10
vídeos de YouTube** para HSK 1–3, con filtro por nivel:

- Canales de input comprensible (Lazy Chinese, Mandarin Click, Mandarin Slowly,
  Chinese Unleashed, Crazie Laoshi, Alison Mandarin) y una lección en español.
- **Verificados con `yt-dlp`**: título y duración reales, no enlaces de memoria
  (el primero que escribí a mano era inventado y se descartó).
- Cada tarjeta: tipo, nivel, duración, por qué sirve y enlace externo
  (`target="_blank" rel="noreferrer noopener"`).
- **No se descarga ni se aloja vídeo ni imagen**: el servidor no engorda.

## Evidencia

```bash
npx vitest run   # 111 passed (15 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
pnpm build       # OK
```

- Captura de `#/inmersion`: rejilla de tarjetas en tres tonos, filtros Todos/HSK 1/2/3.
- Interruptor de sonido: clic → `off` en `localStorage` y etiqueta «Sonido: apagado»;
  clic otra vez → `on`.

## Límites

- El sonido no se puede verificar a oído desde aquí: se comprobó que el
  `AudioContext` existe y que el interruptor persiste. El volumen es bajo a propósito.
- Los enlaces son externos: si un vídeo se cae, se retira en el siguiente despliegue.
  No controlamos YouTube ni su publicidad.
