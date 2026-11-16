# Ronda C6: producto en situaciones y biblioteca (2026-11-16)

## Diagnóstico

- **Situaciones** no decía cómo iba la escena ni qué tal había salido: al
  terminar solo repetía el objetivo. El paso actual tampoco se anunciaba a
  lectores de pantalla y las teclas 1–3 seguían activas con la ficha de carácter
  abierta.
- **Practicar** anunciaba «Cuatro escenas» escrito a mano y no reflejaba las
  completadas.
- **Inmersión** tenía cabecera propia y asignaba el color de cada tarjeta por su
  posición: al filtrar por nivel, los colores cambiaban.
- **Progreso** usaba otra cabecera distinta a la del resto de la biblioteca y,
  sin tarjetas, dejaba un gráfico de barras vacío.
- **Tonos** mostraba las opciones a 16 px: las marcas de tono se perdían y el
  ejercicio trata justamente de distinguirlas.

## Cambios

| Antes                              | Ahora                                                           |
| ---------------------------------- | --------------------------------------------------------------- |
| Sin barra de progreso en la escena | Barra fina bajo la cabecera, igual que lección y repaso         |
| Resumen solo con el objetivo       | Añade «Sin fallos» o «N intentos extra»                         |
| Paso actual sin anuncio            | Región `aria-live="polite"` en el paso corriente                |
| Teclas 1–3 activas tras el diálogo | Se ignoran mientras exista `[aria-modal="true"]`                |
| «Cuatro escenas» fijo              | «4 escenas» desde los datos y «1 de 4 hechas» desde el progreso |
| Cabecera propia de Inmersión       | `PageHeader` común con borde y jerarquía                        |
| Color por posición                 | Color por nivel HSK (menta, cielo, lila), estable al filtrar    |
| Filtros sin cifras                 | Cada pestaña muestra su número de recursos                      |
| Gráfico vacío en Progreso          | Nota «Todavía no hay repasos programados»                       |
| Opciones de tono a 16 px           | 1.15 rem con más interletra                                     |

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

- Situaciones (1280×900 y 390×844): barra al 33 % en el paso 2/6; una opción
  incorrecta muestra su explicación y se deshabilita; al terminar, el resumen
  dice «Un intento extra»; sin desbordamiento horizontal.
- Teclado: «2» elige la opción incorrecta, «1» la correcta y Enter avanza de
  3/5 a 4/5.
- Lista de situaciones: «1 de 4» y tarjeta «Hecha»; Practicar muestra
  «1 de 4 hechas».
- Inmersión: `PageHeader`, pestañas «Todos 10 · HSK 1 6 · HSK 2 2 · HSK 3 2» y
  colores por nivel.
- Progreso: cabecera con borde y estado vacío del pronóstico.
- Tonos: las cuatro variantes (`yǐzhí`, `yízhí`, `yìzhí`, `yīzhí`) se
  distinguen a simple vista.
- Audio: las 23 líneas de las cuatro situaciones tienen MP3.

Capturas en `.screens/audit/`: `c6-scenarios-mobile.png`,
`c6-scenario-mobile.png`, `c6-scenario-summary.png`, `c6-immersion.png`,
`c6-stats.png`, `c6-tones.png`.

## Pendiente

- Dividir `Scenarios.tsx` (ya cerca de 600 líneas) y `_home.scss`.
- Revisar si las ayudas de lectura deben quedarse fijas al hacer scroll.
- Migración opcional para datos anteriores al esquema 3.
