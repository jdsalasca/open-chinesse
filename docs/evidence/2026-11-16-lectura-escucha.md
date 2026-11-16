# Ronda C8: glosa al pasar y escucha de historias (2026-11-16)

## Mecánicas nuevas

### Glosa al pasar el cursor

- En las historias, cada palabra ya era un botón; ahora también responde a
  `mouseenter`, `focus`, `mouseleave` y `blur`.
- El panel de glosa (ya fijo abajo) muestra pinyin, significado, audio y enlaces
  al carácter mientras se explora el texto.
- El clic fija la glosa; solo entonces aparece «Cerrar». En móvil, el toque sigue
  funcionando igual.
- La palabra en previsualización se marca con `is-preview`.

### Escucha continua de una historia

- Botón «Escuchar la historia» que reproduce las líneas en orden con el MP3 ya
  existente.
- Controles: pausar, seguir desde la línea pausada y detener.
- La línea activa se ilumina (`is-active`) y la página se desplaza sola para
  mantenerla a la vista.
- Mientras suena la historia se ocultan los botones de audio por frase para
  evitar dos reproducciones superpuestas.

## Bug de audio encontrado

Las 45 locuciones de historia duraban entre 0,7 y 1,1 segundos: eran audios
antiguos que no correspondían al texto actual y quedaban truncados. El script de
audio es idempotente y nunca los regeneró. Se movieron a `.tmp/audio-backup` y
se regeneraron:

```text
antes:  direcciones-01  0,71 s
después: direcciones-01  1,57 s
45 líneas: mínimo 0,71 s · media 1,55 s · máximo 2,73 s
```

## Evidencia

```text
npx vitest run                       178 passed (178)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Glosa: al pasar por «请» aparece «请 · qǐng · por favor»; al salir desaparece.
  Al hacer clic queda fija, sobrevive a mover el ratón y se cierra con «Cerrar».
- Escucha: «Pausar» + «Línea 1 de 6» + línea iluminada; al avanzar pasa a la
  línea 2 y 3; pausar deja «Pausado en 1 de 6»; seguir reanuda; detener limpia el
  estado y devuelve los botones de audio por frase.
- Móvil 390×844: sin desbordamiento, barra de escucha en una fila y línea activa
  resaltada.
- Audio: las seis líneas de «Preguntar el camino» duran 0,79–1,66 s tras la
  regeneración (antes 0,71–1,10 s para frases de hasta nueve sílabas).

Capturas en `.screens/audit/`: `c8-story-hover.png`, `c8-story-mobile.png`.

## Siguiente

El mapa completo queda en `docs/roadmap-mecanicas.md`. Orden propuesto:
dictado, cuentos para dormir, historia de China, sesión inmersiva y reto diario.
