# Navegación inferior y secciones (2026-11-16)

## Qué se añadió

- **Barra inferior fija** en móvil (< 720 px) con cinco secciones: Aprender,
  Practicar, Historias, Inmersión, Yo. `aria-label="Secciones"`, `aria-current`
  en la activa y anillo de foco propio.
- **Practicar** (`#/practicar`): hub con repaso espaciado, escucha y tonos, cada
  tarjeta con su enlace real.
- **Historias** e **Inmersión**: pantalla «Próximamente» explícita, no un vacío
  falso.
- La navegación superior de escritorio pasa a Hoy · Practicar · Historias ·
  Inmersión · Progreso; en móvil se oculta para no duplicar la barra.

## Delegación (y qué pasó)

Codex primero con `gpt-6-luna` (4 archivos nuevos, `tsc` y oxlint verdes, pero
con un icono duplicado a mano) y después **`gpt-6.1-terra` medium** en revisión
de solo lectura. Terra encontró seis cosas; esto es lo que se hizo con ellas:

| Hallazgo                                                              | Decisión                                                    |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| «Ir al contenido» (`#contenido`) cambiaba de ruta a la portada        | **Arreglado**: el router ignora anclajes internos           |
| Sin enlace a Practicar/Historias/Inmersión en escritorio              | **Arreglado**: navegación superior ampliada                 |
| Reserva fija de 4,5 rem tapaba el pie con área segura                 | **Arreglado**: `calc(4.5rem + env(safe-area-inset-bottom))` |
| «Tonos» prometía corregir el tono y el repaso pide pinyin sin tonos   | **Arreglado**: texto ajustado a lo que hace                 |
| La barra desaparece en Repaso                                         | **Ruling**: en lección y repaso manda la tarea; hay «Salir» |
| Orden de tabulación del encabezado en móvil no coincide con lo visual | **Diferido**: es anterior a esta ronda                      |

## Evidencia

```bash
$ npx vitest run    # 100 passed (12 files)
$ npx tsc -b        # 0
$ pnpm lint         # 0 (19 advertencias conocidas)
$ pnpm build        # gzip ~166 kB
```

Comprobado en Chrome:

- 390×844, `#/practicar`: barra inferior con «Practicar» activa, navegación
  superior oculta, tres tarjetas.
- 1200×900: barra superior con las cinco secciones y barra inferior oculta.
- Clic en «Ir al contenido» desde Practicar: el hash pasa a `#contenido` y la
  pantalla sigue siendo Practicar.
