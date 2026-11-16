# Ronda C7: deuda de módulos (2026-11-16)

## Diagnóstico

Dos archivos concentraban el tamaño que quedaba:

- `src/screens/Scenarios.tsx`: 600 líneas con lista, tarjeta, reproductor,
  historial, burbujas, opciones, teclado y resumen.
- `src/styles/_home.scss`: 728 líneas con portada, sesión, progreso, misiones,
  logros, ruta y el bloque heredado de Progreso.

No había un bug de comportamiento; el objetivo era que cada pieza se pudiera
leer y tocar sin arrastrar el resto.

## Cambios

### Situaciones

| Archivo                                   | Líneas | Contenido                                   |
| ----------------------------------------- | -----: | ------------------------------------------- |
| `screens/Scenarios.tsx`                   |     88 | Lista, tarjeta y vista de «no encontrada»   |
| `screens/ScenarioPlayer.tsx`              |    298 | Reproductor, historial, teclado y ayudas    |
| `components/scenario/Bubble.tsx`          |     44 | Burbuja de diálogo y sus capas de ayuda     |
| `components/scenario/Choice.tsx`          |    133 | Opciones, feedback y avance de una decisión |
| `components/scenario/ScenarioSummary.tsx` |     41 | Cierre con intentos                         |
| `components/scenario/aids.ts`             |      1 | Tipo compartido de ayudas                   |

### Estilos

`_home.scss` pasa de 728 a 202 líneas. El resto se reparte en
`_home-session.scss` (105), `_home-progress.scss` (90), `_home-route.scss` (97),
`_missions.scss` (145) y `_achievements.scss` (71). El bloque `.method` se mueve
a `_stats.scss`, que es su único consumidor. `main.scss` importa los parciales.

### Detalle de producto

- La insignia de racha decía «1 días»; ahora distingue «1 día» / «N días».

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

- Portada con hero, sesión, progreso, misiones y ruta: todos los bloques
  conservan estilos tras el split.
- Inmersión: cuatro pestañas y fondo activo correctos (`.level-switch` movido).
- Progreso: tarjeta «Qué hay detrás» con fondo y borde.
- Situaciones: primera línea, barra al 16,7 %, Enter avanza, tres opciones,
  región `aria-live` y sin errores de consola.
- El CSS compilado contiene `.achievement-tile`, `.missions__streak`,
  `.progress-card__stats`, `.roadmap__card`, `.hero__watermark` y `.method__list`.

Capturas en `.screens/audit/`: `c7-home.png`, `c7-immersion.png`.

## Pendiente

- Ancho dinámico de las barras de progreso: hoy usa `style` inline; el resto del
  contrato está limpio.
- Migración opcional para datos anteriores al esquema 3.
