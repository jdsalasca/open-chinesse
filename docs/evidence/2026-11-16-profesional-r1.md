# Ronda P1: identidad y portada (2026-11-16)

## Diagnóstico

La portada anterior era correcta pero se leía como prototipo:

- Todo pesaba lo mismo: héroe pastel, tarjeta de sesión, meta, logros y ruta eran
  cinco bloques blancos o claros sin jerarquía.
- El progreso aparecía como una tabla de cuatro celdas dentro del héroe, con
  «Dominadas 0» en el lugar más visible.
- La ruta eran 15 tarjetas idénticas con un botón fantasma cada una; en móvil
  ocupaba más de 2.000 px de scroll.
- El logotipo era verde brillante, la cabecera mezclaba «Hoy» con «Aprender» en la
  barra inferior y el pie era una línea suelta.

## Cambios

| Antes                                 | Ahora                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| Héroe menta claro con CTA verde       | Portada verde bosque con marca, una acción primaria en menta y una secundaria fantasma |
| Tabla de 4 métricas                   | Tres métricas en línea (racha, pendientes, estudiadas) bajo un divisor                 |
| Sesión como lista de filas            | Tablero de tres pasos con icono, estado y barra de meta                                |
| Meta y logros en dos tarjetas pálidas | Panel de progreso con anillo, nivel y dos métricas + logros como insignias             |
| Ruta de 15 tarjetas verticales        | Rejilla de 3 columnas (2 en tablet, 1 en móvil) con tarjeta entera clicable            |
| «Cómo está diseñado» como lista       | Cuatro tarjetas de método con icono                                                    |
| Cabecera con «Hoy»                    | Navegación activa en verde bosque y «Aprender» en cabecera y barra inferior            |

La portada conserva la lógica: misma cola de repaso, mismo `nextUnit`, mismas
estrellas y mismos logros. Solo cambia la presentación.

## Decisiones de diseño

- **Verde bosque `#0b352a`** para la portada y los estados activos. El menta
  brillante (`#5ce39a`) queda para acciones sobre fondo oscuro; el texto oscuro
  sobre menta cumple contraste AA.
- **Una acción primaria por pantalla.** En la portada: repasar si hay cola; si no,
  empezar la lección.
- **La ruta deja de ser el centro.** Pasa debajo del progreso y se agrupa por nivel.
- **La tarjeta de unidad es un enlace completo**, sin botón anidado: menos ruido y
  un área táctil mejor.
- **Copy honesto.** Se corrigió «audio real» por «audio en cada palabra» y «vuelve
  justo antes de que se te olvide» por «cuando toca repasarla».

## Evidencia

```text
npx vitest run    143 passed
npx tsc -b        limpio
pnpm lint         0 errores, 18 advertencias (bajó de 19)
pnpm build        ✓
```

Capturas en `.screens/audit/` (ignoradas por git):

- `r1-home-desktop.png` — portada 1440×900.
- `r1-home-full.png` — página completa en escritorio.
- `r1-home-mobile2.png` — portada 390×844.
- `r1-lesson.png` — la lección sigue intacta con la nueva cabecera.
- `r1-practice.png` y `r1-stats-mobile.png` — comprobación de que el cambio de
  ancho máximo no rompe otras pantallas.
- `r1-onboarding-mobile.png` — bienvenida con el copy corregido.

## Pendiente para P2

- Modo foco en lección y repaso (la cabecera global distrae).
- Progreso segmentado y acciones ancladas en la sesión.
